import { PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateNewsDto {
  @IsString()
  description: string;

  @IsString()
  title: string;
}

export class UpdateNewsDto extends PartialType(CreateNewsDto) {}
