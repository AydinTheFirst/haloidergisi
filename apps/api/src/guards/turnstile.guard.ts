import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";

import { TurnstileService } from "@/services";

@Injectable()
export class TurnstileGuard implements CanActivate {
  constructor(private turnstileService: TurnstileService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.body["cf-turnstile-response"];
    const ip = request.ip;

    if (!token) {
      throw new BadRequestException("Turnstile token is missing");
    }

    const isValid = await this.turnstileService.verifyToken(token, ip);

    if (!isValid) {
      throw new ForbiddenException("Invalid Turnstile token");
    }

    return true;
  }
}
