import { Injectable } from "@nestjs/common";
import { submissionCalls } from "@repo/db";
import { eq } from "drizzle-orm";

import { DrizzleService } from "../../database/drizzle.service";
import { CreateSubmissionCallDto, UpdateSubmissionCallDto } from "./dto/submission-call.dto";

@Injectable()
export class SubmissionCallsService {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll() {
    return await this.drizzle.db.query.submissionCalls.findMany({
      orderBy: (calls, { desc }) => [desc(calls.createdAt)],
    });
  }

  async findActive() {
    const now = new Date();
    return await this.drizzle.db.query.submissionCalls.findMany({
      where: (calls, { and, eq, lte, gte }) =>
        and(eq(calls.isActive, true), lte(calls.startDate, now), gte(calls.endDate, now)),
      orderBy: (calls, { desc }) => [desc(calls.createdAt)],
    });
  }

  async findOne(id: string) {
    return await this.drizzle.db.query.submissionCalls.findFirst({
      where: (calls, { eq }) => eq(calls.id, id),
    });
  }

  async create(dto: CreateSubmissionCallDto) {
    const result = await this.drizzle.db
      .insert(submissionCalls)
      .values({
        title: dto.title,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        isActive: dto.isActive ?? true,
      })
      .returning();
    return result[0];
  }

  async update(id: string, dto: UpdateSubmissionCallDto) {
    const values: any = { ...dto };
    if (dto.startDate) values.startDate = new Date(dto.startDate);
    if (dto.endDate) values.endDate = new Date(dto.endDate);

    const result = await this.drizzle.db
      .update(submissionCalls)
      .set(values)
      .where(eq(submissionCalls.id, id))
      .returning();
    return result[0];
  }

  async remove(id: string) {
    const result = await this.drizzle.db
      .delete(submissionCalls)
      .where(eq(submissionCalls.id, id))
      .returning();
    return result[0];
  }

  async checkSubmission(callId: string, userId: string) {
    return await this.drizzle.db.query.articles.findFirst({
      where: (articles, { and, eq }) =>
        and(eq(articles.callId, callId), eq(articles.authorId, userId)),
    });
  }
}
