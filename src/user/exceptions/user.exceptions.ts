import { HttpException, HttpStatus } from "@nestjs/common";

export class EmailAlreadyExistsException extends HttpException {
  constructor() {
    super("User with email already exists", HttpStatus.CONFLICT);
  }
}

export class UserBlackListedException extends HttpException {
  constructor() {
    super(
      "user with email is on the karma blacklisted list",
      HttpStatus.CONFLICT
    );
  }
}
