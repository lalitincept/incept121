# Incept motion reel

A 30-second, 1920×1080, 60 fps brand film for [inceptds.com](https://www.inceptds.com), with a synced soundtrack
(soft piano over a string pad, about 80 BPM, no drums).

**Watch:** `incept-motion-reel.mp4` · or serve this folder (`npx serve .`) and open `index.html` to see it play live.

| Time | Scene |
|---|---|
| 0–3.4s | "Every decision runs on data." / "But can you trust it?" over a slowly drawn line |
| 3.4–6.6s | The line opens into a frame: **We Build Trust in Data**, data governance consulting & implementation |
| 6.6–11.3s | "Make data governance work, not just exist." Seven governance areas light up around a hub |
| 11.3–14.7s | Trusted data you can Find · Understand · Access · Use |
| 14.7–17.6s | Featured partner card: Informatica Platinum Delivery Partner, trusted by Fortune 500 enterprises |
| 17.6–20.7s | Partner logos drift by: Informatica, Collibra, Alation, BigID, dbt, Databricks; AWS, Microsoft Azure, Google Cloud |
| 20.7–23.4s | The nine Incept AI agents orbit a hub |
| 23.4–26.6s | 195 Informatica certifications · 70+ specialists · 10+ years |
| 26.6–30s | End card: the `incept` wordmark, tagline, URL, "Book a consultation" |

Palette, copy and agent names come from inceptds.com. Font: Inter.
Partner logos in `assets/partners/` are taken from the inceptds.com Partners page; the Databricks mark is from
[Simple Icons](https://simpleicons.org) (CC0). All third-party marks belong to their owners.

## Rebuilding

Everything on screen is a pure function of time (`render(t)` in `index.html`), so the render is frame-exact.

    python3 scripts/audio.py              # writes audio.wav (needs numpy)
    node scripts/render.mjs               # writes incept-motion-reel.mp4 (needs playwright + ffmpeg)

`render.mjs [out.mp4] [fps] --stills 1.2,5.4` saves single PNG frames instead, for checking a moment.
