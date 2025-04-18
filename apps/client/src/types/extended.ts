import type { Category, Post, Squad, User } from "@/types";

export interface CategoryWithPosts extends Category {
  posts: Post[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageCount: number;
    total: number;
  };
}

export interface SquadWithUsers extends Squad {
  users: User[];
}
