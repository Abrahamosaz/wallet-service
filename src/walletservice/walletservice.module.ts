import { Module } from "@nestjs/common";
import { WalletserviceService } from "./walletservice.service";
import { WalletserviceController } from "./walletservice.controller";
import { knexProvider } from "src/config/database.config";
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [WalletserviceController],
  providers: [WalletserviceService, knexProvider, UserService, JwtService],
})
export class WalletserviceModule {}
