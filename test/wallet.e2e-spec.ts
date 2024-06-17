import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { WalletModule } from "src/wallet/wallet.module";
import { WalletService } from "src/wallet/wallet.service";
import { JwtService } from "@nestjs/jwt";
import { knexProvider } from "src/config/database.config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserService } from "src/user/user.service";
import { MockUserService } from "./mocks/user.service.mock";
import { MockApiKeyGuard } from "./mocks/apiKeyGuard.mock";
import { ApiKeyGuard } from "src/guards/apiKeyGuard";
import { MockWalletService } from "./mocks/wallet.service.mock";
import { FundWithdrawDto } from "src/wallet/dto/fund-withdraw.dto";

describe("AppController (e2e)", () => {
  let wallet: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        WalletModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [
        WalletService,
        UserService,
        JwtService,
        knexProvider,
        ConfigService,
      ],
    })
      .overrideGuard(ApiKeyGuard)
      .useClass(MockApiKeyGuard)
      .overrideProvider(WalletService)
      .useValue(MockWalletService)
      .overrideProvider(UserService)
      .useValue(MockUserService)
      .compile();

    wallet = moduleFixture.createNestApplication();
    await wallet.init();
  });

  it("/transactions (GET) get all transactions", () => {
    return request(wallet.getHttpServer())
      .get("/wallet/transactions")
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual([
          {
            id: 3,
            wallet_id: 1,
            transaction_type: "fund",
            amount: "20.00",
            currency_type: "dollar",
            to_wallet_id: 1,
          },
        ]);
      });
  });

  describe("fund and transfer funds", () => {
    const fundWalletDto: FundWithdrawDto = {
      user_id: 2,
      currency_type: "dollar",
      amount: 60,
    };

    it("funds user wallet base on currency type (PUT)", () => {
      return request(wallet.getHttpServer())
        .put("/wallet/fund")
        .send(fundWalletDto)
        .expect(200)
        .expect((response) => {
          expect(response.body).toEqual({
            id: 1,
            user_id: 1,
            currency_type: "dollar",
            balance: "60.00",
          });
        });
    });

    it("widthdraw funds for user", () => {
      return request(wallet.getHttpServer())
        .put("/wallet/withdraw")
        .send(fundWalletDto)
        .expect(200)
        .expect((response) => {
          expect(response.body).toEqual({
            id: 1,
            user_id: 1,
            currency_type: "dollar",
            balance: "10.00",
            withdraw_fund: 10,
          });
        });
    });
  });

  it("transfer funds from user wallet (PUT)", () => {
    const transferWalletDto = {
      from_user_id: 1,
      to_user_id: 2,
      currency_type: "dollar",
      amount: 10,
    };

    return request(wallet.getHttpServer())
      .put("/wallet/transfer")
      .send(transferWalletDto)
      .expect(200)
      .expect("transfer successful");
  });
});
