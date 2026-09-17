import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { useCommandPalette } from '../context/CommandPaletteContext';

const primaryLinks = [
  { to: '/exhibitions', label: 'Exhibitions' },
  { to: '/collections', label: 'Collections' },
  { to: '/artists', label: 'Artists' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/about', label: 'About' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  const { openPalette } = useCommandPalette();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('menu-is-open', menuOpen);
    return () => document.body.classList.remove('menu-is-open');
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  // Keep the search field in sync with the URL when on the search page.
  useEffect(() => {
    if (pathname !== '/search') return;
    const params = new URLSearchParams(location.search);
    setQuery(params.get('q') ?? '');
  }, [pathname, location.search]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/search?q=${encodeURIComponent(value)}` : '/search');
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="The Meridian Archive home">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>
            <strong>Meridian</strong>
            <small>Archive</small>
          </span>
        </Link>

        <nav
          id="primary-navigation"
          className={`primary-nav${menuOpen ? ' is-open' : ''}`}
          aria-label="Primary navigation"
        >
          <div className="mobile-nav-top">
            <span>Explore the archive</span>
            <button
              className="icon-button menu-close"
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation"
            >
              ×
            </button>
          </div>

          <form className="mobile-search" role="search" onSubmit={submitSearch}>
            <label className="sr-only" htmlFor="mobile-site-search">Search the museum</label>
            <input
              id="mobile-site-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the archive"
              type="search"
            />
            <button type="submit" aria-label="Submit search">→</button>
          </form>

          {primaryLinks.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
          <Link className="mobile-favorites-link" to="/favorites">
            My collection <span>{favorites.length}</span>
          </Link>
        </nav>

        <div className="header-actions">
          <button
            className="command-trigger"
            type="button"
            onClick={openPalette}
            aria-label="Open quick find"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <span>Quick find</span>
            <kbd>⌘K</kbd>
          </button>

          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
              </svg>
            )}
          </button>

          <form className="header-search" role="search" onSubmit={submitSearch}>
            <label className="sr-only" htmlFor="site-search">Search the museum</label>
            <input
              id="site-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the archive"
              type="search"
            />
            <button type="submit" aria-label="Submit search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>
            </button>
          </form>

          <Link className="favorites-link" to="/favorites" aria-label={`My collection, ${favorites.length} items`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s-7.5-4.7-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1 4.5 2.7C12 6 13.5 5 15.5 5 19 5 21 8.5 20.5 12c-1 4.3-8.5 9-8.5 9Z" />
            </svg>
            <span>{favorites.length}</span>
          </Link>

          <button
            className="icon-button menu-toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          >
            {menuOpen ? '×' : <span><i /><i /><i /></span>}
          </button>
        </div>
      </div>
    </header>
  );
}