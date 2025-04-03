import { PartialType } from "@nestjs/swagger";
import { PostStatus } from "@prisma/client";
import { IsEnum, IsISO8601, IsOptional, IsString } from "class-validator";

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
