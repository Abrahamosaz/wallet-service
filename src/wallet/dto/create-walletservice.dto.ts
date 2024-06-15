import { IsEnum, IsInt } from "class-validator";

export enum CurrencyType {
  Naira = "naira",
  Dollar = "dollar",
}

export class CreateWalletserviceDto {
  @IsInt()
  user_id: number;

  @IsEnum(CurrencyType)
  currency_type: string;
}
