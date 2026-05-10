import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { notificationSettings, profiles, users } from "@repo/db";
import argon2 from "argon2";
import { eq, sql } from "drizzle-orm";

import { EMAIL_EVENTS } from "@/constants";
import { DrizzleService } from "@/database";
import { DrizzleQueryParams } from "@/decorators";
import { WelcomeEmailDto } from "@/services/mail.service";
import { applyQuery } from "@/utils";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create({ name, password, email, ...createUserDto }: CreateUserDto) {
    const existingUser = await this.drizzle.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new BadRequestException(`User with email ${email} already exists`);
    }

    const user = await this.drizzle.db.transaction(async (tx) => {
      const [newUser] = await tx
        .insert(users)
        .values({
          email,
          password: await argon2.hash(password),
          ...createUserDto,
        })
        .returning();

      await tx.insert(profiles).values({
        userId: newUser.id,
        name,
      });

      await tx.insert(notificationSettings).values({
        userId: newUser.id,
      });

      return newUser;
    });

    this.eventEmitter.emit(
      EMAIL_EVENTS.WELCOME,
      new WelcomeEmailDto({
        to: user.email,
        name: name,
      }),
    );

    return user;
  }

  async findAll(query: DrizzleQueryParams) {
    const { where, orderBy, limit, offset, with: include } = applyQuery(users, query);

    const items = await this.drizzle.db.query.users.findMany({
      where,
      orderBy,
      limit,
      offset,
      with: {
        ...include,
      },
    });

    const [{ total }] = await this.drizzle.db
      .select({ total: sql<number>`count(*)` })
      .from(users)
      .where(where);

    return { items, meta: { total: Number(total), take: query.take, skip: query.skip } };
  }

  async findOne(id: string) {
    const user = await this.drizzle.db.query.users.findFirst({
      where: eq(users.id, id),
      with: { profile: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, { name, crewId, ...updateUserDto }: UpdateUserDto) {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await argon2.hash(updateUserDto.password);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.drizzle.db.query.users.findFirst({
        where: eq(users.email, updateUserDto.email),
      });

      if (existingUser) {
        throw new BadRequestException(`User with email ${updateUserDto.email} already exists`);
      }

      updateUserDto.emailVerifiedAt = null;
    }

    const updatedUser = await this.drizzle.db.transaction(async (tx) => {
      const [updatedUser] = await tx
        .update(users)
        .set({
          ...updateUserDto,
          crewId: crewId || null,
        })
        .where(eq(users.id, user.id))
        .returning();

      if (name) {
        await tx.update(profiles).set({ name }).where(eq(profiles.userId, user.id));
      }

      return updatedUser;
    });

    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    await this.drizzle.db.delete(users).where(eq(users.id, user.id));

    return { success: true };
  }
}
