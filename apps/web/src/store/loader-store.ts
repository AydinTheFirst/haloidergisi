// store/loaderStore.js
import { create } from "zustand";

interface LoaderState {
  requestCount: number;
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

const useLoaderStore = create<LoaderState>((set) => ({
  requestCount: 0,
  isLoading: false,

  showLoader: () =>
    set((state) => {
      const newCount = state.requestCount + 1;
      return {
        requestCount: newCount,
        isLoading: true,
      };
    }),

  hideLoader: () =>
    set((state) => {
      const newCount = state.requestCount > 0 ? state.requestCount - 1 : 0;
      return {
        requestCount: newCount,
        isLoading: newCount > 0, // Eğer hala bekleyen istek varsa true kalır
      };
    }),
}));

export default useLoaderStore;
