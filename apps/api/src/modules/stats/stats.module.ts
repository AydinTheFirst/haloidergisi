import { Module } from "@nestjs/common";

import { DrizzleModule } from "@/database";

import { StatsResolver } from "./stats.resolver";
import { StatsService } from "./stats.service";

@Module({
  imports: [DrizzleModule],
  providers: [StatsResolver, StatsService],
})
export class StatsModule {}
