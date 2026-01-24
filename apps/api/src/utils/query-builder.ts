import { Type } from "class-transformer";
import { IsOptional } from "class-validator";

export class BaseQueryDto {
  @IsOptional()
  fields: any[];

  @IsOptional()
  filters?: any;

  @IsOptional()
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  take?: number;
}

class QueryBuilder {
  build(queryDto: BaseQueryDto, allowedFields: string[]) {
    const query: any = {};

    if (queryDto.fields && queryDto.fields.length > 0) {
      // Sadece izin verilen alanları ayıklıyoruz
      query.select = this._parseFields(queryDto.fields, allowedFields);
    }

    if (queryDto.filters) {
      // Filtreleme için de bir "allowedFilters" mantığı iyi olurdu
      query.where = this._parseFilters(queryDto.filters);
    }

    if (queryDto.skip !== undefined) {
      query.skip = queryDto.skip;
    }

    if (queryDto.take !== undefined) {
      query.take = queryDto.take;
    }

    return query;
  }

  private _parseFields(fields: any[], allowed: string[]) {
    const select: any = {};

    for (const item of fields) {
      if (typeof item === "string") {
        // Beyaz liste kontrolü
        if (item !== "*" && allowed.includes(item)) {
          select[item] = true;
        }
      } else if (typeof item === "object") {
        for (const key in item) {
          // İlişkili tablo ismi de beyaz listede mi?
          if (Array.isArray(item[key]) && allowed.includes(key)) {
            const nested = this._parseFields(item[key], allowed);
            if (Object.keys(nested).length > 0) {
              select[key] = { select: nested };
            }
          }
        }
      }
    }

    return Object.keys(select).length > 0 ? select : undefined;
  }

  _parseFilters(filters: any) {
    const where: any = {};

    for (const key in filters) {
      const value = filters[key];

      if (typeof value === "object" && !Array.isArray(value)) {
        where[key] = this._parseFilters(value);
      } else {
        where[key] = value;
      }
    }

    return where;
  }
}

export const queryBuilder = new QueryBuilder();
