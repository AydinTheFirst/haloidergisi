import { Body, Controller, Get, Post } from "@nestjs/common";
import { Role } from "@repo/db";

import { AllowAnonymous, DrizzleQuery, DrizzleQueryParams, Roles } from "@/decorators";

import { TrackVisitDto } from "./analytics.dto";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post("track-visit")
  @AllowAnonymous()
  async trackVisit(@Body() trackVisitDto: TrackVisitDto) {
    return this.analyticsService.trackVisit(trackVisitDto);
  }

  @Get("page-visits")
  @Roles(Role.ADMIN)
  async getPageVisits(@DrizzleQuery(["url", "date"]) query: Omit<DrizzleQueryParams, "include">) {
    return this.analyticsService.getPageVisits(query);
  }
}
