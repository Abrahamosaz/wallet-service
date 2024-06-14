import { Controller, Get, Post, Body, Patch, Param, Put } from "@nestjs/common";
import { WalletserviceService } from "./walletservice.service";
import { CreateWalletserviceDto } from "./dto/create-walletservice.dto";
import { UpdateWalletserviceDto } from "./dto/update-walletservice.dto";
import { FundAccountDto } from "./dto/fund-account.dto";
import { WalletEntity } from "./entities/walletservice.entity";

@Controller("wallet")
export class WalletserviceController {
  constructor(private readonly walletserviceService: WalletserviceService) {}

  @Post("create")
  create(@Body() createWalletserviceDto: CreateWalletserviceDto) {
    return this.walletserviceService.create(createWalletserviceDto);
  }

  @Put("/fund")
  async fundAccount(@Body() fundAccountDto: FundAccountDto) {
    const fundedWallet =
      await this.walletserviceService.fundAccount(fundAccountDto);

    const res = {
      ...fundedWallet,
      currency_type: fundAccountDto.currency_type,
    };
    return new WalletEntity(res);
  }
}
