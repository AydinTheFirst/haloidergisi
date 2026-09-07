import { categories, crews, db, profiles, users } from "@repo/db";
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

// Maps a relation key (as used in dotted `searchableFields`, e.g. "category.name")
// to the foreign table and the columns that join it to the table being queried.
const RELATION_MAP: Record<string, { table: any; localKey: string; foreignKey: string }> = {
  category: { table: categories, localKey: "categoryId", foreignKey: "id" },
  profile: { table: profiles, localKey: "id", foreignKey: "userId" },
  crew: { table: crews, localKey: "crewId", foreignKey: "id" },
  user: { table: users, localKey: "userId", foreignKey: "id" },
};

function buildCondition(table: any, key: string, val: any): any {
  const relation = RELATION_MAP[key];

  if (
    relation &&
    typeof val === "object" &&
    val !== null &&
    !("contains" in val) &&
    !("not" in val)
  ) {
    const [relationField] = Object.keys(val);
    const relationVal = val[relationField];

    if (!table[relation.localKey] || !relation.table[relationField]) return undefined;

    const subquery = db
      .select({ id: relation.table[relation.foreignKey] })
      .from(relation.table)
      .where(
        typeof relationVal === "object" && relationVal !== null && "contains" in relationVal
          ? ilike(relation.table[relationField], `%${relationVal.contains}%`)
          : eq(relation.table[relationField], relationVal),
      );

    return inArray(table[relation.localKey], subquery);
  }

  if (!table[key]) return undefined;

  if (typeof val === "object" && val !== null && !Array.isArray(val)) {
    if ("not" in val) return ne(table[key], val.not);
    if ("contains" in val) return ilike(table[key], `%${val.contains}%`);
    if ("gt" in val) return gt(table[key], val.gt);
    if ("gte" in val) return gte(table[key], val.gte);
    if ("lt" in val) return lt(table[key], val.lt);
    if ("lte" in val) return lte(table[key], val.lte);
    if ("in" in val && Array.isArray(val.in)) return inArray(table[key], val.in);
    if ("notIn" in val && Array.isArray(val.notIn)) return notInArray(table[key], val.notIn);
    return eq(table[key], val);
  }

  return eq(table[key], val);
}

function buildOrGroup(table: any, entries: any[]): any {
  const orFilters: any[] = [];
  entries.forEach((entry) => {
    const key = Object.keys(entry)[0];
    const condition = buildCondition(table, key, entry[key]);
    if (condition) orFilters.push(condition);
  });
  return orFilters.length > 0 ? or(...orFilters) : undefined;
}

export function applyQuery(table: any, query: any) {
  const filters: any[] = [];

  if (query.where) {
    Object.entries(query.where).forEach(([key, value]) => {
      if (key === "OR" && Array.isArray(value)) {
        const orCondition = buildOrGroup(table, value);
        if (orCondition) filters.push(orCondition);
      } else if (key === "AND" && Array.isArray(value)) {
        value.forEach((entry: any) => {
          Object.entries(entry).forEach(([entryKey, entryValue]) => {
            if (entryKey === "OR" && Array.isArray(entryValue)) {
              const orCondition = buildOrGroup(table, entryValue);
              if (orCondition) filters.push(orCondition);
            } else {
              const condition = buildCondition(table, entryKey, entryValue);
              if (condition) filters.push(condition);
            }
          });
        });
      } else {
        const condition = buildCondition(table, key, value);
        if (condition) filters.push(condition);
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
