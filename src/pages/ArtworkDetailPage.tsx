import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArtworkCard } from '../components/ArtworkCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { EmptyState } from '../components/UI';
import { useCompare } from '../context/CompareContext';
import { useFavorites } from '../context/FavoritesContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useSpeech } from '../hooks/useSpeech';
import { artworks, getArtist, getArtwork } from '../data/museumData';
import type { Artwork } from '../types';

export function ArtworkDetailPage() {
  const { artworkId = '' } = useParams();
  const artwork = getArtwork(artworkId);
  const artist = artwork ? getArtist(artwork.artistId) : undefined;
  const { isFavorite, toggleFavorite } = useFavorites();
  const { recordView } = useRecentlyViewed();
  const { isComparing, toggleCompare, isFull } = useCompare();
  const { speak, stop, isSpeaking, supported } = useSpeech();

  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [shareStatus, setShareStatus] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // Record this artwork in "recently viewed". recordView is stable, so this
  // effect fires only when the artwork itself changes.
  useEffect(() => {
    if (artwork) recordView(artwork.id);
  }, [artwork, recordView]);

  // Cancel any speech when the object changes.
  useEffect(() => {
    stop();
  }, [artworkId, stop]);

  useEffect(() => {
    if (!zoomOpen) setZoom(1);
  }, [zoomOpen]);

  // Reset lightbox index whenever we open it.
  useEffect(() => {
    if (zoomOpen) setLightboxIndex(0);
  }, [zoomOpen]);

  useEffect(() => {
    if (!zoomOpen) return;

    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setZoomOpen(false);
        return;
      }
      if (event.key === 'ArrowRight') {
        setLightboxIndex((i) => (i + 1) % Math.max(1, galleryWorks.length));
        return;
      }
      if (event.key === 'ArrowLeft') {
        setLightboxIndex((i) => (i - 1 + Math.max(1, galleryWorks.length)) % Math.max(1, galleryWorks.length));
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomOpen]);

  if (!artwork || !artist) {
    return (
      <EmptyState
        title="Object not found"
        description="This record may be between installations. Return to the archive to keep exploring."
        action={<Link className="button button-dark" to="/collections">Browse collections</Link>}
      />
    );
  }

  const related = artworks
    .filter(
      (item) =>
        item.id !== artwork.id &&
        (item.category === artwork.category ||
          item.collectionIds.some((id) => artwork.collectionIds.includes(id))),
    )
    .slice(0, 3);
  const favorite = isFavorite(artwork.id);
  const comparing = isComparing(artwork.id);
  const compareDisabled = !comparing && isFull;

  // Gallery used by the lightbox: the current artwork first, then related works.
  const galleryWorks: Artwork[] = [artwork, ...related];
  const lightboxArtwork = galleryWorks[lightboxIndex] ?? artwork;
  const lightboxArtist = getArtist(lightboxArtwork.artistId);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/works/${artwork.id}`;
    const shareData = {
      title: `${artwork.title} — The Meridian Archive`,
      text: artwork.description,
      url: shareUrl,
    };

    try {
      if (typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function') {
        await navigator.share(shareData);
        return;
      }
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus('Link copied to clipboard');
      } else {
        setShareStatus(`Copy this link: ${shareUrl}`);
      }
    } catch {
      setShareStatus('Unable to share right now');
    }
    window.setTimeout(() => setShareStatus(''), 2600);
  };

  const audioText = `${artwork.title}. By ${artist.name}, ${artwork.date}. ${artwork.description} ${artwork.context}`;

  return (
    <>
      <Breadcrumbs items={[{ label: 'Collections', to: '/collections' }, { label: artwork.title }]} />
      <section className="artwork-detail">
        <div className="artwork-viewer">
          <button
            className="artwork-viewer-image"
            type="button"
            onClick={() => setZoomOpen(true)}
            aria-label={`Open ${artwork.title} in image viewer`}
          >
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
          <div className="artwork-detail-actions">
            <button
              className={`button ${favorite ? 'button-dark' : 'button-outline-dark'} favorite-detail-button${favorite ? ' is-favorite' : ''}`}
              type="button"
              onClick={() => toggleFavorite(artwork.id)}
              aria-pressed={favorite}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21s-7.5-4.7-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1 4.5 2.7C12 6 13.5 5 15.5 5 19 5 21 8.5 20.5 12c-1 4.3-8.5 9-8.5 9Z" />
              </svg>
              {favorite ? 'Saved to my collection' : 'Save to my collection'}
            </button>
            <button
              className={`button ${comparing ? 'button-dark' : 'button-outline-dark'}`}
              type="button"
              onClick={() => toggleCompare(artwork.id)}
              disabled={compareDisabled}
              aria-pressed={comparing}
              title={compareDisabled ? 'Comparison is full (3 works max)' : undefined}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="8" height="14" />
                <rect x="13" y="5" width="8" height="14" />
              </svg>
              {comparing ? 'In comparison' : compareDisabled ? 'Comparison full' : 'Add to compare'}
            </button>
            {supported && (
              <button
                className="button button-outline-dark audio-guide-button"
                type="button"
                onClick={() => (isSpeaking ? stop() : speak(audioText))}
                aria-pressed={isSpeaking}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 9v6h4l5 4V5L8 9H4Z" />
                  {isSpeaking ? (
                    <>
                      <path d="M16 8.5a5 5 0 0 1 0 7" />
                      <path d="M19 6a9 9 0 0 1 0 12" />
                    </>
                  ) : (
                    <path d="M16 8.5a5 5 0 0 1 0 7" />
                  )}
                </svg>
                {isSpeaking ? 'Stop audio' : 'Listen to this work'}
              </button>
            )}
            <button
              className="button button-outline-dark share-detail-button"
              type="button"
              onClick={handleShare}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="6" cy="12" r="2.5" />
                <circle cx="18" cy="6" r="2.5" />
                <circle cx="18" cy="18" r="2.5" />
                <path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" />
              </svg>
              Share
            </button>
          </div>
          {shareStatus && (
            <p className="share-status" role="status">{shareStatus}</p>
          )}
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
            <p className="context-pullquote">
              “An object is never only itself. It is a record of attention, material, and the hands that
              carried it forward.”
            </p>
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
            <p>
              This fictional record is intentionally concise: it models the kind of transparent,
              replaceable metadata a real collection management system might expose.
            </p>
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
              <Link className="text-link" to={`/artists/${artist.id}`}>
                View creator profile <span aria-hidden="true">→</span>
              </Link>
            </div>
            <Link className="related-creator-image" to={`/artists/${artist.id}`}>
              <img src={artist.portrait} alt={`Portrait of ${artist.name}`} loading="lazy" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="section-inner">
          <div className="section-heading-row">
            <div><p className="eyebrow">Continue looking</p><h2>Related works</h2></div>
            <Link className="text-link" to="/collections">All works <span aria-hidden="true">→</span></Link>
          </div>
          <div className="artwork-grid artwork-grid-three">
            {related.map((item) => <ArtworkCard key={item.id} artwork={item} />)}
          </div>
        </div>
      </section>

      {zoomOpen && (
        <div className="image-modal" onClick={() => setZoomOpen(false)}>
          <div
            className="image-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`${lightboxArtwork.title} image viewer`}
            ref={dialogRef}
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="image-modal-content" style={{ transform: `scale(${zoom})` }}>
              <button
                className="image-modal-close"
                type="button"
                onClick={() => setZoomOpen(false)}
                aria-label="Close image viewer"
              >
                ×
              </button>
              <img src={lightboxArtwork.image} alt={lightboxArtwork.title} />
              <div className="image-modal-caption">
                <strong>{lightboxArtwork.title}</strong>
                <span>
                  {lightboxArtist?.name ?? 'Unknown maker'}, {lightboxArtwork.date}
                </span>
              </div>
            </div>
            {galleryWorks.length > 1 && (
              <div className="image-modal-nav" aria-label="Gallery navigation">
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((i) => (i - 1 + galleryWorks.length) % galleryWorks.length)
                  }
                  aria-label="Previous work"
                >
                  ←
                </button>
                <span>
                  {lightboxIndex + 1} / {galleryWorks.length}
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxIndex((i) => (i + 1) % galleryWorks.length)}
                  aria-label="Next work"
                >
                  →
                </button>
              </div>
            )}
            <div className="image-modal-controls">
              <button
                type="button"
                onClick={() => setZoom((value) => Math.max(0.7, value - 0.2))}
                aria-label="Zoom out"
              >
                −
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoom((value) => Math.min(2.2, value + 0.2))}
                aria-label="Zoom in"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}