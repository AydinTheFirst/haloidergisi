import { PartialType } from "@nestjs/mapped-types";
import { Profile } from "@repo/db";
import { IsOptional, IsString } from "class-validator";

export class CreateProfileDto implements Partial<Profile> {
  @IsOptional()
  @IsString()
  bio?: string | null | undefined;

  @IsOptional()
  @IsString()
  name?: string | undefined;

  @IsOptional()
  @IsString()
  avatarUrl?: string | null | undefined;

  @IsOptional()
  @IsString()
  title?: string | null | undefined;

  @IsOptional()
  @IsString()
  website?: string | null | undefined;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
