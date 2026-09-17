import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { FavoritesProvider } from './context/FavoritesContext';
import { AboutPage } from './pages/AboutPage';
import { ArtistDetailPage } from './pages/ArtistDetailPage';
import { ArtistsPage } from './pages/ArtistsPage';
import { ArtworkDetailPage } from './pages/ArtworkDetailPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ExhibitionDetailPage } from './pages/ExhibitionDetailPage';
import { ExhibitionsPage } from './pages/ExhibitionsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { Home } from './pages/Home';
import { SearchPage } from './pages/SearchPage';
import { TimelinePage } from './pages/TimelinePage';

function NotFound() {
  return (
    <AppShell>
      <section className="not-found">
        <p className="eyebrow">404</p>
        <h1>This room is between installations.</h1>
        <p>The page you requested is not part of the current gallery plan.</p>
        <a className="button button-dark" href="/">Return to the museum</a>
      </section>
    </AppShell>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
      <AppShell>
        <Routes>
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
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AppShell>
    </FavoritesProvider>
  );
}
