import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { UserModule } from "../src/user/user.module";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { knexProvider } from "src/config/database.config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MockUserService } from "./mocks/user.service.mock";
import { CreateUserDto } from "src/user/dto/createUser.dto";
import { UserApiKeyDto } from "src/user/dto/userApiKey.dto";
import { MockApiKeyGuard } from "./mocks/apiKeyGuard.mock";
import { ApiKeyGuard } from "src/guards/apiKeyGuard";

describe("UserController (e2e)", () => {
  let user: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [UserService, JwtService, knexProvider, ConfigService],
    })
      .overrideGuard(ApiKeyGuard)
      .useClass(MockApiKeyGuard)
      .overrideProvider(UserService)
      .useValue(MockUserService)
      .compile();

    user = moduleFixture.createNestApplication();
    await user.init();
  });

  it("/user/balance/1 (GET) with currency_type query parameter", () => {
    return request(user.getHttpServer())
      .get("/user/balance/1")
      .expect("Content-Type", /json/)
      .query({ currency_type: "dollar" })
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveProperty("balance");
        expect(response.body.currency_type).toBe("dollar");
      });
  });

  describe("register user", () => {
    const createUserDto: CreateUserDto = {
      email: "abrahamosazee3@gmail.com",
      first_name: "abraham",
      last_name: "osazee",
      phonenumber: "08061909748",
      date_of_birth: "2001-02-23",
      password: "abrahamosazee",
      confirmPassword: "abrahamosazee",
    };

    it("/user/register (POST) register a user successful", () => {
      return request(user.getHttpServer())
        .post("/user/register")
        .send(createUserDto)
        .expect(201)
        .expect((response) => {
          expect(response.body).toMatchObject({
            email: createUserDto.email,
            first_name: createUserDto.first_name,
            last_name: createUserDto.last_name,
            phonenumber: createUserDto.phonenumber,
            date_of_birth: createUserDto.date_of_birth,
          });
        });
    });

    it("create user with not matching passwords (POST)", () => {
      const newUserDto = {
        ...createUserDto,
        confirmPassword: "abrahamosazee2",
      };

      return request(user.getHttpServer())
        .post("/user/register")
        .send(newUserDto)
        .expect(403)
        .expect((response) => {
          expect(response.status).toBe(403);
          expect(response.body).toHaveProperty(
            "message",
            "passwords does not match"
          );
        });
    });
  });

  it("get api key with credentials", async () => {
    const userApiKeyDto: UserApiKeyDto = {
      email: "abrahamosazee3@gmail.com",
      password: "abrahamosazee",
    };
    return request(user.getHttpServer())
      .post("/user/api_key")
      .send(userApiKeyDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty("api_key", "this is mock api key");
      });
  });
});
