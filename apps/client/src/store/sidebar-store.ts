import { create } from "zustand";

interface SidebarStore {
  close: () => void;
  isOpen: boolean;
  open: () => void;
  toggle: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  close: () => set({ isOpen: false }),
  isOpen: true,
  open: () => set({ isOpen: true }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen }))
}));
