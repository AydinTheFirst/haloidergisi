import { Injectable, NotFoundException } from "@nestjs/common";
import { posts, themes } from "@repo/db";
import { desc, eq } from "drizzle-orm";

import { DrizzleService } from "@/database";

import { CreateThemeDto } from "./dto/create-theme.dto";
import { UpdateThemeDto } from "./dto/update-theme.dto";

@Injectable()
export class ThemesService {
  constructor(private drizzle: DrizzleService) {}

  async create(data: CreateThemeDto | CreateThemeDto[]) {
    const items = Array.isArray(data) ? data : [data];

    const result = await this.drizzle.db.insert(themes).values(
      items.map((item) => ({
        work: item.work,
        category: item.category,
        postId: item.postId,
      })),
    );

    return {
      success: true,
      count: items.length,
      result,
    };
  }

  async findAll() {
    return this.drizzle.db.query.themes.findMany({
      with: {
        post: true,
      },
    });
  }

  async findGrouped() {
    const results = await this.drizzle.db.query.posts.findMany({
      where: eq(posts.status, "PUBLISHED"),
      with: {
        themes: true,
        category: true,
      },
      orderBy: [desc(posts.createdAt)],
    });

    // Filter out posts that have no themes
    const filteredResults = results.filter((post) => post.themes.length > 0);

    return filteredResults.map((post) => {
      // Group themes by category (Konu/Tür) within each post (Dergi)
      const genresGrouped: Record<string, { category: string; works: string[] }> = {};

      post.themes.forEach((theme) => {
        if (!genresGrouped[theme.category]) {
          genresGrouped[theme.category] = {
            category: theme.category,
            works: [],
          };
        }
        // Avoid duplicate works in the same genre for the same magazine issue
        if (!genresGrouped[theme.category].works.includes(theme.work)) {
          genresGrouped[theme.category].works.push(theme.work);
        }
      });

      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        coverImage: post.coverImage,
        postCategory: post.category,
        genres: Object.values(genresGrouped),
      };
    });
  }

  async findOne(id: string) {
    const result = await this.drizzle.db.query.themes.findFirst({
      where: eq(themes.id, id),
      with: {
        post: {
          with: {
            category: true,
          },
        },
      },
    });

    if (!result) throw new NotFoundException("Theme not found");

    return result;
  }

  async update(id: string, updateThemeDto: UpdateThemeDto) {
    await this.findOne(id);

    const result = await this.drizzle.db
      .update(themes)
      .set({
        work: updateThemeDto.work,
        category: updateThemeDto.category,
        postId: updateThemeDto.postId,
      })
      .where(eq(themes.id, id));
    return result;
  }

  async remove(id: string) {
    await this.drizzle.db.delete(themes).where(eq(themes.id, id));
    return { success: true };
  }
}
