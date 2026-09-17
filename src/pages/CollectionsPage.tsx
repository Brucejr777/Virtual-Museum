import { useMemo, useState } from 'react';
import { ArtworkCard } from '../components/ArtworkCard';
import { EmptyState, PageHero, SectionHeading } from '../components/UI';
import { artworks, collections } from '../data/museumData';

export function CollectionsPage() {
  const [activeCollection, setActiveCollection] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const visibleWorks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return artworks.filter((work) => {
      const matchesCollection = activeCollection === 'all' || work.collectionIds.includes(activeCollection);
      const matchesCategory = category === 'All' || work.category === category;
      const matchesQuery = !normalized || `${work.title} ${work.medium} ${work.location} ${work.tags.join(' ')}`.toLowerCase().includes(normalized);
      return matchesCollection && matchesCategory && matchesQuery;
    });
  }, [activeCollection, category, query]);

  const categories = ['All', ...Array.from(new Set(artworks.map((work) => work.category)))];

  return (
    <>
      <PageHero eyebrow="The archive" title="Collections for every kind of looking" description="Browse by material, era, or medium. Every object record is designed to be a doorway into a larger story." image="https://commons.wikimedia.org/wiki/Special:Redirect/file/KellsFol032vChristEnthroned.jpg?width=1280" imageAlt="An illuminated manuscript page with interlaced forms" />
      <section className="section">
        <div className="section-inner">
          <SectionHeading eyebrow="Browse the archive" title="Start with a collection" description="Choose a collection below, then refine the works on view with search and category filters." />
          <div className="collection-grid collection-grid-four">
            {collections.map((collection) => (
              <button className={`collection-tile${activeCollection === collection.id ? ' is-active' : ''}`} key={collection.id} type="button" onClick={() => setActiveCollection((current) => current === collection.id ? 'all' : collection.id)}>
                <img src={collection.image} alt="" loading="lazy" />
                <span className="collection-tile-overlay"><strong>{collection.name}</strong><small>{collection.workIds.length} works</small></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tinted collection-browser" id={activeCollection === 'all' ? undefined : activeCollection}>
        <div className="section-inner">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">{activeCollection === 'all' ? 'All collections' : collections.find((collection) => collection.id === activeCollection)?.name}</p>
              <h2>{visibleWorks.length} {visibleWorks.length === 1 ? 'object' : 'objects'} on view</h2>
            </div>
            <span className="result-count">Archive view</span>
          </div>
          <div className="filter-bar collection-filter-bar">
            <label className="filter-search">
              <span className="sr-only">Search works</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search works, materials, or locations" type="search" />
            </label>
            <label>
              <span>Category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select>
            </label>
            {activeCollection !== 'all' && <button className="filter-clear" type="button" onClick={() => setActiveCollection('all')}>Show all collections</button>}
          </div>
          {visibleWorks.length > 0 ? (
            <div className="artwork-grid">{visibleWorks.map((work, index) => <ArtworkCard key={work.id} artwork={work} variant={index === 0 ? 'feature' : 'standard'} />)}</div>
          ) : <EmptyState title="No objects found" description="Try a different search or choose another collection to continue your visit." action={<button className="button button-dark" type="button" onClick={() => { setQuery(''); setCategory('All'); setActiveCollection('all'); }}>Reset the archive</button>} />}
        </div>
      </section>

      <section className="section collection-note">
        <div className="section-inner collection-note-grid">
          <div><p className="eyebrow">A living archive</p><h2>Built to be replaced, ready to be explored.</h2></div>
          <p>The collection data lives in one structured source, so a real institution can swap in its own records, image rights, and collection-management links without rebuilding the visitor experience.</p>
        </div>
      </section>
    </>
  );
}
