import React from "react";

export interface FavoriteContextType {
  addFavorite: (postId: string) => void;
  favorites: string[];
  isFavorite: (postId: string) => boolean;
  removeFavorite: (postId: string) => void;
}

export const FavoriteContext = React.createContext<FavoriteContextType>({
  addFavorite: () => {
    throw new Error("Not Implemented");
  },
  favorites: [],
  isFavorite: () => {
    throw new Error("Not Implemented");
  },
  removeFavorite: () => {
    throw new Error("Not Implemented");
  }
});

export const useFavorites = () => React.useContext(FavoriteContext);

export const FavoritesProvider = ({ children }: React.PropsWithChildren) => {
  const [favorites, setFavorites] = React.useState<string[]>(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  const addFavorite = (postId: string) => {
    if (!favorites.includes(postId)) {
      const newFavorites = [...favorites, postId];
      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    }
  };

  const removeFavorite = (postId: string) => {
    const newFavorites = favorites.filter((id) => id !== postId);
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const isFavorite = (postId: string) => favorites.includes(postId);

  return (
    <FavoriteContext.Provider
      value={{ addFavorite, favorites, isFavorite, removeFavorite }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
