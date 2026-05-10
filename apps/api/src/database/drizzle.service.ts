import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { db, type Schema } from "@repo/db";
import { type NodePgDatabase } from "drizzle-orm/node-postgres";

@Injectable()
export class DrizzleService implements OnModuleInit {
  private readonly logger = new Logger(DrizzleService.name);
  public readonly db: NodePgDatabase<Schema> = db;

  async onModuleInit() {
    this.logger.log("DrizzleService initialized");
  }
}
