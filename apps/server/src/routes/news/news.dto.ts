import { PartialType } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class CreateNewsDto {
  @IsString()
  description: string;

  @IsString()
  featuredImage: string;

  @IsArray()
  @IsString({ each: true })
  files: string[];

  @IsString()
  title: string;
}

export class UpdateNewsDto extends PartialType(CreateNewsDto) {}
