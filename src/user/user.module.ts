import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { knexProvider } from "src/config/database.config";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [UserController],
  providers: [UserService, knexProvider, JwtService],
  exports: [UserService],
})
export class UserModule {}
