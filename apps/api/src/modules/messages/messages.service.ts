import { Injectable, NotFoundException } from "@nestjs/common";
import { messages } from "@repo/db";
import { eq, sql } from "drizzle-orm";

import { DrizzleService } from "@/database";
import { DrizzleQueryParams } from "@/decorators";

import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";

@Injectable()
export class MessagesService {
  constructor(private drizzle: DrizzleService) {}

  async create(createMessageDto: CreateMessageDto) {
    const [message] = await this.drizzle.db.insert(messages).values(createMessageDto).returning();
    return message;
  }

  async findAll(query: DrizzleQueryParams) {
    const items = await this.drizzle.db.query.messages.findMany({
      limit: query.take,
      offset: query.skip,
    });

    const [{ total }] = await this.drizzle.db
      .select({ total: sql<number>`count(*)` })
      .from(messages);

    return { items, meta: { total: Number(total), skip: query.skip, take: query.take } };
  }

  async findOne(id: string) {
    const message = await this.drizzle.db.query.messages.findFirst({
      where: eq(messages.id, id),
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return message;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    await this.findOne(id);

    const [message] = await this.drizzle.db
      .update(messages)
      .set(updateMessageDto)
      .where(eq(messages.id, id))
      .returning();
    return message;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.drizzle.db.delete(messages).where(eq(messages.id, id));

    return { success: true };
  }
}
