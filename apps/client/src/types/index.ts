import type { Reaction } from "~/models/Reaction";

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    pageCount: number;
    total: number;
  };
}

export interface ReactionResponse {
  items: Reaction[];
  meta: {
    dislikes: number;
    likes: number;
    total: number;
  };
}
