import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const favoritesKey = 'meridian-favorites';
const notesKey = 'meridian-favorite-notes';

type FavoritesContextValue = {
  favorites: string[];
  notes: Record<string, string>;
  isFavorite: (artworkId: string) => boolean;
  toggleFavorite: (artworkId: string) => void;
  setNote: (artworkId: string, note: string) => void;
  getNote: (artworkId: string) => string;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function readFavorites(): string[] {
  try {
    const stored = window.localStorage.getItem(favoritesKey);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function readNotes(): Record<string, string> {
  try {
    const stored = window.localStorage.getItem(notesKey);
    if (!stored) return {};
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return {};
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === 'string') result[key] = value;
    }
    return result;
  } catch {
    return {};
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(readFavorites);
  const [notes, setNotes] = useState<Record<string, string>>(readNotes);

  useEffect(() => {
    try {
      window.localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    } catch {
      // Ignore storage access errors
    }
  }, [favorites]);

  useEffect(() => {
    try {
      window.localStorage.setItem(notesKey, JSON.stringify(notes));
    } catch {
      // Ignore storage access errors
    }
  }, [notes]);

  // Stable identity: safe to depend on inside useEffect.
  const toggleFavorite = useCallback((artworkId: string) => {
    setFavorites((current) =>
      current.includes(artworkId)
        ? current.filter((id) => id !== artworkId)
        : [...current, artworkId],
    );
  }, []);

  const setNote = useCallback((artworkId: string, note: string) => {
    setNotes((current) => {
      const trimmed = note.trim();
      if (!trimmed) {
        const { [artworkId]: _removed, ...rest } = current;
        return rest;
      }
      return { ...current, [artworkId]: trimmed };
    });
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      notes,
      isFavorite: (artworkId) => favorites.includes(artworkId),
      toggleFavorite,
      setNote,
      getNote: (artworkId) => notes[artworkId] ?? '',
    }),
    [favorites, notes, toggleFavorite, setNote],
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