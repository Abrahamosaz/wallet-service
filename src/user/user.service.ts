import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { axiosConfig } from "src/config/axios.config";
import { ConfigService } from "@nestjs/config";
import { Knex } from "knex";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserEntity } from "./entities/user.entity";
import {
  EmailAlreadyExistsException,
  UserBlackListedException,
} from "./exceptions/user.exceptions";
import { UserApiKeyDto } from "./dto/user-api_key.dto";

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
      const [userId] = await this.knex("users").insert({
        ...createUserDto,
        password: hashPassword,
      });

      // Retrieve the newly created user
      const [newUser] = await this.knex("users").where({ id: userId });

      return newUser;
    }
  }

  async getApiKey(userApiKeyDto: UserApiKeyDto) {
    const email = userApiKeyDto.email;
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
    return {
      api_key: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("JWT_SECRET"),
        expiresIn: "1day",
      }),
    };
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
