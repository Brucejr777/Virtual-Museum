import { Link } from 'react-router-dom';
import { ExhibitionCard } from '../components/ExhibitionCard';
import { CollectionCard } from '../components/CollectionCard';
import { ArtistCard } from '../components/ArtistCard';
import { SectionHeading } from '../components/UI';
import { artists, artworks, collections, exhibitions, timeline } from '../data/museumData';
import { tours } from '../data/tours';

export function Home() {
  const featuredExhibition = exhibitions.find((exhibition) => exhibition.featured);
  const featuredArtwork = artworks.find((artwork) => artwork.featured && artwork.id === 'starry-night');
  const currentExhibitions = exhibitions.slice(0, 3);
  const featuredArtists = artists.slice(0, 3);
  const storyWorks = [artworks.find((work) => work.id === 'book-kells'), artworks.find((work) => work.id === 'great-wave'), artworks.find((work) => work.id === 'dragonfly-lamp')].filter(Boolean);

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-image">
          <img src={featuredArtwork?.image} alt="" />
        </div>
        <div className="home-hero-scrim" />
        <div className="home-hero-content">
          <p className="eyebrow light">A museum without walls</p>
          <h1>Where every object<br />has a story<br />to carry.</h1>
          <p className="home-hero-dek">Step into a borderless collection of paintings, artifacts, manuscripts, and ideas—curated for slow looking and unexpected connections.</p>
          <div className="home-hero-actions">
            <Link className="button button-light" to="/exhibitions">Explore exhibitions</Link>
            <Link className="button button-outline-light" to="/tours">Take a guided tour</Link>
          </div>
        </div>
        <div className="home-hero-foot">
          <span>Currently on view</span>
          <strong>{featuredExhibition?.title}</strong>
          <Link to={`/exhibitions/${featuredExhibition?.slug}`}>Enter the gallery <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="section featured-story">
        <div className="section-inner split-feature">
          <div className="feature-image-frame" data-reveal>
            <img src={featuredArtwork?.image} alt={featuredArtwork?.title} />
            <span className="feature-caption">Featured object · {featuredArtwork?.date}</span>
          </div>
          <div className="feature-copy">
            <SectionHeading eyebrow="Object in focus" title="A sky that refuses to stay still" description="Begin with one painting and let it open outward: into a life, a century, and the many ways artists have imagined the night." />
            <p>{featuredArtwork?.description}</p>
            <p className="feature-note">The Meridian Archive is a fictional museum built around open-access images and interpretive stories. Every visit is an invitation to look again.</p>
            <Link className="text-link" to={`/works/${featuredArtwork?.id}`}>Meet the artwork <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="section-inner">
          <div className="section-heading-row">
            <SectionHeading eyebrow="Now showing" title="Exhibitions with room to wander" description="Each gallery is designed as a sequence of encounters—begin anywhere, follow what catches your eye." />
            <Link className="text-link section-all-link" to="/exhibitions">All exhibitions <span aria-hidden="true">→</span></Link>
          </div>
          <div className="exhibition-grid">
            {currentExhibitions.map((exhibition, index) => (
              <ExhibitionCard key={exhibition.id} exhibition={exhibition} featured={index === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="section tours-preview">
        <div className="section-inner">
          <div className="section-heading-row">
            <SectionHeading eyebrow="Guided tours" title="Follow a route, or wander off it" description="Curated walks through the archive — each one built around a question, a mood, or a material." />
            <Link className="text-link section-all-link" to="/tours">All tours <span aria-hidden="true">→</span></Link>
          </div>
          <div className="tour-grid tour-grid-three">
            {tours.map((tour) => (
              <article className="tour-card" key={tour.id}>
                <Link className="tour-card-image" to={`/tours/${tour.slug}`} aria-label={`Open tour ${tour.title}`}>
                  <img src={tour.coverImage} alt="" loading="lazy" />
                  <span className="tour-card-badge">{tour.steps.length} stops</span>
                </Link>
                <div className="tour-card-body">
                  <p className="eyebrow">{tour.pace} · {tour.duration}</p>
                  <h3><Link to={`/tours/${tour.slug}`}>{tour.title}</Link></h3>
                  <p className="tour-card-dek">{tour.dek}</p>
                  <Link className="text-link" to={`/tours/${tour.slug}`}>
                    Begin tour <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section collection-preview">
        <div className="section-inner">
          <SectionHeading eyebrow="Find your way in" title="Nine collections, countless routes" description="Move by material, period, or curiosity. The archive is built to reward both planned visits and happy detours." />
          <div className="collection-grid">
            {collections.slice(0, 4).map((collection) => <CollectionCard key={collection.id} collection={collection} />)}
          </div>
          <div className="collection-preview-more">
            <Link className="button button-dark" to="/collections">Explore all collections</Link>
            <span className="collection-stat"><strong>{artworks.length}</strong> works in the archive</span>
          </div>
        </div>
      </section>

      <section className="section timeline-preview">
        <div className="section-inner timeline-preview-grid">
          <div className="timeline-preview-copy">
            <SectionHeading eyebrow="A long view" title="Move through time, not just across it" description="The timeline connects artistic movements, objects, and the people who made them." />
            <Link className="text-link" to="/timeline">Open the timeline <span aria-hidden="true">→</span></Link>
          </div>
          <div className="timeline-preview-track">
            {timeline.slice(0, 4).map((event) => (
              <Link className="timeline-preview-item" key={event.id} to={event.artworkId ? `/works/${event.artworkId}` : '/timeline'}>
                <span>{event.year}</span>
                <strong>{event.title}</strong>
                <p>{event.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tinted artist-preview">
        <div className="section-inner">
          <div className="section-heading-row">
            <SectionHeading eyebrow="Makers &amp; minds" title="Meet the people behind the looking" />
            <Link className="text-link section-all-link" to="/artists">All artists <span aria-hidden="true">→</span></Link>
          </div>
          <div className="artist-grid">
            {featuredArtists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}
          </div>
        </div>
      </section>

      <section className="section stories-section">
        <div className="section-inner stories-grid">
          <div className="story-intro">
            <p className="eyebrow">Curated stories</p>
            <h2>Small doors into<br />large worlds.</h2>
            <p>Read an object as a map, a material as a memory, or a portrait as a conversation. Our stories are written to be entered slowly.</p>
          </div>
          <div className="story-list">
            {storyWorks.map((work, index) => work && (
              <Link className="story-row" key={work.id} to={`/works/${work.id}`}>
                <span className="story-number">0{index + 1}</span>
                <span className="story-row-copy"><strong>{work.title}</strong><small>{work.context}</small></span>
                <span className="story-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="museum-info">
        <div className="section-inner museum-info-grid">
          <div>
            <p className="eyebrow light">Visit the idea</p>
            <h2>A museum for the way you actually look.</h2>
          </div>
          <p>The Meridian Archive is an independent virtual museum for curious visitors. No tickets, no queues, no single correct path—just objects, stories, and the time to make connections.</p>
          <Link className="button button-light" to="/about">Our museum concept</Link>
        </div>
      </section>
    </>
  );
}