import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const storageKey = 'meridian-compare';
const maxItems = 3;

type CompareContextValue = {
  compareIds: string[];
  count: number;
  isFull: boolean;
  isComparing: (artworkId: string) => boolean;
  toggleCompare: (artworkId: string) => boolean;
  removeCompare: (artworkId: string) => void;
  clearCompare: () => void;
};

const CompareContext = createContext<CompareContextValue | null>(null);

function readStored(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string').slice(0, maxItems);
  } catch {
    return [];
  }
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>(readStored);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(compareIds));
    } catch {
      // Ignore storage access errors
    }
  }, [compareIds]);

  const toggleCompare = useCallback((artworkId: string) => {
    let added = false;
    setCompareIds((current) => {
      if (current.includes(artworkId)) {
        return current.filter((id) => id !== artworkId);
      }
      if (current.length >= maxItems) {
        return current;
      }
      added = true;
      return [...current, artworkId];
    });
    return added;
  }, []);

  const removeCompare = useCallback((artworkId: string) => {
    setCompareIds((current) => current.filter((id) => id !== artworkId));
  }, []);

  const clearCompare = useCallback(() => setCompareIds([]), []);

  const value = useMemo<CompareContextValue>(
    () => ({
      compareIds,
      count: compareIds.length,
      isFull: compareIds.length >= maxItems,
      isComparing: (artworkId) => compareIds.includes(artworkId),
      toggleCompare,
      removeCompare,
      clearCompare,
    }),
    [compareIds, toggleCompare, removeCompare, clearCompare],
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
}