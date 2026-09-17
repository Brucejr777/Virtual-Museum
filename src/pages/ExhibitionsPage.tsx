import { useMemo, useState } from 'react';
import { ExhibitionCard } from '../components/ExhibitionCard';
import { PageHero, SectionHeading, EmptyState } from '../components/UI';
import { exhibitions } from '../data/museumData';

const categories = ['All', ...Array.from(new Set(exhibitions.map((item) => item.category)))];
const periods = ['All', ...Array.from(new Set(exhibitions.map((item) => item.period)))];

export function ExhibitionsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [period, setPeriod] = useState('All');
  const [sort, setSort] = useState('featured');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return exhibitions
      .filter((exhibition) => {
        const matchesQuery = !normalized || `${exhibition.title} ${exhibition.dek} ${exhibition.curator} ${exhibition.description}`.toLowerCase().includes(normalized);
        const matchesCategory = category === 'All' || exhibition.category === category;
        const matchesPeriod = period === 'All' || exhibition.period === period;
        return matchesQuery && matchesCategory && matchesPeriod;
      })
      .sort((a, b) => {
        if (sort === 'title') return a.title.localeCompare(b.title);
        if (sort === 'newest') return b.period.localeCompare(a.period);
        if (sort === 'works') return b.workIds.length - a.workIds.length;
        return Number(b.featured) - Number(a.featured);
      });
  }, [query, category, period, sort]);

  return (
    <>
      <PageHero eyebrow="Exhibition program" title="Rooms for every kind of curiosity" description="Browse the current and upcoming exhibitions, then choose your own path through the archive." image="https://commons.wikimedia.org/wiki/Special:Redirect/file/Van%20Gogh%20-%20Starry%20Night%20-%20Google%20Art%20Project.jpg?width=1280" imageAlt="A painted night sky above a quiet village" />
      <section className="section">
        <div className="section-inner">
          <div className="section-heading-row">
            <SectionHeading eyebrow="The program" title="Find an exhibition" description="Search by title or curator, filter by period and category, and sort the galleries to suit your mood." />
            <span className="result-count">{filtered.length} {filtered.length === 1 ? 'exhibition' : 'exhibitions'}</span>
          </div>
          <div className="filter-bar" aria-label="Exhibition filters">
            <label className="filter-search">
              <span className="sr-only">Search exhibitions</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search exhibitions or curators" type="search" />
            </label>
            <label>
              <span>Category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span>Period</span>
              <select value={period} onChange={(event) => setPeriod(event.target.value)}>
                {periods.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span>Sort by</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="featured">Featured first</option>
                <option value="title">Title A–Z</option>
                <option value="newest">Period</option>
                <option value="works">Most works</option>
              </select>
            </label>
            {(query || category !== 'All' || period !== 'All') && <button className="filter-clear" type="button" onClick={() => { setQuery(''); setCategory('All'); setPeriod('All'); }}>Clear filters</button>}
          </div>
          {filtered.length > 0 ? (
            <div className="exhibition-grid exhibition-grid-results">
              {filtered.map((exhibition, index) => <ExhibitionCard key={exhibition.id} exhibition={exhibition} featured={index === 0 && query === '' && category === 'All' && period === 'All'} />)}
            </div>
          ) : <EmptyState title="No exhibitions found" description="Try a different search term or broaden your filters to continue exploring." action={<button className="button button-dark" type="button" onClick={() => { setQuery(''); setCategory('All'); setPeriod('All'); }}>Reset the gallery</button>} />}
        </div>
      </section>
    </>
  );
}
