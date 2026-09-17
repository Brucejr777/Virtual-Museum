import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { EmptyState } from '../components/UI';
import { useCompare } from '../context/CompareContext';
import { getArtist, getArtwork } from '../data/museumData';

export function ComparePage() {
  const { compareIds, removeCompare, clearCompare } = useCompare();

  const works = compareIds
    .map((id) => getArtwork(id))
    .filter((work): work is NonNullable<typeof work> => Boolean(work));

  if (works.length === 0) {
    return (
      <>
        <Breadcrumbs items={[{ label: 'Compare' }]} />
        <EmptyState
          title="Nothing to compare yet"
          description="Add two or three works to the comparison tray from any artwork card and they will appear here side by side."
          action={<Link className="button button-dark" to="/collections">Browse collections</Link>}
        />
      </>
    );
  }

  return (
    <>
      <Breadcrumbs items={[{ label: 'Compare' }]} />

      <section className="compare-page">
        <div className="compare-page-heading">
          <p className="eyebrow">Side by side</p>
          <h1>{works.length} {works.length === 1 ? 'work' : 'works'} in view</h1>
          <p>
            Compare materials, dates, and framing decisions across the selected objects. Remove a work
            to make room for another.
          </p>
          <button type="button" className="filter-clear" onClick={clearCompare}>
            Clear comparison
          </button>
        </div>

        <div className={`compare-grid compare-grid-${works.length}`}>
          {works.map((work) => {
            const artist = getArtist(work.artistId);
            return (
              <article className="compare-column" key={work.id}>
                <div className="compare-column-image">
                  <Link to={`/works/${work.id}`} aria-label={`Open ${work.title}`}>
                    <img src={work.image} alt={work.title} />
                  </Link>
                  <button
                    type="button"
                    className="compare-remove"
                    onClick={() => removeCompare(work.id)}
                    aria-label={`Remove ${work.title} from comparison`}
                  >
                    ×
                  </button>
                </div>
                <div className="compare-column-body">
                  <p className="eyebrow">{work.category} · {work.period}</p>
                  <h2>
                    <Link to={`/works/${work.id}`}>{work.title}</Link>
                  </h2>
                  {artist && (
                    <p className="compare-credit">
                      <Link to={`/artists/${artist.id}`}>{artist.name}</Link> · {work.date}
                    </p>
                  )}
                  <dl className="compare-facts">
                    <div><dt>Medium</dt><dd>{work.medium}</dd></div>
                    <div><dt>Dimensions</dt><dd>{work.dimensions}</dd></div>
                    <div><dt>Location</dt><dd>{work.location}</dd></div>
                  </dl>
                  <p className="compare-description">{work.description}</p>
                  <p className="compare-context">{work.context}</p>
                </div>
              </article>
            );
          })}
        </div>

        {works.length === 1 && (
          <p className="compare-hint">
            Add another work from any card in the archive to see them side by side.
          </p>
        )}
      </section>
    </>
  );
}