import { Exclude } from "class-transformer";

export class UserEntity {
  email: string;

  first_name: string;

  last_name: string;

  phonenumber: string;

  date_of_birth: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
