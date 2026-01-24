import { Body, Controller, Post } from "@nestjs/common";

import { TrackVisitDto } from "./analytics.dto";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post("track-visit")
  async trackVisit(@Body() trackVisitDto: TrackVisitDto) {
    return this.analyticsService.trackVisit(trackVisitDto);
  }
}
