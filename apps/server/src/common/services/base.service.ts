import { PrismaService } from "@/prisma";

export class BaseService<T> {
  constructor(private prismaModel: any) {}

  async findAll(
    query: any,
    searchableFields: (keyof T)[] = [],
    customWhere: any = {}
  ) {
    const baseQuery = PrismaService.buildPrismaQuery<T>(
      query,
      searchableFields
    );

    baseQuery.where = {
      ...(baseQuery.where || {}),
      ...(customWhere || {}),
    };

    return this.prismaModel.findMany(baseQuery);
  }
}
