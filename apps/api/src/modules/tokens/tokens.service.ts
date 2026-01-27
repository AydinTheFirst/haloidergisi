import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import crypto from "crypto";
import { add } from "date-fns";

import { PrismaService } from "@/database";

@Injectable()
export class TokensService {
  private readonly logger = new Logger(TokensService.name);

  constructor(private readonly prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredTokens() {
    this.logger.log("Cleaning up expired tokens...");
    await this.prismaService.token.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  async generateToken(userId: string) {
    const token = await this.prismaService.token.create({
      data: {
        userId,
        expiresAt: add(new Date(), { days: 1 }),
        token: crypto.randomBytes(32).toString("hex"),
      },
    });

    return token;
  }

  async remove(token: string) {
    await this.prismaService.token.deleteMany({
      where: {
        token,
      },
    });

    return { success: true };
  }
}
