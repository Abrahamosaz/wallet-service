import { Test, TestingModule } from "@nestjs/testing";
import { WalletController } from "./wallet.controller";
import { WalletService } from "./wallet.service";
import { CreateWalletserviceDto } from "./dto/createWallet.dto";
import { FundWithdrawDto } from "./dto/fundWithdraw.dto";
import { MockWalletService } from "../../test/mocks/wallet.service.mock";
import { TrasnferFundDto } from "./dto/transferFund.dto";
import { ApiKeyGuard } from "src/guards/apiKeyGuard";
import { MockApiKeyGuard } from "../../test/mocks/apiKeyGuard.mock";

describe("WalletController", () => {
  let walletController: WalletController;
  let walletService: WalletService;

  const createWalletDto: CreateWalletserviceDto = {
    user_id: 1,
    currency_type: "dollar",
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [WalletService],
    })
      .overrideGuard(ApiKeyGuard)
      .useClass(MockApiKeyGuard)
      .overrideProvider(WalletService)
      .useValue(MockWalletService)
      .compile();

    walletController = module.get<WalletController>(WalletController);
    walletService = module.get<WalletService>(WalletService);
  });

  it("should be defined", () => {
    expect(walletController).toBeDefined();
  });

  it("create wallet with user id and return the created wallet values - POST REQUEST", async () => {
    expect(await walletController.create(createWalletDto)).toEqual({
      id: 1,
      user_id: 1,
      currency_type: "dollar",
      balance: "0.00",
      created_at: "2024-06-16T16:59:37.000Z",
      updated_at: "2024-06-16T16:59:37.000Z",
    });

    expect(walletService.create).toHaveBeenCalledTimes(1);
  });

  it("get all user wallet for user id - GET REQUEST", async () => {
    expect(await walletController.getAllUserWallets(1)).toEqual([
      {
        id: 1,
        user_id: 1,
        currency_type: "dollar",
        balance: "0.00",
      },
    ]);

    expect(walletService.getAllUserWallet).toHaveBeenCalledTimes(1);
  });

  describe("fund and withdraw funds", () => {
    const fundWithdrawDto: FundWithdrawDto = {
      user_id: 1,
      currency_type: "dollar",
      amount: 30,
    };

    it("fund user wallet account - PUT REQUEST", async () => {
      expect(await walletController.fundAccount(fundWithdrawDto)).toEqual({
        id: 1,
        user_id: 1,
        currency_type: "dollar",
        balance: "60.00",
      });

      expect(walletService.fundAccount).toHaveBeenCalledTimes(1);
    });

    it("withdraw funds", async () => {
      expect(await walletController.withdrawFund(fundWithdrawDto)).toEqual({
        id: 1,
        user_id: 1,
        currency_type: "dollar",
        balance: "10.00",
        withdraw_fund: 10,
      });

      expect(walletService.withdrawFund).toHaveBeenCalledTimes(1);
    });
  });

  it("transfer funds", async () => {
    const transferFundDto: TrasnferFundDto = {
      from_user_id: 1,
      to_user_id: 2,
      currency_type: "dollar",
      amount: 20,
    };

    expect(await walletController.transferFund(transferFundDto)).toEqual(
      "transfer successful"
    );

    expect(walletService.transferFund).toHaveBeenCalledTimes(1);
  });
});
