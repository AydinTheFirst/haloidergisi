import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  callId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  content: string;
}

export class UpdateArticleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  content: string;
}

export class UpdateArticleStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  adminNote?: string;
}
