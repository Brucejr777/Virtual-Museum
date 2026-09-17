import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArtworkCard } from '../components/ArtworkCard';
import { ExhibitionCard } from '../components/ExhibitionCard';
import { ArtistCard } from '../components/ArtistCard';
import { CollectionCard } from '../components/CollectionCard';
import { EmptyState, PageHero, SectionHeading } from '../components/UI';
import { artists, artworks, collections, exhibitions, timeline } from '../data/museumData';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') ?? '').trim();
  const normalized = query.toLowerCase();

  const results = useMemo(() => {
    if (!normalized) return null;
    const artworkResults = artworks.filter((item) => `${item.title} ${item.medium} ${item.location} ${item.tags.join(' ')} ${item.description}`.toLowerCase().includes(normalized));
    const artistResults = artists.filter((item) => `${item.name} ${item.bio} ${item.nationality} ${item.movement}`.toLowerCase().includes(normalized));
    const exhibitionResults = exhibitions.filter((item) => `${item.title} ${item.dek} ${item.description} ${item.curator}`.toLowerCase().includes(normalized));
    const collectionResults = collections.filter((item) => `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(normalized));
    const eventResults = timeline.filter((item) => `${item.title} ${item.description} ${item.period}`.toLowerCase().includes(normalized));
    return { artworkResults, artistResults, exhibitionResults, collectionResults, eventResults };
  }, [normalized]);

  const total = results ? Object.values(results).reduce((sum, items) => sum + items.length, 0) : 0;

  return (
    <>
      <PageHero eyebrow="Global search" title="Search the whole archive" description="Find artworks, artifacts, artists, exhibitions, collections, and historical moments in one place." image="https://commons.wikimedia.org/wiki/Special:Redirect/file/KellsFol032vChristEnthroned.jpg?width=1280" imageAlt="A detailed manuscript page" />
      <section className="section search-page">
        <div className="section-inner">
          <SectionHeading eyebrow="Search results" title={query ? `Results for “${query}”` : 'Begin with a word'} description={query ? `${total} ${total === 1 ? 'result' : 'results'} across the archive` : 'Type a name, material, place, movement, or idea into the search field above.'} />
          {query && results && total > 0 ? (
            <div className="search-results">
              {results.artworkResults.length > 0 && <SearchGroup title="Works" count={results.artworkResults.length}><div className="artwork-grid">{results.artworkResults.map((item) => <ArtworkCard key={item.id} artwork={item} variant="compact" />)}</div></SearchGroup>}
              {results.artistResults.length > 0 && <SearchGroup title="Artists" count={results.artistResults.length}><div className="artist-grid">{results.artistResults.map((item) => <ArtistCard key={item.id} artist={item} />)}</div></SearchGroup>}
              {results.exhibitionResults.length > 0 && <SearchGroup title="Exhibitions" count={results.exhibitionResults.length}><div className="exhibition-grid">{results.exhibitionResults.map((item) => <ExhibitionCard key={item.id} exhibition={item} />)}</div></SearchGroup>}
              {results.collectionResults.length > 0 && <SearchGroup title="Collections" count={results.collectionResults.length}><div className="collection-grid">{results.collectionResults.map((item) => <CollectionCard key={item.id} collection={item} />)}</div></SearchGroup>}
              {results.eventResults.length > 0 && <SearchGroup title="Historical moments" count={results.eventResults.length}><div className="search-event-list">{results.eventResults.map((item) => <Link key={item.id} to={item.artworkId ? `/works/${item.artworkId}` : '/timeline'}><span>{item.year}</span><strong>{item.title}</strong><small>{item.description}</small></Link>)}</div></SearchGroup>}
            </div>
          ) : query ? <EmptyState title="No results for this search" description="Check the spelling or try a broader term such as “light”, “Egypt”, or “portrait”." action={<Link className="button button-dark" to="/collections">Browse collections instead</Link>} /> : (
            <div className="search-suggestions"><h3>Popular paths through the archive</h3><div>{['light', 'portrait', 'Egypt', 'night', 'garden', 'material'].map((term) => <Link key={term} to={`/search?q=${encodeURIComponent(term)}`}>{term}</Link>)}</div></div>)}
        </div>
      </section>
    </>
  );
}

function SearchGroup({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return <section className="search-result-group"><div className="search-result-group-heading"><h2>{title}</h2><span>{count}</span></div>{children}</section>;
}
