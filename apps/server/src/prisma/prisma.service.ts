import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  static buildPrismaQuery<T>(
    query: {
      fields?: string;
      limit?: number;
      offset?: number;
      order?: "asc" | "desc";
      search?: string;
      sort?: string;
    },
    searchableFields: (keyof T)[] = [],
  ) {
    const { fields, limit, offset, order, search, sort } = query;

    const prismaQuery: any = {
      orderBy: { [sort || "createdAt"]: order || "desc" },
      skip: Number(offset),
      take: Number(limit),
    };

    if (search && searchableFields.length > 0) {
      prismaQuery.where = {
        OR: searchableFields.map((field) => ({
          [field]: { contains: search, mode: "insensitive" },
        })),
      };
    }

    if (fields) {
      prismaQuery.select = fields
        .split(",")
        .reduce((acc, key) => ({ ...acc, [key.trim()]: true }), {});
    }

    return prismaQuery;
  }

  async onModuleInit() {
    await this.$connect();
    Logger.log("Connected to the database", "PrismaService");
  }
}
