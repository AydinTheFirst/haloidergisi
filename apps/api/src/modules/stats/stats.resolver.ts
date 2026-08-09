import { Args, Query, Resolver } from "@nestjs/graphql";
import { Role } from "@repo/db";

import { Roles } from "@/decorators";

import { StatsService } from "./stats.service";
import { DashboardStats } from "./stats.types";

@Resolver()
export class StatsResolver {
  constructor(private readonly statsService: StatsService) {}

  @Query(() => DashboardStats, { name: "dashboardStats" })
  @Roles(Role.ADMIN)
  async getDashboardStats(
    @Args("from", { nullable: true, type: () => String }) from?: string,
    @Args("to", { nullable: true, type: () => String }) to?: string,
  ): Promise<DashboardStats> {
    return this.statsService.getDashboardStats({ from, to });
  }
}
