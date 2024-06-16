import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { ConfigService } from "@nestjs/config";
import { Knex } from "knex";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import {
  EmailAlreadyExistsException,
  UserBlackListedException,
} from "./exceptions/user.exceptions";
import { UserApiKeyDto } from "./dto/user-api_key.dto";
import { UserBalanceDto } from "./dto/user-balance.dto";
import { axiosConfig } from "src/config/axios.config";

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    @Inject("KNEX_CONNECTION")
    private readonly knex: Knex
  ) {}

  async create(createUserDto: CreateUserDto) {
    const email = createUserDto.email;
    const client = axiosConfig(this.configService);

    const trx = await this.knex.transaction();

    try {
      const res = await client.get(`/verification/karma/${email}`);
      if (res.status === 200) {
        throw new UserBlackListedException();
      }
    } catch (err) {
      const userEmail = await this.getUserEmailByEmail(email);

      if (userEmail) {
        throw new EmailAlreadyExistsException();
      }

      const hashPassword = await this.generateHash(createUserDto.password);

      try {
        const [userId] = await trx("users").insert({
          ...createUserDto,
          password: hashPassword,
        });

        // Retrieve the newly created user
        const [newUser] = await trx("users").where({ id: userId });

        await trx.commit();
        return newUser;
      } catch (err) {
        await trx.rollback();
        throw new InternalServerErrorException(err.response.message);
      }
    }
  }

  async getApiKey(userApiKeyDto: UserApiKeyDto) {
    const trx = await this.knex.transaction();

    const email = userApiKeyDto.email;

    try {
      const [user] = await this.knex("users").where({ email });

      if (!user) {
        throw new NotFoundException("user not found, register to get api key");
      }

      const isMatch = await this.verifyPasswordHash(
        user.password,
        userApiKeyDto.password
      );

      if (!isMatch) {
        throw new UnauthorizedException("Invalid credentials");
      }

      const payload = { sub: user.id, email: user.email };

      await trx.commit();
      return {
        api_key: await this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>("JWT_SECRET"),
          expiresIn: "1d",
        }),
      };
    } catch (err) {
      trx.rollback();
      throw new InternalServerErrorException(err.response.message);
    }
  }

  async getBalance(userBalanceDto: UserBalanceDto) {
    const trx = await this.knex.transaction();

    try {
      const user = await this.knex("users")
        .innerJoin("wallets", "users.id", "wallets.user_id")
        .select(
          "users.id",
          "users.email",
          "wallets.balance",
          "wallets.currency_type"
        )
        .where({
          "users.id": userBalanceDto.user_id,
          "wallets.currency_type": userBalanceDto.currency_type,
        })
        .first();

      await trx.commit();

      if (!user) {
        throw new NotFoundException(
          "Wallet does not exist for the user id and currency type"
        );
      }

      return user;
    } catch (err) {
      console.log("error", err);
      await trx.rollback();
      throw new InternalServerErrorException(err.response.message);
    }
  }

  async getUserEmailByEmail(email: string) {
    const [user] = await this.knex("users").where({ email }).select("email");
    return user?.email;
  }

  async findUserById(id: number) {
    const [user] = await this.knex("users").where({ id });
    return user;
  }

  async generateHash(password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  async verifyPasswordHash(hash: string, password: string) {
    return await bcrypt.compare(password, hash);
  }
}
