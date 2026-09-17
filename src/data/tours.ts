import type { Tour } from '../types';
import { artworks } from './museumData';

const imageFor = (id: string) =>
  artworks.find((work) => work.id === id)?.image ?? '';

export const tours: Tour[] = [
  {
    id: 'night-in-four-movements',
    slug: 'night-in-four-movements',
    title: 'Night, in Four Movements',
    dek: 'A slow walk through the many moods of darkness — from charged skies to quiet rooms.',
    description:
      'Night is never a single color. This tour moves between four works that each treat darkness differently: as weather, as memory, as a stage, and as a threshold. Move at your own pace. Each stop includes one small looking prompt — a question to carry into the next object.',
    duration: '20–25 minutes',
    pace: 'Gentle',
    coverImage: imageFor('starry-night'),
    steps: [
      {
        artworkId: 'starry-night',
        title: 'A sky that refuses to stay still',
        note:
          'Begin with the loudest night in the archive. Van Gogh’s sky is not a backdrop — it is the subject. Notice how the cypress and the steeple compete for the same vertical line.',
        prompt: 'Where does your eye rest first, and where does it resist staying?',
      },
      {
        artworkId: 'fine-wind',
        title: 'Stillness as drama',
        note:
          'Hokusai’s red Fuji is calm, but it is not passive. Compare this stillness to the painted turbulence of the previous stop. The same subject — sky, weather, mountain — produces opposite temperatures.',
        prompt: 'What makes a quiet image feel as charged as a loud one?',
      },
      {
        artworkId: 'water-lilies',
        title: 'The night inside a garden',
        note:
          'Monet’s water lilies are not literally nocturnal, but they behave like night: reflections dissolve edges, and the surface becomes a soft, dark mirror. This is the tour’s turn inward.',
        prompt: 'Where does the water end and the sky begin?',
      },
      {
        artworkId: 'migrant-mother',
        title: 'A quieter darkness',
        note:
          'Lange’s photograph ends the tour in a different register — not sublime night, but human uncertainty. The gray tones here are not atmospheric; they are documentary.',
        prompt: 'How does the absence of color change the way you read a face?',
      },
    ],
  },
  {
    id: 'faces-and-the-gaze',
    slug: 'faces-and-the-gaze',
    title: 'Faces and the Gaze',
    dek: 'Five portraits, four centuries, and the small negotiations of being seen.',
    description:
      'A portrait is never just a face. It is a decision about what to reveal and what to withhold. This tour moves from ancient court image-making to modern documentary photography, asking the same question at each stop: who is looking at whom?',
    duration: '25–30 minutes',
    pace: 'Moderate',
    coverImage: imageFor('girl-pearl'),
    steps: [
      {
        artworkId: 'nefertiti',
        title: 'The composed profile',
        note:
          'The oldest face on this tour is also the most polished. Court portraiture in the New Kingdom was not a record of a person — it was a construction of presence. Notice the calm.',
        prompt: 'What is being asked of you as a viewer here?',
      },
      {
        artworkId: 'mona-lisa',
        title: 'The expression that will not settle',
        note:
          'A seated woman, a distant landscape, an expression that seems to change as your attention moves. Leonardo’s portrait is famous for withholding.',
        prompt: 'Look away, then look back. Does the expression shift?',
      },
      {
        artworkId: 'girl-pearl',
        title: 'The intimate turn',
        note:
          'Vermeer gives us a face caught mid-motion — as if we interrupted something. The pearl is the brightest thing in the painting, and it pulls the whole composition toward it.',
        prompt: 'Where is she looking, and does it matter that we can’t follow her there?',
      },
      {
        artworkId: 'funerary-mask',
        title: 'A face for the journey',
        note:
          'Not every face is meant for a viewer. This golden mask was made to accompany a journey, not to be looked at. It is a portrait as an instrument.',
        prompt: 'What changes when a face is made for a purpose rather than for an audience?',
      },
      {
        artworkId: 'migrant-mother',
        title: 'The camera meets a family',
        note:
          'The final stop is the most direct. Lange’s portrait does not aestheticize. It asks you to hold uncertainty without looking away.',
        prompt: 'What is the difference between being seen and being looked at?',
      },
    ],
  },
  {
    id: 'made-by-hand',
    slug: 'made-by-hand',
    title: 'Made by Hand',
    dek: 'Objects that carry the visible trace of the people who shaped them.',
    description:
      'Every object in this tour has been touched — by a sculptor, a scribe, a glassmaker, a printmaker. This tour follows material and labor across the collection, and asks you to look for the hand.',
    duration: '25–35 minutes',
    pace: 'Slow',
    coverImage: imageFor('book-kells'),
    steps: [
      {
        artworkId: 'book-kells',
        title: 'The patient page',
        note:
          'Begin with a page that took months — perhaps years — to make. Interlace, color, and disciplined mark-making turn a manuscript opening into a small landscape.',
        prompt: 'Where does the maker’s hand slow down?',
      },
      {
        artworkId: 'great-wave',
        title: 'A print, not a painting',
        note:
          'Hokusai’s wave was cut into wood, inked, and printed — potentially hundreds of times. The energy of the image is the product of a strictly repeatable process.',
        prompt: 'Does knowing how it was made change how the wave feels?',
      },
      {
        artworkId: 'thinker',
        title: 'The unfinished surface',
        note:
          'Rodin left the trace of his tools visible on bronze. The figure feels less finished than alive — carrying the memory of its own making.',
        prompt: 'Where can you see the sculptor thinking?',
      },
      {
        artworkId: 'dragonfly-lamp',
        title: 'Light, cut and joined',
        note:
          'Tiffany’s lamp is assembled from hundreds of pieces of glass. The warmth it produces is not just optical — it is structural.',
        prompt: 'Count the distinct pieces of glass you can identify.',
      },
      {
        artworkId: 'maya-vessel',
        title: 'A moving image',
        note:
          'A painted vessel is not a static object. Turned in the hand, it becomes a sequence — ceremony, glyph, figure, ceremony again. The tour ends here, in motion.',
        prompt: 'What would this object look like in your hands?',
      },
    ],
  },
];

export const getTour = (slug: string) => tours.find((tour) => tour.slug === slug);