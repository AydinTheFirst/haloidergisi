import { IsNumber, IsString } from "class-validator";

export class CreateSquadDto {
  @IsString()
  description: string;

  @IsString()
  name: string;

  @IsNumber()
  order: number;
}

export class UpdateSquadDto extends CreateSquadDto {}
