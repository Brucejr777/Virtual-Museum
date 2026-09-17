import { useMemo, useState } from 'react';
import { ArtistCard } from '../components/ArtistCard';
import { EmptyState, PageHero, SectionHeading } from '../components/UI';
import { artists } from '../data/museumData';

export function ArtistsPage() {
  const [query, setQuery] = useState('');
  const [movement, setMovement] = useState('All');
  const movements = ['All', ...Array.from(new Set(artists.map((artist) => artist.movement)))];

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return artists.filter((artist) => {
      const matchesQuery = !normalized || `${artist.name} ${artist.bio} ${artist.nationality} ${artist.movement}`.toLowerCase().includes(normalized);
      return matchesQuery && (movement === 'All' || artist.movement === movement);
    });
  }, [query, movement]);

  return (
    <>
      <PageHero eyebrow="Creator directory" title="The hands behind the hours" description="Meet the artists, workshops, and makers whose decisions continue to shape the way we see." image="https://commons.wikimedia.org/wiki/Special:Redirect/file/Vincent%20van%20Gogh%20-%20Self-Portrait%20-%20Google%20Art%20Project.jpg?width=1280" imageAlt="Portrait of Vincent van Gogh" />
      <section className="section">
        <div className="section-inner">
          <div className="section-heading-row">
            <SectionHeading eyebrow="Directory" title="Search the makers" description="Browse by name, movement, nationality, or a detail from a biography." />
            <span className="result-count">{filtered.length} {filtered.length === 1 ? 'creator' : 'creators'}</span>
          </div>
          <div className="filter-bar">
            <label className="filter-search">
              <span className="sr-only">Search artists</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search artists or movements" type="search" />
            </label>
            <label>
              <span>Movement</span>
              <select value={movement} onChange={(event) => setMovement(event.target.value)}>{movements.map((item) => <option key={item}>{item}</option>)}</select>
            </label>
            {(query || movement !== 'All') && <button className="filter-clear" type="button" onClick={() => { setQuery(''); setMovement('All'); }}>Clear filters</button>}
          </div>
          {filtered.length > 0 ? (
            <div className="artist-grid">{filtered.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}</div>
          ) : <EmptyState title="No creators found" description="Try a different name or broaden the movement filter to continue through the directory." action={<button className="button button-dark" type="button" onClick={() => { setQuery(''); setMovement('All'); }}>Reset the directory</button>} />}
        </div>
      </section>
    </>
  );
}
