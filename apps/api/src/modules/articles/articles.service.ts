import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { articles } from "@repo/db";
import { eq } from "drizzle-orm";

import { DrizzleService } from "../../database/drizzle.service";
import { CreateArticleDto, UpdateArticleDto, UpdateArticleStatusDto } from "./dto/article.dto";

@Injectable()
export class ArticlesService {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll(filters: { callId?: string; status?: string; authorId?: string }) {
    return await this.drizzle.db.query.articles.findMany({
      where: (articles, { eq, and }) => {
        const conditions: any[] = [];
        if (filters.callId) conditions.push(eq(articles.callId, filters.callId));
        if (filters.status) conditions.push(eq(articles.status, filters.status as any));
        if (filters.authorId) conditions.push(eq(articles.authorId, filters.authorId));
        return and(...conditions);
      },
      with: {
        author: {
          with: {
            profile: true,
          },
        },
        call: true,
      },
      orderBy: (articles, { desc }) => [desc(articles.createdAt)],
    });
  }

  async findMyArticles(authorId: string) {
    return await this.drizzle.db.query.articles.findMany({
      where: (articles, { eq }) => eq(articles.authorId, authorId),
      with: {
        call: true,
      },
      orderBy: (articles, { desc }) => [desc(articles.createdAt)],
    });
  }

  async findOne(id: string) {
    const article = await this.drizzle.db.query.articles.findFirst({
      where: (articles, { eq }) => eq(articles.id, id),
      with: {
        author: {
          with: {
            profile: true,
          },
        },
        call: true,
      },
    });
    if (!article) throw new NotFoundException("Yazı bulunamadı.");
    return article;
  }

  async create(authorId: string, dto: CreateArticleDto) {
    const now = new Date();

    // Check if the call is active
    const activeCall = await this.drizzle.db.query.submissionCalls.findFirst({
      where: (calls, { and, eq, lte, gte }) =>
        and(
          eq(calls.id, dto.callId),
          eq(calls.isActive, true),
          lte(calls.startDate, now),
          gte(calls.endDate, now),
        ),
    });

    if (!activeCall) {
      throw new BadRequestException("Bu ilan şu anda yazı kabulüne kapalıdır.");
    }

    // Check if the author already submitted to this call
    const existingArticle = await this.drizzle.db.query.articles.findFirst({
      where: (articles, { and, eq }) =>
        and(eq(articles.callId, dto.callId), eq(articles.authorId, authorId)),
    });

    if (existingArticle) {
      throw new BadRequestException(
        "Bu ilana daha önce yazı gönderdiniz. Her ilana yalnızca bir yazı gönderebilirsiniz.",
      );
    }

    const result = await this.drizzle.db
      .insert(articles)
      .values({
        callId: dto.callId,
        authorId,
        title: dto.title,
        content: dto.content,
        status: "PENDING",
      })
      .returning();
    return result[0];
  }

  async update(id: string, dto: UpdateArticleDto) {
    const result = await this.drizzle.db
      .update(articles)
      .set({
        title: dto.title,
        content: dto.content,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id))
      .returning();
    return result[0];
  }

  async findByCallAndAuthor(callId: string, authorId: string) {
    return await this.drizzle.db.query.articles.findFirst({
      where: (articles, { and, eq }) =>
        and(eq(articles.callId, callId), eq(articles.authorId, authorId)),
    });
  }

  async updateStatus(id: string, dto: UpdateArticleStatusDto) {
    const result = await this.drizzle.db
      .update(articles)
      .set({
        status: dto.status as any,
        adminNote: dto.adminNote,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id))
      .returning();
    return result[0];
  }

  async remove(id: string) {
    const result = await this.drizzle.db.delete(articles).where(eq(articles.id, id)).returning();
    return result[0];
  }
}
