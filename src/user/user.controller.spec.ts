import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MockUserService } from "../../test/mocks/user.service.mock";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserEntity } from "./entities/user.entity";
import { UserApiKeyDto } from "./dto/userApiKey.dto";
import { ApiKeyGuard } from "src/guards/apiKeyGuard";
import { MockApiKeyGuard } from "../../test/mocks/apiKeyGuard.mock";

describe("UserController", () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideGuard(ApiKeyGuard)
      .useClass(MockApiKeyGuard)
      .overrideProvider(UserService)
      .useValue(MockUserService)
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(userController).toBeDefined();
  });

  describe("onBoarding a user", () => {
    const createUserDto: CreateUserDto = {
      email: "abrahamosazee3@gmail.com",
      first_name: "abraham",
      last_name: "osazee",
      phonenumber: "08061909748",
      date_of_birth: "2001-02-23",
      password: "abrahamosazee",
      confirmPassword: "abrahamosazee32",
    };

    it("should return a new user entity on successful registration", async () => {
      const result = {
        email: "abrahamosazee3@gmail.com",
        first_name: "abraham",
        last_name: "osazee",
        phonenumber: "08061909748",
        date_of_birth: "2001-02-23",
        password: "abrahamosazee",
      };

      expect(await userController.create(createUserDto)).toEqual(
        new UserEntity(result)
      );

      expect(userService.create).toHaveBeenCalledTimes(1);
    });
  });

  it("test getting api key contoller", async () => {
    const userApiKeyDto: UserApiKeyDto = {
      email: "abrahamosazee3@gmail.com",
      password: "abrahamosazee32",
    };

    expect(await userController.getApikey(userApiKeyDto)).toEqual({
      api_key: "this is mock api key",
    });

    expect(userService.getApiKey).toHaveBeenCalledTimes(1);
  });

  describe("get user balance with id", () => {
    it("wallet does not exist for user id error", async () => {
      expect(await userController.getUserBalance(1, "dollar")).toEqual({
        id: 1,
        balance: 20,
        currency_type: "dollar",
      });

      expect(userService.getBalance).toHaveBeenCalledTimes(1);
    });
  });
});
