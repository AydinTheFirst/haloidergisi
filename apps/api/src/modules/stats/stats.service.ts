import { Injectable } from "@nestjs/common";
import { articles, messages, pageVisits, postReactions, posts, users } from "@repo/db";
import { and, count, gte, lte, sql, sum } from "drizzle-orm";

import { DrizzleService } from "@/database";

import { DashboardStats, StatusCount, TimeSeriesPoint } from "./stats.types";

interface DateRangeArgs {
  from?: string;
  to?: string;
}

function toDateBound(dateStr: string | undefined, endOfDay = false): Date | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return undefined;
  if (endOfDay) {
    d.setHours(23, 59, 59, 999);
  } else {
    d.setHours(0, 0, 0, 0);
  }
  return d;
}

function formatDateTR(date: Date): string {
  return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
}

@Injectable()
export class StatsService {
  constructor(private readonly drizzle: DrizzleService) {}

  async getDashboardStats({ from, to }: DateRangeArgs): Promise<DashboardStats> {
    const fromDate = toDateBound(from);
    const toDate = toDateBound(to, true);

    const db = this.drizzle.db;

    // Build date filters
    const visitDateFilter = and(
      fromDate ? gte(pageVisits.date, fromDate.toISOString().split("T")[0]) : undefined,
      toDate ? lte(pageVisits.date, toDate.toISOString().split("T")[0]) : undefined,
    );

    const userDateFilter = and(
      fromDate ? gte(users.createdAt, fromDate) : undefined,
      toDate ? lte(users.createdAt, toDate) : undefined,
    );

    const messageDateFilter = and(
      fromDate ? gte(messages.createdAt, fromDate) : undefined,
      toDate ? lte(messages.createdAt, toDate) : undefined,
    );

    const articleDateFilter = and(
      fromDate ? gte(articles.createdAt, fromDate) : undefined,
      toDate ? lte(articles.createdAt, toDate) : undefined,
    );

    // Run all aggregations in parallel
    const [
      visitsSumResult,
      usersCountResult,
      messagesCountResult,
      articlesCountResult,
      postsCountResult,
      likesCountResult,
      dislikesCountResult,
      articlesByStatusResult,
      postsByStatusResult,
      visitsOverTimeResult,
      usersOverTimeResult,
      messagesOverTimeResult,
      articlesOverTimeResult,
    ] = await Promise.all([
      // Total page visits (sum of counts)
      db
        .select({ total: sum(pageVisits.count) })
        .from(pageVisits)
        .where(visitDateFilter),

      // Total users registered
      db.select({ total: count() }).from(users).where(userDateFilter),

      // Total messages
      db.select({ total: count() }).from(messages).where(messageDateFilter),

      // Total articles
      db.select({ total: count() }).from(articles).where(articleDateFilter),

      // Total posts (no date filter for all-time count)
      db.select({ total: count() }).from(posts),

      // Total likes
      db
        .select({ total: count() })
        .from(postReactions)
        .where(sql`${postReactions.type} = 'LIKE'`),

      // Total dislikes
      db
        .select({ total: count() })
        .from(postReactions)
        .where(sql`${postReactions.type} = 'DISLIKE'`),

      // Articles grouped by status
      db
        .select({ status: articles.status, total: count() })
        .from(articles)
        .where(articleDateFilter)
        .groupBy(articles.status),

      // Posts grouped by status
      db.select({ status: posts.status, total: count() }).from(posts).groupBy(posts.status),

      // Page visits over time (grouped by date)
      db
        .select({ date: pageVisits.date, total: sum(pageVisits.count) })
        .from(pageVisits)
        .where(visitDateFilter)
        .groupBy(pageVisits.date)
        .orderBy(pageVisits.date),

      // User registrations over time
      db
        .select({ date: sql<string>`date_trunc('day', ${users.createdAt})::date`, total: count() })
        .from(users)
        .where(userDateFilter)
        .groupBy(sql`date_trunc('day', ${users.createdAt})::date`)
        .orderBy(sql`date_trunc('day', ${users.createdAt})::date`),

      // Messages over time
      db
        .select({
          date: sql<string>`date_trunc('day', ${messages.createdAt})::date`,
          total: count(),
        })
        .from(messages)
        .where(messageDateFilter)
        .groupBy(sql`date_trunc('day', ${messages.createdAt})::date`)
        .orderBy(sql`date_trunc('day', ${messages.createdAt})::date`),

      // Articles over time
      db
        .select({
          date: sql<string>`date_trunc('day', ${articles.createdAt})::date`,
          total: count(),
        })
        .from(articles)
        .where(articleDateFilter)
        .groupBy(sql`date_trunc('day', ${articles.createdAt})::date`)
        .orderBy(sql`date_trunc('day', ${articles.createdAt})::date`),
    ]);

    const toTimeSeries = (rows: { date: unknown; total: unknown }[]): TimeSeriesPoint[] =>
      rows.map((r) => ({
        date: formatDateTR(new Date(r.date as string)),
        count: Number(r.total) || 0,
      }));

    const toStatusCount = (rows: { status: unknown; total: unknown }[]): StatusCount[] =>
      rows.map((r) => ({
        status: r.status as string,
        count: Number(r.total) || 0,
      }));

    return {
      totalVisits: Number(visitsSumResult[0]?.total) || 0,
      totalUsers: Number(usersCountResult[0]?.total) || 0,
      totalMessages: Number(messagesCountResult[0]?.total) || 0,
      totalArticles: Number(articlesCountResult[0]?.total) || 0,
      totalPosts: Number(postsCountResult[0]?.total) || 0,
      totalLikes: Number(likesCountResult[0]?.total) || 0,
      totalDislikes: Number(dislikesCountResult[0]?.total) || 0,
      articlesByStatus: toStatusCount(articlesByStatusResult),
      postsByStatus: toStatusCount(postsByStatusResult),
      visitsOverTime: toTimeSeries(visitsOverTimeResult),
      usersOverTime: toTimeSeries(usersOverTimeResult),
      messagesOverTime: toTimeSeries(messagesOverTimeResult),
      articlesOverTime: toTimeSeries(articlesOverTimeResult),
    };
  }
}
