import type { Role, User } from "@repo/db";

import { createParamDecorator, SetMetadata } from "@nestjs/common";

import { METADATA_KEY } from "@/constants";

export const AllowAnonymous = () => SetMetadata(METADATA_KEY.PUBLIC, true);

export const OptionalAuth = () => SetMetadata(METADATA_KEY.OPTIONAL_AUTH, true);

export const Roles = (...roles: Role[]) => SetMetadata(METADATA_KEY.ROLES, roles);

export const Auth = createParamDecorator((data: keyof User, ctx): User | undefined => {
  const request = ctx.switchToHttp().getRequest();
  return data ? request.user?.[data as keyof User] : request.user;
});
