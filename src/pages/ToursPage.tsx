import { Link } from 'react-router-dom';
import { PageHero, SectionHeading } from '../components/UI';
import { tours } from '../data/tours';
import { artworks } from '../data/museumData';

export function ToursPage() {
  return (
    <>
      <PageHero
        eyebrow="Guided tours"
        title="Take a walk through the archive"
        description="Curated routes through the collection — each one built around a question, a mood, or a material."
        image={artworks.find((work) => work.id === 'book-kells')?.image}
        imageAlt="An illuminated manuscript page with interlaced forms"
      />

      <section className="section">
        <div className="section-inner">
          <SectionHeading
            eyebrow="Choose your route"
            title="Three ways to wander"
            description="Every tour is self-guided. Move at your own pace, pause on anything that catches your eye, and return whenever you like."
          />
          <div className="tour-grid">
            {tours.map((tour) => (
              <article className="tour-card" key={tour.id}>
                <Link className="tour-card-image" to={`/tours/${tour.slug}`} aria-label={`Open tour ${tour.title}`}>
                  <img src={tour.coverImage} alt="" loading="lazy" />
                  <span className="tour-card-badge">{tour.steps.length} stops</span>
                </Link>
                <div className="tour-card-body">
                  <p className="eyebrow">{tour.pace}</p>
                  <h3>
                    <Link to={`/tours/${tour.slug}`}>{tour.title}</Link>
                  </h3>
                  <p className="tour-card-dek">{tour.dek}</p>
                  <div className="tour-card-meta">
                    <span>{tour.duration}</span>
                    <Link className="text-link" to={`/tours/${tour.slug}`}>
                      Begin tour <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="section-inner collection-note-grid">
          <div>
            <p className="eyebrow">How tours work</p>
            <h2>A route, not a rule.</h2>
          </div>
          <p>
            Each tour is a suggested sequence — a way to hold several objects in mind at once. You can
            follow it strictly, skip ahead, or step out at any point and follow an object back into its
            own record. Progress is saved in this browser only.
          </p>
        </div>
      </section>
    </>
  );
}