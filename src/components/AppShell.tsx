import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { usePageEffects } from '../hooks/usePageEffects';

export function AppShell({ children }: { children: React.ReactNode }) {
  usePageEffects();
  const { pathname } = useLocation();

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'The Meridian Archive — A Virtual Museum',
      '/exhibitions': 'Exhibitions — The Meridian Archive',
      '/collections': 'Collections — The Meridian Archive',
      '/artists': 'Artists & Creators — The Meridian Archive',
      '/timeline': 'Timeline — The Meridian Archive',
      '/search': 'Search — The Meridian Archive',
      '/about': 'About — The Meridian Archive',
      '/favorites': 'My Collection — The Meridian Archive',
    };
    document.title = titles[pathname] ?? 'The Meridian Archive';
  }, [pathname]);

  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
