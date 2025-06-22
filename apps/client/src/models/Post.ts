import type { Category } from "./Category";
import type { Comment } from "./Comment";
import type { PostStatus } from "./enums";
import type { Reaction } from "./Reaction";

import { BaseModel } from "./BaseModel";

export class Post extends BaseModel {
  category?: Category;

  categoryId!: string;

  comments?: Comment[];

  cover?: string;

  description!: string;

  file?: string;

  isFeatured?: boolean;

  reactions?: Reaction[];

  slug!: string;

  status!: PostStatus;

  tags!: string[];

  title!: string;
}
