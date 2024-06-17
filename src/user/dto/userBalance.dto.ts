import { IsEmail, IsInt, IsString } from "class-validator";

export class UserBalanceDto {
  @IsInt()
  user_id: number;

  @IsString()
  currency_type: string;
}
