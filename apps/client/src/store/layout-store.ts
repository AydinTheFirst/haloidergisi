import { create } from "zustand";

interface LayoutStore {
  navbarHeight: number;
  setNavbarHeight: (height: number) => void;
}

export const useLayoutStore = create<LayoutStore>((set) => ({
  navbarHeight: 0,
  setNavbarHeight: (height) => set({ navbarHeight: height }),
}));
