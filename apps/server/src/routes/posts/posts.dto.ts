import { PostStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
  @IsString()
  categoryId: string;

  @IsString()
  @IsOptional()
  cover: string;

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

export class UpdatePostDto extends CreatePostDto {}
