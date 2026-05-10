import { BadRequestException, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { posts, themes } from "@repo/db";
import { eq, or, sql } from "drizzle-orm";
import slugify from "slugify";

import { EMAIL_EVENTS } from "@/constants";
import { DrizzleService } from "@/database";
import { DrizzleQueryParams } from "@/decorators";
import { NewPostEmailDto } from "@/services/mail.service";
import { applyQuery } from "@/utils";

import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostsService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  makeSlug(title: string) {
    return slugify(title, { lower: true, strict: true }) + "-" + Date.now();
  }

  async create(createPostDto: CreatePostDto) {
    const { themes: themesData, ...rest } = createPostDto;

    const post = await this.drizzle.db.transaction(async (tx) => {
      const [newPost] = await tx
        .insert(posts)
        .values({
          ...rest,
          slug: this.makeSlug(createPostDto.title),
        })
        .returning();

      if (themesData && themesData.length > 0) {
        await tx.insert(themes).values(
          themesData.map((t) => ({
            postId: newPost.id,
            work: t.work,
            category: t.category,
          })),
        );
      }

      return newPost;
    });

    this.eventEmitter.emit(
      EMAIL_EVENTS.NEW_POST,
      new NewPostEmailDto({
        title: post.title,
        content: post.content ?? "",
        slug: post.slug,
        coverImage: post.coverImage ?? "",
      }),
    );

    return post;
  }

  async findAll(query: DrizzleQueryParams) {
    const { where, orderBy, limit, offset, with: include } = applyQuery(posts, query);

    const items = await this.drizzle.db.query.posts.findMany({
      limit,
      offset,
      where,
      orderBy,
      with: {
        themes: true,
        ...include,
      },
    });

    const [{ total }] = await this.drizzle.db
      .select({ total: sql<number>`count(*)` })
      .from(posts)
      .where(where);

    return { items, meta: { total: Number(total), take: query.take, skip: query.skip } };
  }

  async findOne(id: string) {
    const post = await this.drizzle.db.query.posts.findFirst({
      where: or(eq(posts.id, id), eq(posts.slug, id)),
      with: {
        themes: true,
        category: true,
      },
    });

    if (!post) {
      throw new BadRequestException(`Post with id ${id} not found`);
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const { themes: themesData, ...rest } = updatePostDto;
    const post = await this.findOne(id);

    const updatedPost = await this.drizzle.db.transaction(async (tx) => {
      const [res] = await tx.update(posts).set(rest).where(eq(posts.id, post.id)).returning();

      if (themesData !== undefined) {
        await tx.delete(themes).where(eq(themes.postId, post.id));
        if (themesData.length > 0) {
          await tx.insert(themes).values(
            themesData.map((t) => ({
              postId: post.id,
              work: t.work,
              category: t.category,
            })),
          );
        }
      }

      return res;
    });

    return updatedPost;
  }

  async remove(id: string) {
    const post = await this.findOne(id);

    await this.drizzle.db.delete(posts).where(eq(posts.id, post.id));

    return { success: true };
  }
}
