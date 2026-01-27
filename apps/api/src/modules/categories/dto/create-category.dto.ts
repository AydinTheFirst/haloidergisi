import { Category } from "@repo/db";
import { IsString } from "class-validator";

export class CreateCategoryDto implements Partial<Category> {
  @IsString()
  name: string;
}
