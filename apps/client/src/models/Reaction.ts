import type { ReactionType } from "./enums";
import type { Post } from "./Post";
import type { User } from "./User";

import { BaseModel } from "./BaseModel";

export class Reaction extends BaseModel {
  post!: Post;

  postId!: string;

  type!: ReactionType;

  user!: User;

  userId!: string;
}
