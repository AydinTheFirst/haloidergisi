import { ReactionType } from "@prisma/client";
import { IsEnum, IsOptional, IsUUID } from "class-validator";

import { BaseQueryDto } from "@/common/dto/query.dto";

export class CreateReactionDto {
  @IsUUID()
  postId: string;

  @IsEnum(ReactionType)
  type: ReactionType;

  @IsUUID()
  userId: string;
}

export class QueryReactionDto extends BaseQueryDto {
  @IsOptional()
  @IsUUID()
  postId?: string;

  @IsEnum(ReactionType)
  @IsOptional()
  type?: ReactionType;

  @IsOptional()
  @IsUUID()
  userId?: string;
}

export class ReactionDto {
  @IsUUID()
  postId: string;

  @IsEnum(ReactionType)
  type: ReactionType;
}

export class UpdateReactionDto {
  @IsEnum(ReactionType)
  type: ReactionType;
}
