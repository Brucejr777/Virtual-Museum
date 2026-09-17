import { Link } from 'react-router-dom';
import type { Exhibition } from '../types';

export function ExhibitionCard({ exhibition, featured = false }: { exhibition: Exhibition; featured?: boolean }) {
  return (
    <article className={`exhibition-card${featured ? ' exhibition-card-featured' : ''}`}>
      <Link className="exhibition-card-image" to={`/exhibitions/${exhibition.slug}`} aria-label={`Open ${exhibition.title}`}>
        <img src={exhibition.coverImage} alt="" loading="lazy" />
        {featured && <span className="image-flag">Current exhibition</span>}
      </Link>
      <div className="exhibition-card-body">
        <div className="exhibition-card-meta">
          <span>{exhibition.period}</span>
          <span>{exhibition.workIds.length} works</span>
        </div>
        <h3><Link to={`/exhibitions/${exhibition.slug}`}>{exhibition.title}</Link></h3>
        <p>{exhibition.dek}</p>
        <div className="card-footer-link">
          <span>Curated by {exhibition.curator}</span>
          <Link to={`/exhibitions/${exhibition.slug}`}>Enter exhibition <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </article>
  );
}
