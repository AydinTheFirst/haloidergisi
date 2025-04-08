import { PartialType } from "@nestjs/swagger";
import { PostStatus } from "@prisma/client";
import { IsEnum, IsISO8601, IsOptional, IsString } from "class-validator";

import { BaseQueryDto } from "@/common/dto/query.dto";

export class CreatePostDto {
  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  cover: string;

  @IsISO8601()
  @IsOptional()
  createdAt: Date;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  file: string;

  @IsEnum(PostStatus)
  status: PostStatus;

  @IsString()
  title: string;
}

export class PostQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsString()
  categoryId?: string;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}
