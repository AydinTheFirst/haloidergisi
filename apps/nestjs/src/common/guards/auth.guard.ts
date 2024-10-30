import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Observable<boolean> | Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    return request.user ? true : false;
  }
}
