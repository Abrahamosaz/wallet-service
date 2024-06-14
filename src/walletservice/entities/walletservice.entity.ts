import { Exclude } from "class-transformer";

export class WalletEntity {
  id: number;
  user_id: number;
  balance: number;
  currency_type: string;

  @Exclude()
  created_at: string;

  @Exclude()
  updated_at: string;

  constructor(partial: Partial<WalletEntity>) {
    Object.assign(this, partial);
  }
}
