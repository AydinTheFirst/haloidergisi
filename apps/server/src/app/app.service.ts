import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/prisma";
import { Stats } from "@/types";

@Injectable()
export class AppService {
  cachedStats?: Stats;
  constructor(private prisma: PrismaService) {}

  index() {
    return {
      code: 200,
      message: "Hello World!",
    };
  }

  async stats() {
    if (this.cachedStats) {
      return this.cachedStats;
    }

    const posts = await this.prisma.post.count();
    const users = await this.prisma.user.count();
    const authors = await this.prisma.user.count({
      where: {
        title: "Yazar",
      },
    });

    this.cachedStats = {
      authors,
      posts,
      users,
    };

    // Cache the stats for 1 hour
    setTimeout(
      () => {
        this.cachedStats = undefined;
      },
      60 * 60 * 1000,
    );

    return this.cachedStats;
  }
}
