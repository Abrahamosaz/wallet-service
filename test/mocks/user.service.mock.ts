export const MockUserService = {
  create: jest.fn().mockResolvedValue({
    email: "abrahamosazee3@gmail.com",
    first_name: "abraham",
    last_name: "osazee",
    phonenumber: "08061909748",
    date_of_birth: "2001-02-23",
    password: "abrahamosazee",
  }),

  getApiKey: jest.fn().mockResolvedValue({
    api_key: "this is mock api key",
  }),

  getBalance: jest.fn().mockResolvedValue({
    id: expect.any(Number),
    balance: expect.any(Number),
  }),
};
