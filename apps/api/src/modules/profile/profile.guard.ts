import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class ProfileGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;

    if (!request.user) {
      throw new UnauthorizedException("Authentication required.");
    }

    if (request.user.roles.includes("ADMIN")) {
      return true;
    }

    const profileId = this.extractProfileIdFromRequest(request);

    if (request.user.profile?.id !== profileId) {
      throw new UnauthorizedException("You do not have access to this profile.");
    }

    return true;
  }

  extractProfileIdFromRequest(request: Request): number | null {
    const profileIdParam = request.params["id"];
    if (profileIdParam) {
      return Number(profileIdParam);
    }

    const profileIdBody = request.body?.id;
    if (profileIdBody) {
      return Number(profileIdBody);
    }

    return null;
  }
}
