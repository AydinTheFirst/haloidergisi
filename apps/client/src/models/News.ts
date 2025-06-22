import { BaseModel } from "./BaseModel";

export class News extends BaseModel {
  description!: string;

  featuredImage!: string;

  files!: string[];

  slug!: string;

  tags!: string[];

  title!: string;
}
