# Acquired: Home Depot podcast intro reel

A 9:16 motion graphic reel (1080 × 1920, 30 fps, 67 s) built from *Home_Depot_Reel_Editor_Script2.docx*. It's an editorial look in the Home Depot palette (orange `#F96302`, ink, newsprint paper) with captions burned in.

| Deliverable | Path |
| --- | --- |
| Rendered reel (H.264, AAC, −14 LUFS) | `renders/Home_Depot_Reel_1080x1920.mp4` |
| HyperFrames master composition | `index.html` |
| After Effects rebuild (native, editable layers) | `ae/build_home_depot_reel.jsx` + `ae/assets/` |
| Temp score and SFX cue stem | `assets/audio/` (regenerate with `python3 scripts/make_audio.py`) |
| Fonts (SIL OFL, free to use) | `assets/fonts/` |

## Shot map (script timecodes)

| # | Time | What's on screen |
| --- | --- | --- |
| 1 | 0:00–0:04 | Host plate, quick punch-in, "This is a CRAZY STAT" lands at 0:01 |
| 2 | 0:04–0:10 | Split-screen wipe (10 frames): HOME DEPOT 1981 / APPLE 1980 |
| 3 | 0:10–0:21 | Two $1,000 cards and an illustrative race chart. Home Depot crosses at 0:18.2, then a host reaction at 0:19.3 |
| 4 | 0:21–0:31 | Compounding curve, year counter 1981 → 2026, "NEARLY 25% A YEAR / FOR 45 YEARS" |
| 5 | 0:31–0:42 | S&P 500 list scroll, Home Depot rises, host cut-back at 0:35.6, upward move into the #1 seal |
| 6 | 0:42–0:49 | Counter from $1,000 to $17,000,000, music drop at 45.6, bass hit and "$17 MILLION" at 46.0, held 3 s |
| 7 | 0:49–0:58 | Paper theme, slower pacing: founder photo slots, FIRED stamp, "Little savings / No retirement fund" |
| 8 | 0:58–1:04 | Small store zooms out to the warehouse, 5 store footprints fill it, "5× BIGGER" |
| 9 | 1:04–1:07 | End card slides up: FULL EPISODE LIVE, Acquired: Home Depot, platform-neutral CTA, logo slot |

The colour map from the script is applied to the captions and graphics in orange: 1981, APPLE, 25%, NUMBER ONE, $17 MILLION, FIRED and 5×. "25%" and "$17" are the largest elements in the reel.

## Placeholders to replace before delivery

The script assumes footage and assets that weren't supplied, so these are stand-ins:

- **Ben's host footage**: a silhouette "host cam" plate is used at 0:00–0:04, 0:19.3–0:20.3 and 0:35.6–0:36.9.
- **Archival stills**: the line-art storefront and computer (shot 2), the founder photo slots (shot 7) and the newspaper (shot 7, marked *Illustration*).
- **Audio**: the episode VO isn't in the reel. `music_temp.wav` is a synthesized temp score that follows the suspense → drop → emotional → inspirational arc. `sfx.wav` puts every cue from the script's cue sheet at its timecode. Replace both with licensed music and final sound effects.
- **Logo and episode artwork**: the end card has a text "ACQUIRED" logo slot and an orange background where the approved artwork goes.
- **Caption timing**: estimated from the script. Re-time it to the real VO (in AE, slide the caption layers).

The race chart is illustrative. Only the episode's stated claims appear as numbers ($1,000, 1981/1980, ~25%/yr, 45 years, #1, $17 million). The S&P list rows are redacted rather than invented.

## Editing in After Effects

1. Install the fonts in `assets/fonts/`: Anton, DM Serif Display (+ Italic), Archivo Black and IBM Plex Mono.
2. In AE, go to **File → Scripts → Run Script File…** and pick `ae/build_home_depot_reel.jsx`. Keep the folder structure as it is, because the script finds `ae/assets/` and `assets/audio/` relative to itself.
3. Open `HD_Reel_MAIN`. It has:
   - one precomp per shot (`S1_Hook … S9_EndCard`),
   - `HOST_PLATE`, a single comp reused for all three host beats. Drop Ben's clip in once and turn off the `PLACEHOLDER` layers,
   - `CAPTIONS`, with one text layer per line. Orange emphasis is a Fill Color text animator, and the ink box follows the text by expression,
   - comp markers for every shot and every sound cue.
4. All text is live. The year counter (S4) and the dollar counter (S6) are Source Text expressions.

The AE script was written against the standard ExtendScript API and dry-run outside AE, but it hasn't been run inside After Effects yet. If a step errors in your AE version, the alert names the line.

## Editing in HyperFrames

```bash
npx hyperframes preview      # Studio: scrub, retime, edit
npx hyperframes check        # lint + layout + contrast
npx hyperframes render -q high -o renders/master.mp4
```

All caption timings sit in the `CAPTIONS` array at the top of the script in `index.html`. Shot animation times use the script's timecodes.

`scripts/export_ae_assets.mjs` re-exports the vector illustrations to `ae/assets/` if you change them in `index.html`.
