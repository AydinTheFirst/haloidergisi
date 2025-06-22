import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString } from "class-validator";

export class BaseQueryDto {
  @IsOptional()
  @IsString()
  fields?: string;

  @IsOptional()
  @IsString()
  ids?: string;

  @IsOptional()
  @IsString()
  include?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;

  @IsIn(["asc", "desc"])
  @IsOptional()
  order?: "asc" | "desc" = "desc";

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: string = "createdAt";
}
