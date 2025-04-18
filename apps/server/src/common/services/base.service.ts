import { PrismaService } from "@/prisma";

export class BaseService<T> {
  constructor(private prismaModel: any) {}

  async findAll(
    query: any,
    searchableFields: (keyof T)[] = [],
    customWhere: any = {},
  ) {
    const baseQuery = PrismaService.buildPrismaQuery<T>(
      query,
      searchableFields,
    );

    // extra filtreleri where'e ekle
    baseQuery.where = {
      ...(baseQuery.where || {}),
      ...(customWhere || {}),
    };

    const [data, total] = await Promise.all([
      this.prismaModel.findMany(baseQuery),
      this.prismaModel.count({ where: baseQuery.where }),
    ]);

    return {
      data,
      meta: {
        page: Math.floor((baseQuery.skip ?? 0) / (baseQuery.take ?? 10)) + 1,
        pageCount: Math.ceil(total / (baseQuery.take ?? 10)),
        total,
      },
    };
  }
}
