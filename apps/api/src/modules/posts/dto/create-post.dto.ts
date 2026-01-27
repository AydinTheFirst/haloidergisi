import { Post, PostStatus } from "@repo/db";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

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
  @IsUUID()
  categoryId?: string | null | undefined;
}
