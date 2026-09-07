import { IsOptional, IsString } from "class-validator";

export class UpdateThemeConfigDto {
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @IsString()
  @IsOptional()
  primaryDarkColor?: string;

  @IsString()
  @IsOptional()
  accentColor?: string;

  @IsString()
  @IsOptional()
  radius?: string;

  @IsString()
  @IsOptional()
  fontFamily?: string;

  @IsString()
  @IsOptional()
  preset?: string;
}
