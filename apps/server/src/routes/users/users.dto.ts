import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @IsOptional()
  @IsString()
  bio: string;

  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsOptional()
  @IsString()
  squadId: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsOptional()
  @IsString()
  website: string;
}

export class UpdateUserDto extends CreateUserDto {}
