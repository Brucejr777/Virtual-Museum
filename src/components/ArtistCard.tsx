import { Link } from 'react-router-dom';
import type { Artist } from '../types';

export function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <article className="artist-card">
      <Link className="artist-card-image" to={`/artists/${artist.id}`} aria-label={`View ${artist.name}`}>
        <img src={artist.portrait} alt={`Portrait of ${artist.name}`} loading="lazy" />
      </Link>
      <div className="artist-card-body">
        <span className="eyebrow">{artist.movement}</span>
        <h3><Link to={`/artists/${artist.id}`}>{artist.name}</Link></h3>
        <p className="artist-lifespan">{artist.birth}–{artist.death} · {artist.nationality}</p>
        <p>{artist.bio}</p>
      </div>
    </article>
  );
}
