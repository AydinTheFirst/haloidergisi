import { IsOptional, IsString, IsUUID } from "class-validator";

import { BaseQueryDto } from "@/common/dto/query.dto";

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsUUID()
  postId: string;

  @IsOptional()
  @IsUUID()
  replyToId?: string;
}

export class QueryCommentDto extends BaseQueryDto {}

export class UpdateCommentDto {
  @IsString()
  content: string;
}
