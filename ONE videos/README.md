# ONE videos

Videos made with [Remotion](https://www.remotion.dev): every frame is React code, rendered to MP4.

## Start

Needs [Node.js](https://nodejs.org) 18 or newer.

    npm install
    npm run dev          # Remotion Studio: live preview in the browser

## Render

    npm run render            # 16:9  → out/main.mp4
    npm run render:vertical   # 9:16  → out/vertical.mp4
    npm run render:square     # 1:1   → out/square.mp4

## Where things go

    script/              your scripts (the words, voiceover text, notes)
    public/              images, music, voiceover, fonts (use staticFile('...'))
    src/storyboard.ts    the shot list: one entry per shot. Edit this to make a video.
    src/scenes/          scene templates: title, statement, stat, list, quote, end
    src/components/      motion building blocks: kinetic text, odometer, ring, grain...
    src/transitions/     cut, push, wipe, zoom, iris
    src/design/          colours, fonts, type scale, layout for 16:9 / 9:16 / 1:1
    src/motion/          easing curves, springs, 30 fps timing clock

`src/storyboard.ts` currently holds placeholder shots. Replace them with the shots from the script.

## Conventions

- All animation timings are written in frames at 30 fps (`useTime()` in `src/motion/time.ts`),
  so a video can render at any frame rate without retiming.
- Nothing moves linearly: use the curves in `src/motion/easing.ts`.
- In storyboard text, `*words*` get the emphasis style (italic serif, accent colour) and `\n` breaks a line.
- Sizes are written for 1080p and multiplied by `u` from `useLayout()`.
