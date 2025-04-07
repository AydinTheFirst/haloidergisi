import { PartialType } from "@nestjs/swagger";
import { PostStatus } from "@prisma/client";
import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreatePostDto {
  @IsString()
  categoryId: string;

  @IsString()
  @IsOptional()
  cover: string;

  @IsOptional()
  @IsISO8601()
  createdAt: Date;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  file: string;

  @IsEnum(PostStatus)
  status: PostStatus;

  @IsString()
  title: string;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}

export class FindPostsQueryDto {
  @IsOptional()
  @IsNumber()
  limit? = 10;

  @IsOptional()
  @IsNumber()
  offset? = 0;

  @IsOptional()
  @IsString()
  search? = "";

  @IsOptional()
  @IsString()
  sortBy? = "createdAt";

  @IsOptional()
  @IsString()
  sortOrder? = "desc";
}
