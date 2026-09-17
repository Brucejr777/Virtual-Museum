import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArtworkCard } from '../components/ArtworkCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { EmptyState } from '../components/UI';
import { useFavorites } from '../context/FavoritesContext';
import { artworks, getArtist } from '../data/museumData';

export function ArtworkDetailPage() {
  const { artworkId = '' } = useParams();
  const artwork = artworks.find((item) => item.id === artworkId);
  const artist = artwork ? getArtist(artwork.artistId) : undefined;
  const { isFavorite, toggleFavorite } = useFavorites();
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!zoomOpen) setZoom(1);
  }, [zoomOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (!artwork || !artist) {
    return <EmptyState title="Object not found" description="This record may be between installations. Return to the archive to keep exploring." action={<Link className="button button-dark" to="/collections">Browse collections</Link>} />;
  }

  const related = artworks.filter((item) => item.id !== artwork.id && (item.category === artwork.category || item.collectionIds.some((id) => artwork.collectionIds.includes(id)))).slice(0, 3);
  const favorite = isFavorite(artwork.id);

  return (
    <>
      <Breadcrumbs items={[{ label: 'Collections', to: '/collections' }, { label: artwork.title }]} />
      <section className="artwork-detail">
        <div className="artwork-viewer">
          <button className="artwork-viewer-image" type="button" onClick={() => setZoomOpen(true)} aria-label={`Open ${artwork.title} in image viewer`}>
            <img src={artwork.image} alt={artwork.title} />
            <span className="viewer-hint">Click to enlarge</span>
          </button>
          <div className="zoom-controls" aria-label="Image viewer controls">
            <button type="button" onClick={() => setZoomOpen(true)} aria-label="Enlarge image">+</button>
            <span>View details</span>
          </div>
        </div>
        <div className="artwork-detail-copy">
          <p className="eyebrow">{artwork.category} · {artwork.period}</p>
          <h1>{artwork.title}</h1>
          <p className="artwork-artist-line"><Link to={`/artists/${artist.id}`}>{artist.name}</Link></p>
          <p className="artwork-detail-description">{artwork.description}</p>
          <dl className="artwork-facts">
            <div><dt>Date</dt><dd>{artwork.date}</dd></div>
            <div><dt>Medium</dt><dd>{artwork.medium}</dd></div>
            <div><dt>Dimensions</dt><dd>{artwork.dimensions}</dd></div>
            <div><dt>Location</dt><dd>{artwork.location}</dd></div>
          </dl>
          <button className={`button ${favorite ? 'button-dark' : 'button-outline-dark'} favorite-detail-button`} type="button" onClick={() => toggleFavorite(artwork.id)} aria-pressed={favorite}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.7-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1 4.5 2.7C12 6 13.5 5 15.5 5 19 5 21 8.5 20.5 12c-1 4.3-8.5 9-8.5 9Z" /></svg>
            {favorite ? 'Saved to my collection' : 'Save to my collection'}
          </button>
        </div>
      </section>

      <section className="section artwork-context">
        <div className="section-inner artwork-context-grid">
          <div>
            <p className="eyebrow">Historical context</p>
            <h2>{artwork.context}</h2>
          </div>
          <div>
            <p>{artwork.description} {artwork.context}</p>
            <p className="context-pullquote">“An object is never only itself. It is a record of attention, material, and the hands that carried it forward.”</p>
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="section-inner provenance-panel">
          <div>
            <p className="eyebrow">Collection record</p>
            <h2>Provenance &amp; care</h2>
          </div>
          <div>
            <p>{artwork.provenance}</p>
            <p>This fictional record is intentionally concise: it models the kind of transparent, replaceable metadata a real collection management system might expose.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-heading-row">
            <div className="related-creator">
              <p className="eyebrow">Related creator</p>
              <h2>{artist.name}</h2>
              <p>{artist.bio}</p>
              <Link className="text-link" to={`/artists/${artist.id}`}>View creator profile <span aria-hidden="true">→</span></Link>
            </div>
            <Link className="related-creator-image" to={`/artists/${artist.id}`}><img src={artist.portrait} alt={`Portrait of ${artist.name}`} loading="lazy" /></Link>
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="section-inner">
          <div className="section-heading-row">
            <div><p className="eyebrow">Continue looking</p><h2>Related works</h2></div>
            <Link className="text-link" to="/collections">All works <span aria-hidden="true">→</span></Link>
          </div>
          <div className="artwork-grid artwork-grid-three">{related.map((item) => <ArtworkCard key={item.id} artwork={item} />)}</div>
        </div>
      </section>

      {zoomOpen && (
        <div className="image-modal" role="dialog" aria-modal="true" aria-label={`${artwork.title} image viewer`} onClick={() => setZoomOpen(false)}>
          <div className="image-modal-content" style={{ transform: `scale(${zoom})` }} onClick={(event) => event.stopPropagation()}>
            <button className="image-modal-close" type="button" onClick={() => setZoomOpen(false)} aria-label="Close image viewer">×</button>
            <img src={artwork.image} alt={artwork.title} />
            <div className="image-modal-caption"><strong>{artwork.title}</strong><span>{artist.name}, {artwork.date}</span></div>
          </div>
          <div className="image-modal-controls" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setZoom((value) => Math.max(0.7, value - 0.2))} aria-label="Zoom out">−</button>
            <span>{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => setZoom((value) => Math.min(2.2, value + 0.2))} aria-label="Zoom in">+</button>
          </div>
        </div>
      )}
    </>
  );
}
