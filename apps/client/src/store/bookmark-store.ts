import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookmarkStore {
  addBookmark: (postId: string) => void;
  bookmarks: string[];
  isBookmarked: (postId: string) => boolean;
  removeBookmark: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      addBookmark: (postId) => {
        if (!get().isBookmarked(postId)) {
          set((state) => ({
            bookmarks: [...state.bookmarks, postId],
          }));
        }
      },
      bookmarks: [],
      isBookmarked: (postId) => get().bookmarks.includes(postId),
      removeBookmark: (postId) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((id) => id !== postId),
        }));
      },
      toggleBookmark: (postId) => {
        if (get().isBookmarked(postId)) {
          get().removeBookmark(postId);
        } else {
          get().addBookmark(postId);
        }
      },
    }),
    {
      name: "bookmarks",
    },
  ),
);
