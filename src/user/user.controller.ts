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
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CheckPasswords } from "./pipes/checkPassword.pipe";
import { UserEntity } from "./entities/user.entity";
import { UserApiKeyDto } from "./dto/user-api_key.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

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
