import { Injectable } from "@nestjs/common";
import { pageVisits } from "@repo/db";
import { desc, sql } from "drizzle-orm";

import { DrizzleService } from "@/database";
import { DrizzleQueryParams } from "@/decorators";

import { TrackVisitDto } from "./analytics.dto";

@Injectable()
export class AnalyticsService {
  constructor(private readonly drizzle: DrizzleService) {}

  async trackVisit(trackVisitDto: TrackVisitDto) {
    const { url } = trackVisitDto;

    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split("T")[0];

    const results = await this.drizzle.db
      .insert(pageVisits)
      .values({ url, date: dateStr, count: 1 })
      .onConflictDoUpdate({
        target: [pageVisits.url, pageVisits.date],
        set: { count: sql`${pageVisits.count} + 1` },
      })
      .returning();

    return results[0];
  }

  async getPageVisits(query: Omit<DrizzleQueryParams, "include">) {
    // Note: Drizzle relational API doesn't directly support the exact query object from the decorator.
    // Using standard Drizzle API for this.

    const items = await this.drizzle.db.query.pageVisits.findMany({
      limit: query.take,
      offset: query.skip,
      orderBy: [desc(pageVisits.date)],
    });

    const totalResult = await this.drizzle.db
      .select({ count: sql<number>`count(*)` })
      .from(pageVisits);
    const total = Number(totalResult[0].count);

    return { items, meta: { total, skip: query.skip, take: query.take } };
  }
}
