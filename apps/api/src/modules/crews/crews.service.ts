import { Injectable, NotFoundException } from "@nestjs/common";
import { crews } from "@repo/db";
import { eq, sql } from "drizzle-orm";

import { DrizzleService } from "@/database";
import { DrizzleQueryParams } from "@/decorators";

import { CreateCrewDto } from "./dto/create-crew.dto";
import { UpdateCrewDto } from "./dto/update-crew.dto";

@Injectable()
export class CrewsService {
  constructor(private drizzle: DrizzleService) {}

  async create(createCrewDto: CreateCrewDto) {
    const [crew] = await this.drizzle.db.insert(crews).values(createCrewDto).returning();
    return crew;
  }

  async findAll(query: DrizzleQueryParams) {
    const items = await this.drizzle.db.query.crews.findMany({
      limit: query.take,
      offset: query.skip,
      with: {
        users: {
          columns: { id: true },
          with: { profile: true },
        },
      },
    });

    const [{ total }] = await this.drizzle.db.select({ total: sql<number>`count(*)` }).from(crews);

    return { items, meta: { total: Number(total), skip: query.skip, take: query.take } };
  }

  async findOne(id: string) {
    const crew = await this.drizzle.db.query.crews.findFirst({
      where: eq(crews.id, id),
    });

    if (!crew) {
      throw new NotFoundException(`Crew with ID ${id} not found`);
    }

    return crew;
  }

  async update(id: string, updateCrewDto: UpdateCrewDto) {
    await this.findOne(id);

    const [crew] = await this.drizzle.db
      .update(crews)
      .set(updateCrewDto)
      .where(eq(crews.id, id))
      .returning();

    return crew;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.drizzle.db.delete(crews).where(eq(crews.id, id));

    return { success: true };
  }
}
