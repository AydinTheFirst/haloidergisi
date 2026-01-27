import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/database";
import { PrismaQueryParams } from "@/decorators";

import { TrackVisitDto } from "./analytics.dto";

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async trackVisit(trackVisitDto: TrackVisitDto) {
    const { url } = trackVisitDto;

    const date = new Date();
    date.setHours(0, 0, 0, 0);

    const pageVisit = await this.prisma.pageVisit.upsert({
      where: {
        url_date: { url, date },
      },
      create: { url, date, count: 1 },
      update: { count: { increment: 1 } },
    });

    return pageVisit;
  }

  async getPageVisits(query: Omit<PrismaQueryParams, "include">) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.pageVisit.findMany({
        ...query,
        orderBy: { date: "desc" },
      }),
      this.prisma.pageVisit.count({ where: query.where }),
    ]);

    return { items, meta: { total, skip: query.skip, take: query.take } };
  }
}
