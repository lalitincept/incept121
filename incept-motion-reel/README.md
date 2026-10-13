# Incept motion reel

A 15-second, 1920×1080, 60 fps motion piece for [inceptds.com](https://www.inceptds.com), with a synced soundtrack.

**Watch:** `incept-motion-reel.mp4` · or open `index.html` in a browser to see it play live.

| Time | Scene |
|---|---|
| 0–1.7s | A sand dot pops, stretches into a line, and bursts into a particle field and grid |
| 1.7–4.4s | Kinetic type: "WE BUILD **TRUST** IN DATA" with outline ghosts on impact |
| 4.4–7.5s | Diagonal band wipe → stat rings count up: 195 certifications, 70+ specialists, 1st CDGC & CDMP deploy in North America |
| 7.5–11s | Rings fly into a hub; the nine Incept agents orbit it, with data packets travelling in |
| 11–12s | The network collapses into the hub, which floods the screen |
| 12–15s | End card: the `incept` wordmark, the i-dot bouncing in, tagline and URL |

Palette, copy and agent names come from inceptds.com. Font: Inter.

## Rebuilding

Everything on screen is a pure function of time (`render(t)` in `index.html`), so the render is frame-exact.

    python3 scripts/audio.py              # writes audio.wav (needs numpy)
    node scripts/render.mjs               # writes incept-motion-reel.mp4 (needs playwright + ffmpeg)

`render.mjs [out.mp4] [fps] --stills 1.2,5.4` saves single PNG frames instead, for checking a moment.
