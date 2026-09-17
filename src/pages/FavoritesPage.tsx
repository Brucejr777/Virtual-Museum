import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArtworkCard } from '../components/ArtworkCard';
import { EmptyState, PageHero, SectionHeading } from '../components/UI';
import { useFavorites } from '../context/FavoritesContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { artworks, getArtwork } from '../data/museumData';
import type { Artwork } from '../types';

export function FavoritesPage() {
  const { favorites, getNote, setNote } = useFavorites();
  const { recentIds, clearHistory } = useRecentlyViewed();

  const favoriteWorks = artworks.filter((work) => favorites.includes(work.id));
  const recentWorks: Artwork[] = recentIds
    .map((id) => getArtwork(id))
    .filter((work): work is Artwork => Boolean(work))
    .slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow="Personal collection"
        title="The works you are carrying"
        description="Your saved objects live in this browser and remain here between visits."
        image="https://commons.wikimedia.org/wiki/Special:Redirect/file/Dragonfly%20Lamp%2C%20Tiffany%20Studios%2C%20Dayton%20Art%20Institute.jpg?width=1280"
        imageAlt="A leaded-glass lamp glowing in a dark room"
      />

      <section className="section favorites-page">
        <div className="section-inner">
          <SectionHeading
            eyebrow="My collection"
            title={
              favoriteWorks.length
                ? `${favoriteWorks.length} saved ${favoriteWorks.length === 1 ? 'object' : 'objects'}`
                : 'A collection begins with one look'
            }
            description={
              favoriteWorks.length
                ? 'Add a private note to any saved work to remember why it matters, or remove it to keep your collection focused.'
                : 'Save an artwork from its detail page and it will appear here as a personal path through the museum.'
            }
          />
          {favoriteWorks.length > 0 ? (
            <div className="favorites-list">
              {favoriteWorks.map((work, index) => (
                <div className="favorite-entry" key={work.id}>
                  <ArtworkCard
                    artwork={work}
                    variant={index === 0 ? 'feature' : 'standard'}
                  />
                  <FavoriteNoteEditor
                    artworkId={work.id}
                    note={getNote(work.id)}
                    onSave={(value) => setNote(work.id, value)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Your collection is empty"
              description="There are no saved objects yet. Find an artwork you want to return to and choose Save to my collection."
              action={<Link className="button button-dark" to="/collections">Start exploring</Link>}
            />
          )}
        </div>
      </section>

      {recentWorks.length > 0 && (
        <section className="section section-tinted recently-viewed-section">
          <div className="section-inner">
            <div className="section-heading-row">
              <SectionHeading
                eyebrow="Your path"
                title="Recently viewed"
                description="A quiet record of where you have been. Clear it whenever you like."
              />
              <button className="filter-clear" type="button" onClick={clearHistory}>
                Clear history
              </button>
            </div>
            <div className="artwork-grid artwork-grid-three">
              {recentWorks.map((work) => (
                <ArtworkCard key={work.id} artwork={work} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function FavoriteNoteEditor({
  artworkId,
  note,
  onSave,
}: {
  artworkId: string;
  note: string;
  onSave: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note);

  const startEditing = () => {
    setDraft(note);
    setEditing(true);
  };

  const save = () => {
    onSave(draft);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(note);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="favorite-note-editor">
        <label className="sr-only" htmlFor={`note-${artworkId}`}>
          Personal note for this artwork
        </label>
        <textarea
          id={`note-${artworkId}`}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          placeholder="A memory, a question, a reason to return…"
        />
        <div className="favorite-note-actions">
          <button type="button" className="button button-dark" onClick={save}>
            Save note
          </button>
          <button type="button" className="filter-clear" onClick={cancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button type="button" className="favorite-note-toggle" onClick={startEditing}>
      <span className="eyebrow">{note ? 'Your note' : 'Add a note'}</span>
      <span className="favorite-note-preview">
        {note || 'Capture a thought about this work…'}
      </span>
    </button>
  );
}