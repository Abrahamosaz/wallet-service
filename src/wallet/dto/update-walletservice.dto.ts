import { PartialType } from "@nestjs/mapped-types";
import { CreateWalletserviceDto } from "./createWallet.dto";

export class UpdateWalletserviceDto extends PartialType(
  CreateWalletserviceDto
) {}
