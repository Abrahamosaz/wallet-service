import { Test, TestingModule } from "@nestjs/testing";
import { WalletService } from "./wallet.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { knexProvider } from "src/config/database.config";
import { UserService } from "src/user/user.service";

describe("WalletService", () => {
  let walletService: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        UserService,
        ConfigService,
        JwtService,
        knexProvider,
      ],
    }).compile();

    walletService = module.get<WalletService>(WalletService);
  });

  it("should be defined", () => {
    expect(walletService).toBeDefined();
  });
});
