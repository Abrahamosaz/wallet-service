import { CanActivate, ExecutionContext } from "@nestjs/common";

export class MockApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true; // Always allow access
  }
}
