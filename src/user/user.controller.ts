import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  BadRequestException,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { CheckPasswords } from "./pipes/checkPassword.pipe";
import { UserEntity } from "./entities/user.entity";
import { UserApiKeyDto } from "./dto/userApiKey.dto";
import { ApiKeyGuard } from "src/guards/apiKeyGuard";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("balance/:user_id")
  @UseGuards(ApiKeyGuard)
  async getUserBalance(
    @Param("user_id") user_id: number,
    @Query("currency_type") currency_type: string
  ) {
    if (!currency_type) {
      console.log("get error here");
      throw new BadRequestException("provide currency type in query string");
    }

    return await this.userService.getBalance({ user_id, currency_type });
  }

  @Post("register")
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body(new CheckPasswords()) createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return new UserEntity(user);
  }

  @Post("/api_key")
  async getApikey(@Body() userApiKeyDto: UserApiKeyDto) {
    return await this.userService.getApiKey(userApiKeyDto);
  }
}
