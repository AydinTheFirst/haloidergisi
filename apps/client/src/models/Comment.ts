import type { Post } from "./Post";
import type { User } from "./User";

import { BaseModel } from "./BaseModel";

export class Comment extends BaseModel {
  content!: string;

  post!: Post;

  postId!: string;

  replies?: Comment[];

  replyTo?: Comment;

  replyToId?: string;

  user!: User;

  userId!: string;
}
