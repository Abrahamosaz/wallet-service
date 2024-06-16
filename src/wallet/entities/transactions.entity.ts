import { Exclude } from "class-transformer";

export class TransactionEntity {
  id: number;
  wallet_id: number;
  transaction_type: string;
  amount: number;
  currency_type: string;
  to_wallet_id: number;

  @Exclude()
  created_at: string;

  @Exclude()
  updated_at: string;

  constructor(partial: Partial<TransactionEntity>) {
    Object.assign(this, partial);
  }
}
