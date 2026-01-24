import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Injectable, Logger } from "@nestjs/common";
import { PrismaClient, adapter } from "@repo/db";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log("Connected to the database successfully.");
    } catch (error) {
      this.logger.error("Failed to connect to the database.", error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
