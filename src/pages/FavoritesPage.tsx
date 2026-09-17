import { Link } from 'react-router-dom';
import { ArtworkCard } from '../components/ArtworkCard';
import { EmptyState, PageHero, SectionHeading } from '../components/UI';
import { useFavorites } from '../context/FavoritesContext';
import { artworks } from '../data/museumData';

export function FavoritesPage() {
  const { favorites } = useFavorites();
  const favoriteWorks = artworks.filter((work) => favorites.includes(work.id));

  return (
    <>
      <PageHero eyebrow="Personal collection" title="The works you are carrying" description="Your saved objects live in this browser and remain here between visits." image="https://commons.wikimedia.org/wiki/Special:Redirect/file/Dragonfly%20Lamp%2C%20Tiffany%20Studios%2C%20Dayton%20Art%20Institute.jpg?width=1280" imageAlt="A leaded-glass lamp glowing in a dark room" />
      <section className="section favorites-page">
        <div className="section-inner">
          <SectionHeading eyebrow="My collection" title={favoriteWorks.length ? `${favoriteWorks.length} saved ${favoriteWorks.length === 1 ? 'object' : 'objects'}` : 'A collection begins with one look'} description={favoriteWorks.length ? 'Return to any object record to remove it, or keep wandering and add another.' : 'Save an artwork from its detail page and it will appear here as a personal path through the museum.'} />
          {favoriteWorks.length > 0 ? <div className="artwork-grid">{favoriteWorks.map((work, index) => <ArtworkCard key={work.id} artwork={work} variant={index === 0 ? 'feature' : 'standard'} />)}</div> : <EmptyState title="Your collection is empty" description="There are no saved objects yet. Find an artwork you want to return to and choose Save to my collection." action={<Link className="button button-dark" to="/collections">Start exploring</Link>} />}
        </div>
      </section>
    </>
  );
}
