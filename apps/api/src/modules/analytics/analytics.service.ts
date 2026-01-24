import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/database";

import { TrackVisitDto } from "./analytics.dto";

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async trackVisit(trackVisitDto: TrackVisitDto) {
    const { url } = trackVisitDto;

    const pageVisit = await this.prisma.pageVisit.upsert({
      where: { pageUrl: url },
      update: { count: { increment: 1 }, visitedAt: new Date() },
      create: { pageUrl: url, count: 1 },
    });

    return pageVisit;
  }
}
