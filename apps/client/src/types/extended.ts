import type { Category, Post, Squad, User } from "@/types";

export interface CategoryWithPosts extends Category {
  posts: Post[];
}

export interface SquadWithUsers extends Squad {
  users: User[];
}
