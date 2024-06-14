import { IsEmail, IsString } from "class-validator";

export class UserApiKeyDto {
  @IsEmail()
  email: string;

  @IsString()
  password;
}
