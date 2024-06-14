import { PartialType } from '@nestjs/mapped-types';
import { CreateWalletserviceDto } from './create-walletservice.dto';

export class UpdateWalletserviceDto extends PartialType(CreateWalletserviceDto) {}
