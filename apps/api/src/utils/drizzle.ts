import { and, asc, desc, eq, ilike, or } from "drizzle-orm";

export function applyQuery(table: any, query: any) {
  const filters: any[] = [];
  if (query.where) {
    Object.entries(query.where).forEach(([key, value]) => {
      if (key === "OR" && Array.isArray(value)) {
        const orFilters: any[] = [];
        value.forEach((v) => {
          const k = Object.keys(v)[0];
          const val = v[k];
          if (table[k]) {
            if (typeof val === "object" && val && "contains" in val) {
              orFilters.push(ilike(table[k], `%${val.contains}%`));
            } else {
              orFilters.push(eq(table[k], val));
            }
          }
        });
        if (orFilters.length > 0) filters.push(or(...orFilters));
      } else if (table[key]) {
        filters.push(eq(table[key], value));
      }
    });
  }

  const orderBy: any[] = [];
  if (query.orderBy) {
    Object.entries(query.orderBy).forEach(([key, value]) => {
      if (table[key]) {
        orderBy.push(value === "asc" ? asc(table[key]) : desc(table[key]));
      }
    });
  }

  return {
    filters,
    where: filters.length > 0 ? and(...filters) : undefined,
    orderBy: orderBy.length > 0 ? orderBy : undefined,
    limit: query.take,
    offset: query.skip,
    with: query.include,
  };
}
