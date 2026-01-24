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
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
