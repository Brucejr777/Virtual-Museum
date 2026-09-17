import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const storageKey = 'meridian-favorites';

type FavoritesContextValue = {
  favorites: string[];
  isFavorite: (artworkId: string) => boolean;
  toggleFavorite: (artworkId: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(favorites));
  }, [favorites]);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      isFavorite: (artworkId) => favorites.includes(artworkId),
      toggleFavorite: (artworkId) =>
        setFavorites((current) =>
          current.includes(artworkId)
            ? current.filter((id) => id !== artworkId)
            : [...current, artworkId],
        ),
    }),
    [favorites],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
