import { IsDecimal, IsInt, IsString } from "class-validator";

export class FundAccountDto {
  @IsInt()
  user_id: number;

  @IsString()
  currency_type: string;

  @IsInt()
  amount: number;
}
