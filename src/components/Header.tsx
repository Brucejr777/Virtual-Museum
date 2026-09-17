import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

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
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.classList.toggle('menu-is-open', menuOpen);
    return () => document.body.classList.remove('menu-is-open');
  }, [menuOpen]);

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

        <nav className={`primary-nav${menuOpen ? ' is-open' : ''}`} aria-label="Primary navigation">
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
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
            </button>
          </form>
          <Link className="favorites-link" to="/favorites" aria-label={`My collection, ${favorites.length} items`}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.7-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1 4.5 2.7C12 6 13.5 5 15.5 5 19 5 21 8.5 20.5 12c-1 4.3-8.5 9-8.5 9Z" /></svg>
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
