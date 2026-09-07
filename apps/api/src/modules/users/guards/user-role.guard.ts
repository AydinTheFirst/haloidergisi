import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Role } from "@repo/db";

import { UsersService } from "../users.service";

const PRIVILEGED_ROLES: Role[] = [Role.ADMIN, Role.SUPER_ADMIN];

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const body = request.body ?? {};

    if (!("roles" in body)) {
      return true;
    }

    if (!user) {
      throw new ForbiddenException("Authentication required.");
    }

    if (user.roles?.includes(Role.SUPER_ADMIN)) {
      return true;
    }

    if (!user.roles?.includes(Role.ADMIN)) {
      throw new ForbiddenException("Rol değiştirme yetkiniz yok.");
    }

    const requestedRoles: string[] = body.roles ?? [];
    if (requestedRoles.some((role) => PRIVILEGED_ROLES.includes(role as Role))) {
      throw new ForbiddenException("Bu rolü atama yetkiniz yok.");
    }

    const targetId = request.params?.id;
    if (targetId) {
      const target = await this.usersService.findOne(targetId);
      if (target.roles?.some((role) => PRIVILEGED_ROLES.includes(role as Role))) {
        throw new ForbiddenException("Bu kullanıcının rolünü değiştirme yetkiniz yok.");
      }
    }

    return true;
  }
}
