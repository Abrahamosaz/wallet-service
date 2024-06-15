import { IsDecimal, IsInt, IsString } from "class-validator";

export class TrasnferFundDto {
  @IsInt()
  from_user_id: number;

  @IsInt()
  to_user_id: number;

  @IsString()
  currency_type: string;

  @IsInt()
  amount: number;
}
