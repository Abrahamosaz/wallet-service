import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { CreateWalletserviceDto } from "./dto/create-walletservice.dto";
import { FundWithdrawDto } from "./dto/fund-withdraw.dto";
import { WalletEntity } from "./entities/wallet-fund.entity";
import { TrasnferFundDto } from "./dto/transfer-fund.dto";
import { ApiKeyGuard } from "src/guards/apiKeyGuard";

@Controller("wallet")
@UseGuards(ApiKeyGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post("create")
  create(@Body() createWalletserviceDto: CreateWalletserviceDto) {
    return this.walletService.create(createWalletserviceDto);
  }

  @Get("all/:user_id")
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllUserWallets(@Param("user_id") userId: number) {
    return this.walletService.getAllUserWallet(userId);
  }

  @Get("transactions")
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllWalletTransactions() {
    return await this.walletService.getAllTransactions();
  }

  @Put("fund")
  @UseInterceptors(ClassSerializerInterceptor)
  async fundAccount(@Body() fundAccountDto: FundWithdrawDto) {
    const fundedWallet = await this.walletService.fundAccount(fundAccountDto);

    const res = {
      ...fundedWallet,
      currency_type: fundAccountDto.currency_type,
    };
    return new WalletEntity(res);
  }

  @Put("transfer")
  async transferFund(@Body() tranferFundDto: TrasnferFundDto) {
    return await this.walletService.transferFund(tranferFundDto);
  }

  @Put("withdraw")
  @UseInterceptors(ClassSerializerInterceptor)
  async withdrawFund(@Body() withdrawFundDto: FundWithdrawDto) {
    return await this.walletService.withdrawFund(withdrawFundDto);
  }
}
