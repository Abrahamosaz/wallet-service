import { IsInt, IsString } from "class-validator";

export class FundWithdrawDto {
  @IsInt()
  user_id: number;

  @IsString()
  currency_type: string;

  @IsInt()
  amount: number;
}
