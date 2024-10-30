import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { Roles } from "@/common/decorators";
import { User } from "@/prisma";

@Injectable()
export class RolesGuard implements CanActivate {
  matchRoles = (roles: string[], userRoles: string[]): boolean => {
    return roles.some((role) => userRoles.includes(role));
  };

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    const isAllowed = this.matchRoles(roles, user.roles);

    if (!isAllowed) {
      throw new ForbiddenException(
        "You don't have permission to access this resource"
      );
    }

    return isAllowed;
  }
}
