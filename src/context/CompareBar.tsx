import { Link, useLocation } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { getArtwork } from '../data/museumData';

export function CompareBar() {
  const { compareIds, removeCompare, clearCompare } = useCompare();
  const { pathname } = useLocation();

  if (compareIds.length === 0 || pathname === '/compare') return null;

  const works = compareIds
    .map((id) => getArtwork(id))
    .filter((work): work is NonNullable<typeof work> => Boolean(work));

  return (
    <aside className="compare-bar" aria-label="Comparison tray">
      <div className="compare-bar-inner">
        <div className="compare-bar-label">
          <span className="eyebrow">Compare</span>
          <strong>{compareIds.length} of 3 selected</strong>
        </div>
        <ul className="compare-bar-items">
          {works.map((work) => (
            <li key={work.id}>
              <img src={work.image} alt="" />
              <span className="compare-bar-item-title">{work.title}</span>
              <button
                type="button"
                onClick={() => removeCompare(work.id)}
                aria-label={`Remove ${work.title} from comparison`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <div className="compare-bar-actions">
          <button type="button" className="filter-clear" onClick={clearCompare}>
            Clear
          </button>
          <Link className="button button-dark" to="/compare">
            Compare {compareIds.length > 1 ? `${compareIds.length} works` : 'work'}
          </Link>
        </div>
      </div>
    </aside>
  );
}