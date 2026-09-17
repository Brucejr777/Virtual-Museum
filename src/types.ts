export type Artist = {
  id: string;
  name: string;
  birth: string;
  death: string;
  nationality: string;
  movement: string;
  bio: string;
  portrait: string;
  notableWorkIds: string[];
};

export type Artwork = {
  id: string;
  title: string;
  artistId: string;
  date: string;
  year: number;
  period: string;
  category: string;
  medium: string;
  dimensions: string;
  location: string;
  description: string;
  context: string;
  provenance: string;
  image: string;
  collectionIds: string[];
  featured: boolean;
  tags: string[];
};

export type Exhibition = {
  id: string;
  slug: string;
  title: string;
  dek: string;
  description: string;
  period: string;
  category: string;
  curator: string;
  coverImage: string;
  featured: boolean;
  workIds: string[];
  timeline: { year: string; label: string; text: string }[];
  relatedArtistIds: string[];
  relatedExhibitionIds: string[];
};

export type Collection = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  category: string;
  workIds: string[];
};

export type TimelineEvent = {
  id: string;
  year: string;
  period: string;
  kind: 'movement' | 'event' | 'artist' | 'work';
  title: string;
  description: string;
  artworkId?: string;
  artistId?: string;
};

export type TourStep = {
  artworkId: string;
  title: string;
  note: string;
  prompt: string;
};

export type Tour = {
  id: string;
  slug: string;
  title: string;
  dek: string;
  description: string;
  duration: string;
  pace: string;
  coverImage: string;
  steps: TourStep[];
};

export type MuseumData = {
  artists: Artist[];
  artworks: Artwork[];
  exhibitions: Exhibition[];
  collections: Collection[];
  timeline: TimelineEvent[];
};