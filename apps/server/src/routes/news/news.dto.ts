import { PartialType } from "@nestjs/swagger";
import { IsArray, IsISO8601, IsOptional, IsString } from "class-validator";

export class CreateNewsDto {
  @IsISO8601()
  @IsOptional()
  createdAt: Date;

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
