import { Link } from 'react-router-dom';
import type { Collection } from '../types';

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link className="collection-card" to={`/collections#${collection.slug}`}>
      <div className="collection-card-image">
        <img src={collection.image} alt="" loading="lazy" />
        <span className="collection-card-count">{collection.workIds.length} works</span>
      </div>
      <div className="collection-card-body">
        <span className="eyebrow">{collection.category}</span>
        <h3>{collection.name}</h3>
        <p>{collection.description}</p>
        <span className="text-link">Explore collection <span aria-hidden="true">→</span></span>
      </div>
    </Link>
  );
}
