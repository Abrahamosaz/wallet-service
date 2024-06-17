import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { knexProvider } from "src/config/database.config";
import { CreateUserDto } from "./dto/createUser.dto";
import { EmailAlreadyExistsException } from "./exceptions/user.exceptions";

const mockTrx = {
  insert: jest.fn().mockReturnThis(),
  into: jest.fn().mockReturnThis(),
  commit: jest.fn().mockResolvedValue(undefined),
  rollback: jest.fn().mockResolvedValue(undefined),
  where: jest.fn().mockResolvedValue({}),
};

// Mock Knex instance
const mockKnex = {
  transaction: jest.fn().mockResolvedValue(mockTrx),
};

describe("UserService", () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        ConfigService,
        JwtService,
        {
          provide: "KNEX_CONNECTION",
          useValue: mockKnex,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(userService).toBeDefined();
  });

  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });

  describe("register a user", () => {
    const createUserDto: CreateUserDto = {
      email: "abrahamosazee3@gmail.com",
      first_name: "abraham",
      last_name: "osazee",
      phonenumber: "08061909748",
      date_of_birth: "2001-02-23",
      password: "abrahamosazee",
      confirmPassword: "abrahamosazee",
    };

    it("user with email already exist", async () => {
      jest
        .spyOn(userService, "getUserEmailByEmail")
        .mockResolvedValue("abrahamosazee3@gmail.com");

      try {
        await userService.create(createUserDto);
      } catch (err) {
        console.log("error", err);
        expect(err).toBeInstanceOf(EmailAlreadyExistsException);
        expect(err.status).toBe(409);
        expect(err.response).toBe("User with email already exists");
      }
    });

    it("register user successfully", async () => {
      jest
        .spyOn(userService, "getUserEmailByEmail")
        .mockResolvedValue(undefined);

      // expect(await userService.create(createUserDto)).toEqual({
      //   email: "abrahamosazee3@gmail.com",
      //   first_name: "abraham",
      //   last_name: "osazee",
      //   phonenumber: "08061909748",
      //   date_of_birth: "2001-09-23",
      // });
    });
  });
});
