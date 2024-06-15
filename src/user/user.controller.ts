import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  BadRequestException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CheckPasswords } from "./pipes/checkPassword.pipe";
import { UserEntity } from "./entities/user.entity";
import { UserApiKeyDto } from "./dto/user-api_key.dto";
import { UserBalanceDto } from "./dto/user-balance.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("balance/:user_id")
  async getUserBalance(
    @Param("user_id") user_id,
    @Query("currency_type") currency_type: string
  ) {
    if (!currency_type) {
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
