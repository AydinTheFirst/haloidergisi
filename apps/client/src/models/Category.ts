import type { Post } from "./Post";

import { BaseModel } from "./BaseModel";

export class Category extends BaseModel {
  description!: string;

  posts?: Post[];

  title!: string;
}
