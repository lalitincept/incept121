# Running & Monitoring Catalog Source Jobs — training video (Remotion, 4K)

Enterprise training module for Data Stewards, built with [Remotion](https://remotion.dev)
at **3840 × 2160, 30 fps, ~2 m 34 s**.

* **Intro & conclusion** — pure motion graphics: kinetic typography synced word-by-word
  to the voice-over, line-and-fill icons drawn on, glowing icon rings, glass cards.
* **Methods 1–3** — the two MCC screen recordings, cropped to the application area and
  re-timed to the narration (cuts, cross-dissolves, speed ramps and freezes), with gentle
  camera pushes, highlight call-outs, click ripples, lower-third captions and animated
  concept inserts over a dimmed screen.
* Look: `#221F20` canvas with soft `#0072CE` light pools top-left / bottom-right; icons are
  white 10 px outlines over `#0072CE` shapes.

## Project layout

```
src/
  theme.ts              canvas, brand colours, easing, VO-time → frame helper F()
  Main.tsx              scene order + voice-over track
  components/
    Background.tsx      #221F20 + animated blue light pools + grain
    Kinetic.tsx         word-by-word kinetic text, k("word@vo_seconds *highlight | break")
    Icons.tsx           custom lineal-colour icon set with draw-on animation
    ui.tsx              IconCircle, Logo, GradientPill, StatusBadge, Glass, Cursor, CaptionBox
  scenes/
    Intro.tsx           logo sting, title, foundation, scan cadence, run-a-job
    Outro.tsx           healthy job, status comfort, alarming→normal, tagline, end card
  stage/
    timeline.ts         edit decision list: segments, camera, highlights, ripples, captions
    ScreenStage.tsx     time-remapped recording player inside the device frame
    Inserts.tsx         runtime / job-phases / bottleneck inserts, floating chips
scripts/
  prepare-assets.sh     crops + upscales recordings into image sequences
  stills.mjs            renders review stills with a single bundle
```

All timing is authored in **voice-over seconds** (from word-level timestamps), so the
picture stays locked to the narration. `VO_OFFSET` in `theme.ts` shifts the whole edit.

## Client media (not in git)

The recordings, voice-over, script, traced logo and extracted frames are client assets and
are intentionally excluded from version control (see `.gitignore`). To rebuild, place them
in `source-media/`:

| file | content |
| --- | --- |
| `source-media/Monitoring_MCC.mp4` | recording A — run the job, monitor it |
| `source-media/Monitoring_MCC_1.mp4` | recording B — completed job overview, logs |
| `source-media/voiceover.mp3` | narration |

and `public/brand/dominion-logo.json` (vector logo paths). Then:

```bash
npm install
```

```bash
npm run prepare-assets
```

```bash
npm run render
```

Output: `out/Running_Monitoring_Catalog_Source_Jobs_4K.mp4`.
Use `npm run studio` to preview and scrub interactively.

Privacy: connection-property values (account, username, key path) and the user filter chip
in the recordings are softened with a blur; the Teams participant panel, browser chrome and
taskbar are cropped out.
