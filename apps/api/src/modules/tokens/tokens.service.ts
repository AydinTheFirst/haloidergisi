import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { tokens } from "@repo/db";
import crypto from "crypto";
import { add } from "date-fns";
import { eq, lt } from "drizzle-orm";

import { DrizzleService } from "@/database";

@Injectable()
export class TokensService {
  private readonly logger = new Logger(TokensService.name);

  constructor(private readonly drizzle: DrizzleService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredTokens() {
    this.logger.log("Cleaning up expired tokens...");
    await this.drizzle.db.delete(tokens).where(lt(tokens.expiresAt, new Date()));
  }

  async generateToken(userId: string) {
    const [token] = await this.drizzle.db
      .insert(tokens)
      .values({
        userId,
        expiresAt: add(new Date(), { days: 1 }),
        token: crypto.randomBytes(32).toString("hex"),
      })
      .returning();

    return token;
  }

  async remove(token: string) {
    await this.drizzle.db.delete(tokens).where(eq(tokens.token, token));

    return { success: true };
  }
}
