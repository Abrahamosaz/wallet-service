import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateWalletserviceDto } from "./dto/create-walletservice.dto";
import { UpdateWalletserviceDto } from "./dto/update-walletservice.dto";
import { Knex } from "knex";
import { ConfigService } from "@nestjs/config";
import { FundAccountDto } from "./dto/fund-account.dto";
import { UserService } from "src/user/user.service";
import { WalletEntity } from "./entities/walletservice.entity";
import { TrasnferFundDto } from "./dto/transfer-fund.dto";

@Injectable()
export class WalletService {
  constructor(
    private readonly configService: ConfigService,
    @Inject("KNEX_CONNECTION")
    private readonly knex: Knex,
    private readonly userService: UserService
  ) {}

  async create(createWalletserviceDto: CreateWalletserviceDto) {
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

    try {
      const [walletId] = await this.knex("wallets").insert({
        ...createWalletserviceDto,
      });

      const [newWallet] = await this.knex("wallets").where({ id: walletId });
      return newWallet;
    } catch (err) {
      throw new BadRequestException("wallet with this user already created");
    }
  }

  async fundAccount(fundAccountDto: FundAccountDto) {
    let selectedWallet: any;
    const wallets = await this.findWalletById(fundAccountDto.user_id);

    if (!wallets) {
      throw new BadRequestException("wallet with id does not exists");
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

    const amount = fundAccountDto.amount + parseInt(selectedWallet.balance, 10);
    await this.updateWalletBalance(selectedWallet, amount);

    const updatedWallet = await this.knex("wallets").where({
      id: selectedWallet.id,
    });
    return updatedWallet;
  }

  async getAllUserWallet(userId: number) {
    const wallets = await this.getAllWalletByUserId(userId);

    if (!wallets.length) {
      throw new NotFoundException("wallet with user id not found");
    }

    return wallets.map((wallet) => new WalletEntity(wallet));
  }

  async transferFund(tranferFundDto: TrasnferFundDto) {
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
      throw new BadRequestException("Insuficient fund to transfer");
    }

    const fromWalletBalance =
      Number(fromWallet.balance) - tranferFundDto.amount;
    const toWalletBalance = Number(toWallet.balance) + tranferFundDto.amount;

    await this.updateWalletBalance(fromWallet, fromWalletBalance);
    await this.updateWalletBalance(toWallet, toWalletBalance);

    return "transfer successful";
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
}
