import { PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateProfileDto {
  @IsString()
  bio: string;

  @IsString()
  displayName: string;

  @IsString()
  title: string;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
