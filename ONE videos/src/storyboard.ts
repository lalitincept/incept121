// ─────────────────────────────────────────────────────────────────────────────
//  THE STORYBOARD
//  This is the file that turns a script into a film. Each entry is one shot.
//  Pick a scene type, write the words, set how long it holds and how it arrives.
//  In text, *these words* get the emphasis voice; \n forces a line break.
//
//  What's here now is a demo reel that shows off the system. Replace it with
//  the shots from your script (see script/README.md).
// ─────────────────────────────────────────────────────────────────────────────
import type {Settings, Shot} from './types';

export const settings: Settings = {
  fps: 30,
  title: 'ONE videos',
  chrome: true,
  // music: 'audio/music.mp3',
  // voiceover: 'audio/voiceover.mp3',
};

export const shots: Shot[] = [
  {
    type: 'title',
    seconds: 5,
    kicker: 'ONE videos · Reel 001',
    title: 'Make it\n*move.*',
    sub: 'A motion system built to turn any script into a film.',
  },
  {
    type: 'statement',
    seconds: 4.6,
    transition: 'push',
    kicker: 'The idea',
    text: 'Motion isn’t decoration. It’s *how a story breathes.*',
  },
  {
    type: 'stat',
    seconds: 5.2,
    transition: 'zoom',
    kicker: 'Every frame',
    value: 2073600,
    label: 'pixels in every frame, and *each one* placed on purpose.',
    note: '1920 × 1080 = 2,073,600',
  },
  {
    type: 'list',
    seconds: 5.6,
    transition: 'wipe',
    kicker: 'The process',
    title: 'From script\nto *screen.*',
    items: ['Script', 'Storyboard', 'Motion design', 'Sound & final render'],
  },
  {
    type: 'quote',
    seconds: 5,
    transition: 'push',
    quote: 'Motion is the shortest path between an idea and a *feeling.*',
    author: 'ONE videos',
    role: 'Studio note',
  },
  {
    type: 'end',
    seconds: 5,
    transition: 'iris',
    title: 'ONE *videos*',
    line: 'Your script goes here.',
    cta: 'Drop it in /script',
  },
];
