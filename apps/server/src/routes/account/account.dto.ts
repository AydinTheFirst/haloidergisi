import { IsEmail, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateAccountDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;
}

export class UpdatePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  avatarUrl: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsString()
  displayName: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsUrl()
  website: string;
}
