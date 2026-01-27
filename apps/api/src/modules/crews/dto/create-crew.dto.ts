import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCrewDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  sort?: number;
}
