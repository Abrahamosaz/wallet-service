import { Test, TestingModule } from "@nestjs/testing";
import { WalletserviceController } from "./wallet.controller";
import { WalletserviceService } from "./wallet.service";

describe("WalletserviceController", () => {
  let controller: WalletserviceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletserviceController],
      providers: [WalletserviceService],
    }).compile();

    controller = module.get<WalletserviceController>(WalletserviceController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
