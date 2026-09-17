import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import type { Artwork } from '../types';
import { getArtist } from '../data/museumData';

export function ArtworkCard({ artwork, variant = 'standard' }: { artwork: Artwork; variant?: 'standard' | 'feature' | 'compact' }) {
  const artist = getArtist(artwork.artistId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(artwork.id);

  return (
    <article className={`artwork-card artwork-card-${variant}`}>
      <Link className="artwork-card-image" to={`/works/${artwork.id}`} aria-label={`View ${artwork.title}`}>
        <img src={artwork.image} alt={artwork.title} loading={variant === 'feature' ? 'eager' : 'lazy'} />
        {artwork.featured && <span className="image-flag">Featured</span>}
      </Link>
      <div className="artwork-card-body">
        <div className="artwork-card-topline">
          <span className="eyebrow">{artwork.category}</span>
          <button
            className={`favorite-button${favorite ? ' is-favorite' : ''}`}
            type="button"
            onClick={() => toggleFavorite(artwork.id)}
            aria-label={favorite ? `Remove ${artwork.title} from my collection` : `Add ${artwork.title} to my collection`}
            aria-pressed={favorite}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.7-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1 4.5 2.7C12 6 13.5 5 15.5 5 19 5 21 8.5 20.5 12c-1 4.3-8.5 9-8.5 9Z" /></svg>
          </button>
        </div>
        <h3><Link to={`/works/${artwork.id}`}>{artwork.title}</Link></h3>
        <p className="artwork-credit">{artist?.name} · {artwork.date}</p>
        {variant !== 'compact' && <p className="artwork-card-description">{artwork.description}</p>}
      </div>
    </article>
  );
}
