import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { profiles } from "@repo/db";
import { eq, sql } from "drizzle-orm";

import { DrizzleService } from "@/database";
import { DrizzleQueryParams } from "@/decorators";

import { UpdateProfileDto } from "./profile.dto";

@Injectable()
export class ProfileService {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll(query: DrizzleQueryParams) {
    const items = await this.drizzle.db.query.profiles.findMany({
      limit: query.take,
      offset: query.skip,
    });

    const [{ total }] = await this.drizzle.db
      .select({ total: sql<number>`count(*)` })
      .from(profiles);

    return { items, meta: { total: Number(total), skip: query.skip, take: query.take } };
  }

  async findOne(id: string) {
    const profile = await this.drizzle.db.query.profiles.findFirst({
      where: eq(profiles.id, id),
    });

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    return profile;
  }

  async findByUserId(userId: string) {
    const profile = await this.drizzle.db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (!profile) {
      throw new BadRequestException("Profile not found");
    }

    return profile;
  }

  async update(id: string, data: UpdateProfileDto) {
    await this.findOne(id);

    const [updatedProfile] = await this.drizzle.db
      .update(profiles)
      .set(data)
      .where(eq(profiles.id, id))
      .returning();

    return updatedProfile;
  }
}
