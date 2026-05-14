import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  lt,
  lte,
  ne,
  notInArray,
  or,
} from "drizzle-orm";

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
            if (typeof val === "object" && val !== null && "contains" in val) {
              orFilters.push(ilike(table[k], `%${val.contains}%`));
            } else if (typeof val === "object" && val !== null && "not" in val) {
              orFilters.push(ne(table[k], val.not));
            } else {
              orFilters.push(eq(table[k], val));
            }
          }
        });
        if (orFilters.length > 0) filters.push(or(...orFilters));
      } else if (table[key]) {
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          if ("not" in value) {
            filters.push(ne(table[key], value.not));
          } else if ("contains" in value) {
            filters.push(ilike(table[key], `%${value.contains}%`));
          } else if ("gt" in value) {
            filters.push(gt(table[key], value.gt));
          } else if ("gte" in value) {
            filters.push(gte(table[key], value.gte));
          } else if ("lt" in value) {
            filters.push(lt(table[key], value.lt));
          } else if ("lte" in value) {
            filters.push(lte(table[key], value.lte));
          } else if ("in" in value && Array.isArray(value.in)) {
            filters.push(inArray(table[key], value.in));
          } else if ("notIn" in value && Array.isArray(value.notIn)) {
            filters.push(notInArray(table[key], value.notIn));
          } else {
            filters.push(eq(table[key], value));
          }
        } else {
          filters.push(eq(table[key], value));
        }
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
