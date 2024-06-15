import { Module } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { WalletController } from "./wallet.controller";
import { knexProvider } from "src/config/database.config";
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [WalletController],
  providers: [WalletService, knexProvider, UserService, JwtService],
})
export class WalletModule {}
