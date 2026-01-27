import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: false,
      setIsOpen: (isOpen: boolean) => set({ isOpen }),
    }),
    {
      name: "sidebar-storage",
    },
  ),
);
