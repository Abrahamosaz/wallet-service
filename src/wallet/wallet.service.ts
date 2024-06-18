import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateWalletserviceDto } from "./dto/create-walletservice.dto";
import knex, { Knex } from "knex";
import { FundWithdrawDto } from "./dto/fund-withdraw.dto";
import { WalletEntity } from "./entities/wallet-fund.entity";
import { TrasnferFundDto } from "./dto/transfer-fund.dto";
import { TransactionEntity } from "./entities/transactions.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class WalletService {
  constructor(
    @Inject("KNEX_CONNECTION")
    private readonly knex: Knex,
    private readonly userService: UserService
  ) {}

  async create(createWalletserviceDto: CreateWalletserviceDto) {
    const trx = await this.knex.transaction();

    try {
      const user = await this.userService.findUserById(
        createWalletserviceDto.user_id
      );

      if (!user) {
        throw new NotFoundException("user with this id not found");
      }

      const c_type = createWalletserviceDto.currency_type;
      const wallet = await this.findUserWalletByCurrency(
        createWalletserviceDto.user_id,
        c_type
      );

      if (wallet) {
        throw new BadRequestException(
          `wallet with currency type ${c_type} already exists for this user`
        );
      }

      const [walletId] = await trx("wallets").insert({
        ...createWalletserviceDto,
      });

      const [newWallet] = await trx("wallets").where({ id: walletId });
      await trx.commit();

      return newWallet;
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async fundAccount(fundAccountDto: FundWithdrawDto) {
    let selectedWallet: any;
    const trx = await this.knex.transaction();

    try {
      const wallets = await this.findWalletById(fundAccountDto.user_id);

      if (!wallets) {
        throw new NotFoundException("wallet with id does not exists");
      }

      for (let wallet of wallets) {
        if (wallet.currency_type === fundAccountDto.currency_type) {
          selectedWallet = wallet;
        }
      }

      if (!selectedWallet) {
        throw new NotFoundException(
          `wallet of ${fundAccountDto.currency_type} for user id does not exist, create a wallet to fund account`
        );
      }

      const amount = fundAccountDto.amount + Number(selectedWallet.balance);
      await this.updateWalletBalance(selectedWallet, amount);

      const updatedWallet = await trx("wallets")
        .where({
          id: selectedWallet.id,
        })
        .first();

      // add transaction
      await this.addTransaction({
        wallet_id: selectedWallet.id,
        to_wallet_id: selectedWallet.id,
        transaction_type: "fund",
        amount: fundAccountDto.amount,
        currency_type: fundAccountDto.currency_type,
      });

      await trx.commit();
      return updatedWallet;
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async transferFund(tranferFundDto: TrasnferFundDto) {
    const trx = await this.knex.transaction();

    try {
      const fromWallet = await this.findUserWalletByCurrency(
        tranferFundDto.from_user_id,
        tranferFundDto.currency_type
      );

      const toWallet = await this.findUserWalletByCurrency(
        tranferFundDto.to_user_id,
        tranferFundDto.currency_type
      );

      if (!fromWallet) {
        throw new NotFoundException(
          "wallet does not exist for the sender user id, create a wallet to transfer fund"
        );
      }

      if (!toWallet) {
        throw new NotFoundException(
          "wallet does not exist for the recepient user id, create a wallet to transfer fund"
        );
      }

      if (Number(fromWallet.balance) < tranferFundDto.amount) {
        throw new BadRequestException("Insuficient funds to transfer");
      }

      const fromWalletBalance =
        Number(fromWallet.balance) - tranferFundDto.amount;
      const toWalletBalance = Number(toWallet.balance) + tranferFundDto.amount;

      await this.updateWalletBalance(fromWallet, fromWalletBalance);
      await this.updateWalletBalance(toWallet, toWalletBalance);

      // add transaction
      await this.addTransaction({
        wallet_id: fromWallet.id,
        to_wallet_id: toWallet.id,
        transaction_type: "transfer",
        amount: tranferFundDto.amount,
        currency_type: tranferFundDto.currency_type,
      });

      await trx.commit();
      return "transfer successful";
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async withdrawFund(withdrawFund: FundWithdrawDto) {
    const trx = await this.knex.transaction();

    try {
      const wallet = await this.findUserWalletByCurrency(
        withdrawFund.user_id,
        withdrawFund.currency_type
      );

      if (!wallet) {
        throw new NotFoundException(
          "wallet with user id and currency type does not eixst"
        );
      }

      if (withdrawFund.amount > Number(wallet.balance)) {
        throw new BadRequestException("Insuficient funds to withdraw");
      }

      const amount = Number(wallet.balance) - withdrawFund.amount;
      await this.updateWalletBalance(wallet, amount);

      const [updatedWallet] = await this.knex("wallets").where({
        id: wallet.id,
      });

      // add transaction
      await this.addTransaction({
        wallet_id: wallet.id,
        to_wallet_id: wallet.id,
        transaction_type: "withdraw",
        amount: withdrawFund.amount,
        currency_type: withdrawFund.currency_type,
      });

      await trx.commit();
      return new WalletEntity({
        ...updatedWallet,
        withdraw_fund: withdrawFund.amount,
      });
    } catch (err) {
      console.log("withdraw", err);
      await trx.rollback();
      throw err;
    }
  }

  async getAllTransactions() {
    const trx = await this.knex.transaction();

    try {
      const transactions = await trx.select("*").from("transactions");
      await trx.commit();

      return transactions.map((trx) => new TransactionEntity(trx));
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async getAllUserWallet(userId: number) {
    const wallets = await this.getAllWalletByUserId(userId);

    if (!wallets.length) {
      throw new NotFoundException("wallet with user id not found");
    }

    return wallets.map((wallet) => new WalletEntity(wallet));
  }

  async findWalletById(id: number) {
    return await this.knex("wallets").where({ user_id: id });
  }

  async findUserWalletByCurrency(userId: number, type: string) {
    const [wallet] = await this.knex("wallets").where({
      user_id: userId,
      currency_type: type,
    });
    return wallet;
  }

  async getAllWalletByUserId(userId: number) {
    const wallets = await this.knex("wallets").where({
      user_id: userId,
    });

    return wallets;
  }

  async updateWalletBalance(wallet: any, balance: number) {
    await this.knex("wallets").where({ id: wallet.id }).update({ balance });
  }

  async addTransaction(transactionDto: any) {
    const [transactionId] =
      await this.knex("transactions").insert(transactionDto);
    return await this.knex("transactions").where({ id: transactionId }).first();
  }
}
