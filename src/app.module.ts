import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { knexProvider } from "./config/database.config";
import { UserModule } from "./user/user.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { WalletModule } from "./wallet/wallet.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService, knexProvider],
})
export class AppModule {}
