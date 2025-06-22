import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";

import { PrismaService } from "@/database";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    const tokenDoc = await this.prisma.token.findFirst({
      include: { user: true },
      where: { expiresAt: { gte: new Date() }, token },
    });

    if (!tokenDoc) {
      throw new UnauthorizedException("Invalid or expired token");
    }

    if (!tokenDoc.user) {
      throw new UnauthorizedException("User associated with token not found");
    }

    req.user = tokenDoc.user;

    return true;
  }

  extractTokenFromHeader(req: Request) {
    const [type, token] = req.headers["authorization"]?.split(" ") || [];
    return type === "Bearer" ? token : null;
  }
}
