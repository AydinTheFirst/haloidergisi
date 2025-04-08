import { PartialType } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateUserDto {
  @IsOptional()
  @IsString()
  bio: string;

  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  squadId: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  website: string;
}

export class UpdateUserDto extends CreateUserDto {
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];
}

export class UpdateUserSelf {
  @IsString()
  avatar: string;

  @IsString()
  bio: string;

  @IsString()
  displayName: string;

  @IsString()
  title: string;

  @IsString()
  username: string;

  @IsString()
  website: string;
}

export class UpdateUserSelfDto extends PartialType(UpdateUserSelf) {}
