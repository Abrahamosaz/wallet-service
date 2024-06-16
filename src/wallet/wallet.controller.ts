import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ClassSerializerInterceptor,
  UseInterceptors,
} from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { CreateWalletserviceDto } from "./dto/create-walletservice.dto";
import { FundWithdrawDto } from "./dto/fund-withdraw.dto";
import { WalletEntity } from "./entities/wallet-fund.entity";
import { TrasnferFundDto } from "./dto/transfer-fund.dto";

@Controller("wallet")
export class WalletController {
  constructor(private readonly walletserviceService: WalletService) {}

  @Post("create")
  create(@Body() createWalletserviceDto: CreateWalletserviceDto) {
    return this.walletserviceService.create(createWalletserviceDto);
  }

  @Get("all/:user_id")
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllUserWallets(@Param("user_id") userId: number) {
    return this.walletserviceService.getAllUserWallet(userId);
  }

  @Get("transactions")
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllWalletTransactions() {
    return await this.walletserviceService.getAllTransactions();
  }

  @Put("fund")
  @UseInterceptors(ClassSerializerInterceptor)
  async fundAccount(@Body() fundAccountDto: FundWithdrawDto) {
    const fundedWallet =
      await this.walletserviceService.fundAccount(fundAccountDto);

    const res = {
      ...fundedWallet,
      currency_type: fundAccountDto.currency_type,
    };
    return new WalletEntity(res);
  }

  @Put("transfer")
  async transferFund(@Body() tranferFundDto: TrasnferFundDto) {
    return await this.walletserviceService.transferFund(tranferFundDto);
  }

  @Put("withdraw")
  async withdrawFund(@Body() withdrawFundDto: FundWithdrawDto) {
    return await this.walletserviceService.withdrawFund(withdrawFundDto);
  }
}
