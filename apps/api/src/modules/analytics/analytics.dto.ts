import { IsString } from "class-validator";

export class TrackVisitDto {
  @IsString()
  url: string;
}
