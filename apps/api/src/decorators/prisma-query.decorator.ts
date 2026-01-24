import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface PrismaQueryParams {
  where?: Record<string, any>;
  skip?: number;
  take?: number;
  orderBy?: Record<string, "asc" | "desc">;
  include?: Record<string, boolean>;
}

export const PrismaQuery = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const { page, limit, sort, fields, filter, ...rest } = request.query;

  const take = limit ? parseInt(limit, 10) : 10;
  const skip = page && take ? (parseInt(page, 10) - 1) * take : 0;

  // createdAt:desc
  const orderBy = sort ? { [sort.split(":")[0]]: sort.split(":")[1] } : { createdAt: "desc" };

  const include = fields && JSON.parse(fields);

  const where = {
    ...JSON.parse(filter || "{}"),
    ...rest,
  };

  return {
    where,
    skip,
    take,
    orderBy,
    include,
  };
});
