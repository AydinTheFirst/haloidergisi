import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

// @GetUser() decorator
export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  }
);
