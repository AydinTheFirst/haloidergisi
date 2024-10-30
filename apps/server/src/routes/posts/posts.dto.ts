import { PostStatus } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";

export class CreatePostDto {
  @IsString()
  categoryId: string;

  @IsString()
  description: string;

  @IsEnum(PostStatus)
  status: PostStatus;

  @IsString()
  title: string;
}

export class UpdatePostDto extends CreatePostDto {}
