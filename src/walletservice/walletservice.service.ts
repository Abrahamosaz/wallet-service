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

@Injectable()
export class WalletserviceService {
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
    const wallet = await this.findWalletByCurrencyType(c_type);

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
    const wallet = await this.findWalletById(fundAccountDto.user_id);

    if (!wallet) {
      return new BadRequestException("wallet with id does not exists");
    }

    const amount = fundAccountDto.amount + parseInt(wallet.balance, 10);
    await this.knex("wallets").update({
      ...wallet,
      balance: amount,
    });

    const updatedWallet = await this.knex("wallets").where({ id: wallet.id });
    return updatedWallet;
  }

  async findWalletById(id: number) {
    const [wallet] = await this.knex("wallets").where({ user_id: id });
    return wallet;
  }

  async findWalletByCurrencyType(type: string) {
    const [wallet] = await this.knex("wallets").where({ currency_type: type });
    return wallet;
  }
}
