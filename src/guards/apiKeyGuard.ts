import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const BearerToken: string | undefined =
      (request.headers["authorization"] as string) ||
      (request.headers["Authorization"] as string);

    const api_key = BearerToken?.split(" ")[1];

    return await this.verifyApiKey(api_key);
  }

  async verifyApiKey(api_key: string): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(api_key, {
        secret: this.configService.get<string>("JWT_SECRET"),
      });

      const user = this.userService.findUserById(payload.sub);

      if (!user) {
        throw new UnauthorizedException(
          "user with this api key does not exist"
        );
      }

      return true;
    } catch {
      throw new UnauthorizedException("provide a valid api key");
    }
  }
}
