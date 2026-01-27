import { Body, Controller, Get, Post } from "@nestjs/common";

import { PrismaQuery, PrismaQueryParams } from "@/decorators";

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
  async getPageVisits(@PrismaQuery(["url", "date"]) query: Omit<PrismaQueryParams, "include">) {
    return this.analyticsService.getPageVisits(query);
  }
}
