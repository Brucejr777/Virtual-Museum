import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CommandPalette } from './CommandPalette';
import { usePageEffects } from '../hooks/usePageEffects';

const titles: Record<string, string> = {
  '/': 'The Meridian Archive — A Virtual Museum',
  '/exhibitions': 'Exhibitions — The Meridian Archive',
  '/collections': 'Collections — The Meridian Archive',
  '/artists': 'Artists & Creators — The Meridian Archive',
  '/timeline': 'Timeline — The Meridian Archive',
  '/search': 'Search — The Meridian Archive',
  '/about': 'About — The Meridian Archive',
  '/favorites': 'My Collection — The Meridian Archive',
  '/404': 'Not found — The Meridian Archive',
};

export function AppShell() {
  usePageEffects();
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = titles[pathname] ?? 'The Meridian Archive';
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <CommandPalette />
    </>
  );
}