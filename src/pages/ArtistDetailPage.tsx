import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArtworkCard } from '../components/ArtworkCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { EmptyState, SectionHeading } from '../components/UI';
import { artists, artworks } from '../data/museumData';

export function ArtistDetailPage() {
  const { artistId = '' } = useParams();
  const artist = artists.find((item) => item.id === artistId);
  const works = useMemo(() => artist ? artworks.filter((work) => work.artistId === artist.id) : [], [artist]);

  if (!artist) {
    return <EmptyState title="Creator not found" description="This profile may be between installations. Return to the directory to keep exploring." action={<Link className="button button-dark" to="/artists">View artists</Link>} />;
  }

  return (
    <>
      <Breadcrumbs items={[{ label: 'Artists', to: '/artists' }, { label: artist.name }]} />
      <section className="artist-detail-hero">
        <div className="artist-detail-hero-image"><img src={artist.portrait} alt={`Portrait of ${artist.name}`} /></div>
        <div className="artist-detail-hero-copy">
          <p className="eyebrow">{artist.movement}</p>
          <h1>{artist.name}</h1>
          <p className="artist-detail-lifespan">{artist.birth}–{artist.death} · {artist.nationality}</p>
          <p>{artist.bio}</p>
          <div className="artist-detail-facts"><span><small>Nationality</small>{artist.nationality}</span><span><small>Movement</small>{artist.movement}</span><span><small>Works here</small>{works.length}</span></div>
        </div>
      </section>
      <section className="section section-tinted">
        <div className="section-inner">
          <SectionHeading eyebrow="Selected works" title="A closer look" description="These works are connected to the creator's profile and can be explored as individual object records." />
          {works.length > 0 ? <div className="artwork-grid">{works.map((work, index) => <ArtworkCard key={work.id} artwork={work} variant={index === 0 ? 'feature' : 'standard'} />)}</div> : <EmptyState title="No works on view" description="This creator profile is ready for new collection records." />}
        </div>
      </section>
      <section className="section">
        <div className="section-inner artist-bio-panel">
          <div><p className="eyebrow">Biography</p><h2>Looking as a form of practice</h2></div>
          <div><p>{artist.bio}</p><p>The Meridian Archive uses creator biographies as interpretive starting points rather than final answers. Each profile leaves room for new research, alternative voices, and the object itself.</p></div>
        </div>
      </section>
    </>
  );
}
