import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { EmptyState } from '../components/UI';
import { getTour } from '../data/tours';
import { getArtist, getArtwork } from '../data/museumData';

const progressKey = (slug: string) => `meridian-tour-progress-${slug}`;

function readProgress(slug: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = window.localStorage.getItem(progressKey(slug));
    if (!stored) return 0;
    const parsed = Number.parseInt(stored, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

export function TourDetailPage() {
  const { slug = '' } = useParams();
  const tour = getTour(slug);
  const [stepIndex, setStepIndex] = useState(() => readProgress(slug));

  useEffect(() => {
    setStepIndex(readProgress(slug));
  }, [slug]);

  useEffect(() => {
    if (!tour) return;
    document.title = `${tour.title} — The Meridian Archive`;
    return () => {
      document.title = 'The Meridian Archive';
    };
  }, [tour]);

  useEffect(() => {
    if (!tour) return;
    try {
      window.localStorage.setItem(progressKey(slug), String(stepIndex));
    } catch {
      // Ignore storage errors
    }
  }, [slug, stepIndex, tour]);

  const step = tour?.steps[stepIndex];
  const artwork = step ? getArtwork(step.artworkId) : undefined;
  const artist = artwork ? getArtist(artwork.artistId) : undefined;

  const stops = useMemo(() => tour?.steps ?? [], [tour]);

  if (!tour) {
    return (
      <EmptyState
        title="Tour not found"
        description="This guided walk may be between installations. Return to the tour list to keep exploring."
        action={<Link className="button button-dark" to="/tours">View tours</Link>}
      />
    );
  }

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === stops.length - 1;

  const reset = () => setStepIndex(0);
  const next = () => setStepIndex((i) => Math.min(i + 1, stops.length - 1));
  const prev = () => setStepIndex((i) => Math.max(i - 1, 0));

  return (
    <>
      <Breadcrumbs items={[{ label: 'Tours', to: '/tours' }, { label: tour.title }]} />

      <section className="tour-intro">
        <div className="tour-intro-copy">
          <p className="eyebrow">{tour.pace} · {tour.duration}</p>
          <h1>{tour.title}</h1>
          <p className="tour-intro-dek">{tour.dek}</p>
          <p>{tour.description}</p>
          <div className="tour-intro-meta">
            <span><small>Stops</small>{stops.length}</span>
            <span><small>Progress</small>{stepIndex + 1} of {stops.length}</span>
            <span><small>Mode</small>Self-guided</span>
          </div>
        </div>
        <div className="tour-intro-image" data-reveal>
          <img src={tour.coverImage} alt="" />
        </div>
      </section>

      <section className="section section-tinted tour-runner">
        <div className="section-inner">
          <div className="tour-progress" aria-label="Tour progress">
            {stops.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`tour-progress-dot${index === stepIndex ? ' is-active' : ''}${index < stepIndex ? ' is-done' : ''}`}
                onClick={() => setStepIndex(index)}
                aria-label={`Go to stop ${index + 1}`}
                aria-current={index === stepIndex}
              />
            ))}
          </div>

          {step && artwork && (
            <div className="tour-step">
              <div className="tour-step-image">
                <Link to={`/works/${artwork.id}`} aria-label={`Open ${artwork.title}`}>
                  <img src={artwork.image} alt={artwork.title} />
                </Link>
                <span className="tour-step-index">
                  Stop {String(stepIndex + 1).padStart(2, '0')} / {String(stops.length).padStart(2, '0')}
                </span>
              </div>
              <div className="tour-step-copy">
                <p className="eyebrow">{artwork.category} · {artwork.date}</p>
                <h2>{step.title}</h2>
                <p className="tour-step-artwork-title">
                  <Link to={`/works/${artwork.id}`}>{artwork.title}</Link>
                  {artist && <span> · {artist.name}</span>}
                </p>
                <p>{step.note}</p>
                <blockquote className="tour-prompt">
                  <span className="eyebrow">Looking prompt</span>
                  <p>{step.prompt}</p>
                </blockquote>
                <div className="tour-step-actions">
                  <Link className="button button-outline-dark" to={`/works/${artwork.id}`}>
                    Open object record
                  </Link>
                  <button type="button" className="filter-clear" onClick={reset}>
                    Restart tour
                  </button>
                </div>
              </div>
            </div>
          )}

          <nav className="tour-nav" aria-label="Tour navigation">
            <button
              type="button"
              className="button button-outline-dark"
              onClick={prev}
              disabled={isFirst}
            >
              ← Previous stop
            </button>
            <span className="tour-nav-position">
              {stepIndex + 1} / {stops.length}
            </span>
            <button
              type="button"
              className="button button-dark"
              onClick={next}
              disabled={isLast}
            >
              {isLast ? 'End of tour' : 'Next stop →'}
            </button>
          </nav>

          {isLast && (
            <div className="tour-complete">
              <p className="eyebrow">Tour complete</p>
              <h3>You’ve reached the end.</h3>
              <p>
                This walk is finished, but the objects remain open. Follow any of them back into their
                own records, or choose another route.
              </p>
              <div className="tour-complete-actions">
                <Link className="button button-dark" to="/tours">
                  Choose another tour
                </Link>
                <button type="button" className="filter-clear" onClick={reset}>
                  Walk it again
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}