import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const storageKey = 'meridian-recently-viewed';
const maxItems = 8;

type RecentlyViewedContextValue = {
  recentIds: string[];
  recordView: (artworkId: string) => void;
  clearHistory: () => void;
};

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(null);

function readStoredIds(): string[] {
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

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentIds, setRecentIds] = useState<string[]>(readStoredIds);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(recentIds));
    } catch {
      // Ignore storage access errors
    }
  }, [recentIds]);

  // Stable identity so consumers can safely depend on it inside useEffect.
  const recordView = useCallback((artworkId: string) => {
    setRecentIds((current) =>
      [artworkId, ...current.filter((id) => id !== artworkId)].slice(0, maxItems),
    );
  }, []);

  const clearHistory = useCallback(() => setRecentIds([]), []);

  const value = useMemo<RecentlyViewedContextValue>(
    () => ({ recentIds, recordView, clearHistory }),
    [recentIds, recordView, clearHistory],
  );

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  }
  return context;
}