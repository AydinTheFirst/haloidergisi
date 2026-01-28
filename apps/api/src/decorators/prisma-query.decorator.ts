import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export interface PrismaQueryParams {
  where?: Record<string, any>;
  skip?: number;
  take?: number;
  orderBy?: Record<string, "asc" | "desc">;
  include?: Record<string, boolean>;
}

export const PrismaQuery = createParamDecorator(
  (searchableFields: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;

    const { page, limit, sort, fields, filter, search, ...rest } = request.query as Record<
      string,
      string
    >;

    const limitVal = parseInt(limit || "10", 10);
    const take = limitVal === -1 ? undefined : limitVal;
    const skip = page && take ? (parseInt(page, 10) - 1) * take : 0;

    // createdAt:desc
    const orderBy = sort ? { [sort.split(":")[0]]: sort.split(":")[1] } : { createdAt: "desc" };

    const include = fields && JSON.parse(fields);

    let where = {
      ...JSON.parse(filter || "{}"),
      ...rest,
    };

    if (search && searchableFields && searchableFields.length > 0) {
      where.OR = searchableFields.map((field) => {
        if (field.includes(".")) {
          const [relation, relationField] = field.split(".");
          return {
            [relation]: {
              [relationField]: { contains: search, mode: "insensitive" },
            },
          };
        }

        return {
          [field]: { contains: search, mode: "insensitive" },
        };
      });
    }

    return {
      where,
      skip,
      take,
      orderBy,
      include,
    };
  },
);
