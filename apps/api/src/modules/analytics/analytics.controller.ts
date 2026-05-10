import { Body, Controller, Get, Post } from "@nestjs/common";

import { DrizzleQuery, DrizzleQueryParams } from "@/decorators";

import { TrackVisitDto } from "./analytics.dto";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post("track-visit")
  async trackVisit(@Body() trackVisitDto: TrackVisitDto) {
    return this.analyticsService.trackVisit(trackVisitDto);
  }

  @Get("page-visits")
  async getPageVisits(@DrizzleQuery(["url", "date"]) query: Omit<DrizzleQueryParams, "include">) {
    return this.analyticsService.getPageVisits(query);
  }
}
