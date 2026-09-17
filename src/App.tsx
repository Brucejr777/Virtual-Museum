import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { FavoritesProvider } from './context/FavoritesContext';
import { Home } from './pages/Home';
import { NotFoundPage } from './pages/NotFoundPage';

// Route-level code splitting: Home is eager (it's the landing page),
// everything else is loaded on demand.
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })),
);
const ArtistDetailPage = lazy(() =>
  import('./pages/ArtistDetailPage').then((module) => ({ default: module.ArtistDetailPage })),
);
const ArtistsPage = lazy(() =>
  import('./pages/ArtistsPage').then((module) => ({ default: module.ArtistsPage })),
);
const ArtworkDetailPage = lazy(() =>
  import('./pages/ArtworkDetailPage').then((module) => ({ default: module.ArtworkDetailPage })),
);
const CollectionsPage = lazy(() =>
  import('./pages/CollectionsPage').then((module) => ({ default: module.CollectionsPage })),
);
const ExhibitionDetailPage = lazy(() =>
  import('./pages/ExhibitionDetailPage').then((module) => ({ default: module.ExhibitionDetailPage })),
);
const ExhibitionsPage = lazy(() =>
  import('./pages/ExhibitionsPage').then((module) => ({ default: module.ExhibitionsPage })),
);
const FavoritesPage = lazy(() =>
  import('./pages/FavoritesPage').then((module) => ({ default: module.FavoritesPage })),
);
const SearchPage = lazy(() =>
  import('./pages/SearchPage').then((module) => ({ default: module.SearchPage })),
);
const TimelinePage = lazy(() =>
  import('./pages/TimelinePage').then((module) => ({ default: module.TimelinePage })),
);

function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <span className="route-fallback-mark" aria-hidden="true">M</span>
      <p>Opening the room…</p>
    </div>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Layout route: AppShell renders once and <Outlet /> swaps pages. */}
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/exhibitions" element={<ExhibitionsPage />} />
            <Route path="/exhibitions/:slug" element={<ExhibitionDetailPage />} />
            <Route path="/works/:artworkId" element={<ArtworkDetailPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/artists/:artistId" element={<ArtistDetailPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </FavoritesProvider>
  );
}