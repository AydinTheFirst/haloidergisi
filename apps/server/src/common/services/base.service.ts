export class BaseService<T> {
  constructor(private prismaModel: any) {}

  buildPrismaQuery<T>(
    query: {
      fields?: string;
      include?: Record<string, any> | string; // yeni eklendi
      limit?: number;
      offset?: number;
      order?: "asc" | "desc";
      search?: string;
      sort?: string;
    },
    searchableFields: (keyof T)[] = [],
  ) {
    const { fields, include, limit, offset, order, search, sort } = query;

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

    if (include) {
      prismaQuery.include =
        typeof include === "string"
          ? include.split(",").reduce((acc, key) => ({ ...acc, [key.trim()]: true }), {})
          : include;
    }

    return prismaQuery;
  }

  async queryAll(query: any, searchableFields: (keyof T)[] = [], customWhere: any = {}) {
    const baseQuery = this.buildPrismaQuery<T>(query, searchableFields);

    // ids varsa customWhere içine ekle
    if (query.ids) {
      const idArray = query.ids.split(",").map((id) => id.trim());
      customWhere = {
        ...customWhere,
        id: { in: idArray },
      };
    }

    const hasSearch = !!baseQuery.where;
    const hasCustom = !!customWhere && Object.keys(customWhere).length > 0;

    if (hasSearch && hasCustom) {
      baseQuery.where = {
        AND: [baseQuery.where, customWhere],
      };
    } else if (hasCustom) {
      baseQuery.where = customWhere;
    }

    const [items, total] = await Promise.all([
      this.prismaModel.findMany(baseQuery),
      this.prismaModel.count({ where: baseQuery.where }),
    ]);

    return {
      items,
      meta: {
        page: Math.floor((baseQuery.skip ?? 0) / (baseQuery.take ?? 10)) + 1,
        pageCount: Math.ceil(total / (baseQuery.take ?? 10)),
        total,
      },
    };
  }
}
