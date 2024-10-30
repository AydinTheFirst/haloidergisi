import { IsString } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  description: string;

  @IsString()
  title: string;
}

export class UpdateCategoryDto extends CreateCategoryDto {}
