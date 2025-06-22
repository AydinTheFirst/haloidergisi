import { IsString } from "class-validator";

import { BaseQueryDto } from "@/common/dto/query.dto";

export class CreateCategoryDto {
  @IsString()
  description: string;

  @IsString()
  title: string;
}

export class QueryCategoryDto extends BaseQueryDto {}

export class UpdateCategoryDto extends CreateCategoryDto {}
