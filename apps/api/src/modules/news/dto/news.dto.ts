import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content: string;

  @IsString()
  @IsOptional()
  keywords?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class UpdateNewsDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  content?: string;

  @IsString()
  @IsOptional()
  keywords?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
