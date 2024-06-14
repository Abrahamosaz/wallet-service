import { Test, TestingModule } from '@nestjs/testing';
import { WalletserviceService } from './walletservice.service';

describe('WalletserviceService', () => {
  let service: WalletserviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletserviceService],
    }).compile();

    service = module.get<WalletserviceService>(WalletserviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
