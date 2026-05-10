import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NavbarState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
}

export const useNavbarStore = create<NavbarState>()(
  persist(
    (set) => ({
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "navbar-storage",
    },
  ),
);
