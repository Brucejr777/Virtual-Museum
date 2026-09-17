import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExhibitionCard } from '../components/ExhibitionCard';
import { ArtistCard } from '../components/ArtistCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { EmptyState, SectionHeading } from '../components/UI';
import { artists, artworks, exhibitions, getArtist } from '../data/museumData';
import type { Artwork } from '../types';

export function ExhibitionDetailPage() {
  const { slug = '' } = useParams();
  const exhibition = exhibitions.find((item) => item.slug === slug);
  const [activeWork, setActiveWork] = useState<string>('');

  // Reset the active work when the exhibition changes.
  useEffect(() => {
    setActiveWork(exhibition?.workIds[0] ?? '');
  }, [exhibition?.id]);

  const activeArtwork = artworks.find((work) => work.id === activeWork) ?? undefined;

  const relatedExhibitions = useMemo(
    () =>
      exhibition?.relatedExhibitionIds
        .map((id) => exhibitions.find((item) => item.id === id))
        .filter(Boolean) ?? [],
    [exhibition],
  );

  const relatedArtists = useMemo(
    () =>
      exhibition?.relatedArtistIds
        .map((id) => artists.find((item) => item.id === id))
        .filter(Boolean) ?? [],
    [exhibition],
  );

  const featuredWorks = useMemo<Artwork[]>(
    () =>
      exhibition?.workIds
        .map((id) => artworks.find((work) => work.id === id))
        .filter((work): work is Artwork => Boolean(work)) ?? [],
    [exhibition],
  );

  if (!exhibition) {
    return (
      <EmptyState
        title="Exhibition not found"
        description="This gallery may be between installations. Return to the exhibition program to keep exploring."
        action={<Link className="button button-dark" to="/exhibitions">View exhibitions</Link>}
      />
    );
  }

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = featuredWorks.length - 1;
    if (last < 0) return;

    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = index === last ? 0 : index + 1;
    else if (event.key === 'ArrowLeft') nextIndex = index === 0 ? last : index - 1;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = last;
    else return;

    event.preventDefault();
    setActiveWork(featuredWorks[nextIndex].id);
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[nextIndex]?.focus();
  };

  return (
    <>
      <Breadcrumbs items={[{ label: 'Exhibitions', to: '/exhibitions' }, { label: exhibition.title }]} />
      <section className="exhibition-intro">
        <div className="exhibition-intro-copy">
          <p className="eyebrow">{exhibition.category} · {exhibition.period}</p>
          <h1>{exhibition.title}</h1>
          <p className="exhibition-dek">{exhibition.dek}</p>
          <p>{exhibition.description}</p>
          <div className="exhibition-meta">
            <span><small>Curator</small>{exhibition.curator}</span>
            <span><small>Works</small>{exhibition.workIds.length} objects</span>
            <span><small>Visit</small>Always open</span>
          </div>
        </div>
        <div className="exhibition-intro-image" data-reveal>
          <img src={exhibition.coverImage} alt="" />
          <span className="image-caption">Gallery view · Meridian Archive</span>
        </div>
      </section>

      <section className="section section-tinted curator-section">
        <div className="section-inner curator-card">
          <div>
            <p className="eyebrow">A note from the curator</p>
            <h2>“{exhibition.dek.replace(/\.$/, '')}.”</h2>
          </div>
          <div>
            <p>{exhibition.description}</p>
            <p className="curator-signature">— {exhibition.curator}, Curator of Interpretive Programs</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <SectionHeading
            eyebrow="Inside the gallery"
            title="Featured works"
            description="Choose an object to bring it closer. Each work opens a detailed record with materials, context, and provenance."
          />
          <div className="exhibition-gallery">
            <div className="exhibition-gallery-main">
              {activeArtwork ? (
                <Link className="exhibition-gallery-image" to={`/works/${activeArtwork.id}`}>
                  <img src={activeArtwork.image} alt={activeArtwork.title} />
                  <span className="gallery-zoom-label">
                    View object record <span aria-hidden="true">→</span>
                  </span>
                </Link>
              ) : (
                <div className="empty-state"><h2>Select a work</h2></div>
              )}
            </div>
            <div className="exhibition-gallery-thumbs" role="tablist" aria-label="Featured works">
              {featuredWorks.map((work, index) => (
                <button
                  className={activeWork === work.id ? 'is-active' : ''}
                  key={work.id}
                  type="button"
                  onClick={() => setActiveWork(work.id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  role="tab"
                  aria-selected={activeWork === work.id}
                  tabIndex={activeWork === work.id ? 0 : -1}
                >
                  <img src={work.image} alt="" />
                  <span>
                    <strong>{work.title}</strong>
                    <small>
                      {work.artistId ? getArtist(work.artistId)?.name : 'Unknown maker'} · {work.date}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section exhibition-timeline-section">
        <div className="section-inner">
          <SectionHeading eyebrow="A route through time" title="The exhibition timeline" />
          <div className="exhibition-timeline">
            {exhibition.timeline.map((item, index) => (
              <article className="exhibition-timeline-item" key={`${item.year}-${item.label}`}>
                <span className="timeline-index">0{index + 1}</span>
                <div>
                  <span>{item.year}</span>
                  <h3>{item.label}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="section-inner">
          <SectionHeading eyebrow="Related artists" title="Makers in this room" />
          <div className="artist-grid artist-grid-three">
            {relatedArtists.map((artist) => artist && <ArtistCard key={artist.id} artist={artist} />)}
          </div>
        </div>
      </section>

      {relatedExhibitions.length > 0 && (
        <section className="section">
          <div className="section-inner">
            <SectionHeading eyebrow="Keep wandering" title="Related exhibitions" />
            <div className="exhibition-grid exhibition-grid-three">
              {relatedExhibitions.map((item) => item && <ExhibitionCard key={item.id} exhibition={item} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}