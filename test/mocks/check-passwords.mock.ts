import { Injectable, PipeTransform, BadRequestException } from "@nestjs/common";
import { CreateUserDto } from "../../src/user/dto/create-user.dto";

@Injectable()
export class MockCheckPasswords implements PipeTransform {
  transform(value: CreateUserDto) {
    console.log("running test code");
    if (value.password !== value.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }
    return value;
  }
}
