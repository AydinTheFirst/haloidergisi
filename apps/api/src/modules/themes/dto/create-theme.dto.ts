import { IsString } from "class-validator";

export class CreateThemeDto {
  @IsString()
  work: string;

  @IsString()
  category: string;

  @IsString()
  postId: string;
}
