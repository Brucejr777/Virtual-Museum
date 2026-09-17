import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, PageHero, SectionHeading } from '../components/UI';
import { timeline } from '../data/museumData';

const kinds = ['All', 'movement', 'event', 'artist', 'work'];

export function TimelinePage() {
  const [activeKind, setActiveKind] = useState('All');
  const [selectedId, setSelectedId] = useState(timeline[0]?.id ?? '');
  const events = useMemo(() => timeline.filter((event) => activeKind === 'All' || event.kind === activeKind), [activeKind]);
  const selected = timeline.find((event) => event.id === selectedId) ?? events[0];

  return (
    <>
      <PageHero eyebrow="Historical timeline" title="A museum measured in moments" description="Follow the long conversation between materials, makers, and the worlds they inhabited." image="https://commons.wikimedia.org/wiki/Special:Redirect/file/KellsFol032vChristEnthroned.jpg?width=1280" imageAlt="An illuminated manuscript page" />
      <section className="section timeline-page">
        <div className="section-inner">
          <div className="section-heading-row">
            <SectionHeading eyebrow="Interactive timeline" title="Choose a moment, follow a thread" description="Filter the timeline by artistic movement, event, creator, or object, then select a moment to read its story." />
            <span className="result-count">{events.length} moments</span>
          </div>
          <div className="timeline-toolbar" role="tablist" aria-label="Timeline filters">
            {kinds.map((kind) => <button key={kind} type="button" className={activeKind === kind ? 'is-active' : ''} onClick={() => setActiveKind(kind)} role="tab" aria-selected={activeKind === kind}>{kind === 'All' ? 'All moments' : kind[0].toUpperCase() + kind.slice(1)}</button>)}
          </div>
          <div className="timeline-layout">
            <div className="timeline-track">
              {events.map((event, index) => (
                <button className={`timeline-event${selected?.id === event.id ? ' is-active' : ''}`} key={event.id} type="button" onClick={() => setSelectedId(event.id)}>
                  <span className="timeline-event-year">{event.year}</span>
                  <span className="timeline-event-dot" aria-hidden="true" />
                  <span className="timeline-event-copy"><small>{event.kind}</small><strong>{event.title}</strong></span>
                  <span className="timeline-event-index">{String(index + 1).padStart(2, '0')}</span>
                </button>
              ))}
            </div>
            <article className="timeline-detail">
              {selected ? (
                <>
                  <p className="eyebrow">{selected.period} · {selected.kind}</p>
                  <h2>{selected.title}</h2>
                  <p>{selected.description}</p>
                  {selected.artworkId && <Link className="button button-outline-dark" to={`/works/${selected.artworkId}`}>View related object <span aria-hidden="true">→</span></Link>}
                </>
              ) : <EmptyState title="Choose a moment" description="Select a point on the timeline to open its story." />}
            </article>
          </div>
          {events.length === 0 && <EmptyState title="No moments found" description="Try another timeline filter to continue through history." />}
        </div>
      </section>
    </>
  );
}
