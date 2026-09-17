import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { artists, artworks, collections, exhibitions, timeline } from '../data/museumData';
import { tours } from '../data/tours';

type Command = {
  id: string;
  label: string;
  hint: string;
  group: string;
  to: string;
};

const MAX_RESULTS = 12;

function buildCommandIndex(): Command[] {
  const commands: Command[] = [];

  artworks.forEach((work) =>
    commands.push({
      id: `work-${work.id}`,
      label: work.title,
      hint: `${work.category} · ${work.date}`,
      group: 'Works',
      to: `/works/${work.id}`,
    }),
  );

  artists.forEach((artist) =>
    commands.push({
      id: `artist-${artist.id}`,
      label: artist.name,
      hint: `${artist.movement} · ${artist.nationality}`,
      group: 'Artists',
      to: `/artists/${artist.id}`,
    }),
  );

  exhibitions.forEach((exhibition) =>
    commands.push({
      id: `exhibition-${exhibition.id}`,
      label: exhibition.title,
      hint: `Exhibition · ${exhibition.period}`,
      group: 'Exhibitions',
      to: `/exhibitions/${exhibition.slug}`,
    }),
  );

  collections.forEach((collection) =>
    commands.push({
      id: `collection-${collection.id}`,
      label: collection.name,
      hint: `Collection · ${collection.workIds.length} works`,
      group: 'Collections',
      to: `/collections#${collection.slug}`,
    }),
  );

  tours.forEach((tour) =>
    commands.push({
      id: `tour-${tour.id}`,
      label: tour.title,
      hint: `Tour · ${tour.steps.length} stops`,
      group: 'Tours',
      to: `/tours/${tour.slug}`,
    }),
  );

  timeline.forEach((event) =>
    commands.push({
      id: `event-${event.id}`,
      label: event.title,
      hint: `${event.year} · ${event.period}`,
      group: 'Timeline',
      to: event.artworkId ? `/works/${event.artworkId}` : '/timeline',
    }),
  );

  const navItems: { id: string; label: string; hint: string; to: string }[] = [
    { id: 'nav-home', label: 'Home', hint: 'Entrance', to: '/' },
    { id: 'nav-exhibitions', label: 'Exhibitions', hint: 'Program', to: '/exhibitions' },
    { id: 'nav-collections', label: 'Collections', hint: 'Browse', to: '/collections' },
    { id: 'nav-tours', label: 'Guided tours', hint: 'Take a walk', to: '/tours' },
    { id: 'nav-artists', label: 'Artists', hint: 'Directory', to: '/artists' },
    { id: 'nav-timeline', label: 'Timeline', hint: 'History', to: '/timeline' },
    { id: 'nav-search', label: 'Search', hint: 'Find anything', to: '/search' },
    { id: 'nav-compare', label: 'Compare works', hint: 'Side by side', to: '/compare' },
    { id: 'nav-favorites', label: 'My Collection', hint: 'Saved works', to: '/favorites' },
    { id: 'nav-about', label: 'About', hint: 'Our story', to: '/about' },
  ];

  navItems.forEach((item) => commands.push({ ...item, group: 'Navigate' }));

  return commands;
}

export function CommandPalette() {
  const { isOpen, closePalette } = useCommandPalette();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();
  const index = useMemo(buildCommandIndex, []);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const pool = normalized
      ? index.filter((command) =>
          `${command.label} ${command.hint} ${command.group}`.toLowerCase().includes(normalized),
        )
      : index;
    return pool.slice(0, MAX_RESULTS);
  }, [index, query]);

  // Focus management + scroll lock while open.
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setActiveIndex(0);
      return;
    }
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const runCommand = (command: Command) => {
    navigate(command.to);
    closePalette();
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => (results.length ? (current + 1) % results.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) =>
        results.length ? (current - 1 + results.length) % results.length : 0,
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = results[activeIndex];
      if (target) runCommand(target);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closePalette();
    }
  };

  return (
    <div className="command-overlay" onClick={closePalette} role="presentation">
      <div
        className="command-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="command-input-row">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search works, artists, tours, or pages…"
            aria-label="Search commands"
            autoComplete="off"
          />
          <kbd>Esc</kbd>
        </div>

        {results.length > 0 ? (
          <ul className="command-list" role="listbox">
            {results.map((command, i) => (
              <li key={command.id}>
                <button
                  type="button"
                  className={i === activeIndex ? 'is-active' : ''}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => runCommand(command)}
                  role="option"
                  aria-selected={i === activeIndex}
                >
                  <span className="command-group">{command.group}</span>
                  <span className="command-label">{command.label}</span>
                  <span className="command-hint">{command.hint}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="command-empty">No matches. Try “light”, “Egypt”, or “night”.</p>
        )}

        <div className="command-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}