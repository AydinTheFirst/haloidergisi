import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ReactionType } from "~/models/enums";

interface ReactionState {
  reactions: Record<string, ReactionType>;
  removeReaction: (postId: string) => void;
  setReaction: (postId: string, type: ReactionType) => void;
}

export const useReactionStore = create<ReactionState>()(
  persist(
    (set) => ({
      reactions: {},
      removeReaction: (postId) =>
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [postId]: _, ...rest } = state.reactions;
          return { reactions: rest };
        }),
      setReaction: (postId, type) =>
        set((state) => ({
          reactions: {
            ...state.reactions,
            [postId]: type,
          },
        })),
    }),
    {
      name: "reactions",
      partialize: (state) => ({ reactions: state.reactions }),
    },
  ),
);
