import { Test, TestingModule } from '@nestjs/testing';
import { WalletserviceController } from './walletservice.controller';
import { WalletserviceService } from './walletservice.service';

describe('WalletserviceController', () => {
  let controller: WalletserviceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletserviceController],
      providers: [WalletserviceService],
    }).compile();

    controller = module.get<WalletserviceController>(WalletserviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
