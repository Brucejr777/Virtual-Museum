import { useMemo, useState } from 'react';
import { ExhibitionCard } from '../components/ExhibitionCard';
import { EmptyState, PageHero, SectionHeading } from '../components/UI';
import { exhibitions } from '../data/museumData';

export function ExhibitionsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [period, setPeriod] = useState('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(exhibitions.map((exhibition) => exhibition.category)))],
    [],
  );
  const periods = useMemo(
    () => ['All', ...Array.from(new Set(exhibitions.map((exhibition) => exhibition.period)))],
    [],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return exhibitions.filter((exhibition) => {
      const matchesQuery =
        !normalized ||
        `${exhibition.title} ${exhibition.dek} ${exhibition.description} ${exhibition.curator}`
          .toLowerCase()
          .includes(normalized);
      const matchesCategory = category === 'All' || exhibition.category === category;
      const matchesPeriod = period === 'All' || exhibition.period === period;
      return matchesQuery && matchesCategory && matchesPeriod;
    });
  }, [query, category, period]);

  const featuredExhibition = filtered.find((exhibition) => exhibition.featured);
  const remainingExhibitions = featuredExhibition
    ? filtered.filter((exhibition) => exhibition.id !== featuredExhibition.id)
    : filtered;

  const hasActiveFilters = query !== '' || category !== 'All' || period !== 'All';

  const resetFilters = () => {
    setQuery('');
    setCategory('All');
    setPeriod('All');
  };

  return (
    <>
      <PageHero
        eyebrow="Exhibition program"
        title="Galleries built around a question"
        description="Each exhibition is a sequence of encounters—begin anywhere, follow what catches your eye, and let one object lead you to the next."
        image="https://commons.wikimedia.org/wiki/Special:Redirect/file/Van%20Gogh%20-%20Starry%20Night%20-%20Google%20Art%20Project.jpg?width=1280"
        imageAlt="A painted night sky above a quiet village"
      />

      <section className="section">
        <div className="section-inner">
          <div className="section-heading-row">
            <SectionHeading
              eyebrow="Now showing"
              title="Exhibitions with room to wander"
              description="Filter the program by subject or period, or search for a curator, a theme, or an idea."
            />
            <span className="result-count">
              {filtered.length} {filtered.length === 1 ? 'exhibition' : 'exhibitions'}
            </span>
          </div>

          <div className="filter-bar">
            <label className="filter-search">
              <span className="sr-only">Search exhibitions</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search exhibitions, curators, or themes"
                type="search"
              />
            </label>
            <label>
              <span>Subject</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Period</span>
              <select value={period} onChange={(event) => setPeriod(event.target.value)}>
                {periods.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            {hasActiveFilters && (
              <button className="filter-clear" type="button" onClick={resetFilters}>
                Clear filters
              </button>
            )}
          </div>

          {filtered.length > 0 ? (
            <>
              {featuredExhibition && (
                <div className="exhibition-grid exhibition-grid-featured">
                  <ExhibitionCard exhibition={featuredExhibition} featured />
                </div>
              )}
              {remainingExhibitions.length > 0 && (
                <div className="exhibition-grid exhibition-grid-results">
                  {remainingExhibitions.map((exhibition) => (
                    <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No exhibitions found"
              description="Try a different search or broaden the subject and period filters to continue through the program."
              action={
                <button className="button button-dark" type="button" onClick={resetFilters}>
                  Reset the program
                </button>
              }
            />
          )}
        </div>
      </section>

      <section className="section section-tinted">
        <div className="section-inner collection-note-grid">
          <div>
            <p className="eyebrow">A living program</p>
            <h2>Every gallery is a working draft.</h2>
          </div>
          <p>
            Exhibitions in the Meridian Archive are designed to be replaced, reinterpreted, and
            re-curated. The data model, object records, and editorial voice are all kept separate so a
            real institution can swap in new stories without rebuilding the visitor experience.
          </p>
        </div>
      </section>
    </>
  );
}