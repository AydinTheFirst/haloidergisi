import { Post, PostStatus } from "@repo/db";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePostDto implements Partial<Post> {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(PostStatus)
  status: PostStatus;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  attachment?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number | null | undefined;
}
