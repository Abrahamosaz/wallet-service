export const MockWalletService = {
  create: jest.fn().mockResolvedValue({
    id: 1,
    user_id: 1,
    currency_type: "dollar",
    balance: "0.00",
    created_at: "2024-06-16T16:59:37.000Z",
    updated_at: "2024-06-16T16:59:37.000Z",
  }),

  getAllUserWallet: jest.fn().mockResolvedValue([
    {
      id: 1,
      user_id: 1,
      currency_type: "dollar",
      balance: "0.00",
    },
  ]),

  fundAccount: jest.fn().mockResolvedValue({
    id: 1,
    user_id: 1,
    currency_type: "dollar",
    balance: "60.00",
  }),

  transferFund: jest.fn().mockResolvedValue("transfer successful"),

  withdrawFund: jest.fn().mockResolvedValue({
    id: 1,
    user_id: 1,
    currency_type: "dollar",
    balance: "10.00",
    withdraw_fund: 10,
  }),

  getAllTransactions: jest.fn().mockResolvedValueOnce([
    {
      id: 3,
      wallet_id: 1,
      transaction_type: "fund",
      amount: "20.00",
      currency_type: "dollar",
      to_wallet_id: 1,
    },
  ]),
};
