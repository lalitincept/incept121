# Incept orbit hero

Homepage hero with a real Earth and live satellite positions.

## What it is built on

- Plain HTML, CSS and JavaScript. No framework and no build step.
- [three.js r128](https://threejs.org) for the 3D globe (WebGL), loaded from cdnjs.
- [satellite.js 5.0.0](https://github.com/shashwatak/satellite-js) to calculate where each satellite is
  right now from its orbital elements (the SGP4 model), loaded from jsDelivr.
- Orbital data from [CelesTrak](https://celestrak.org), about 15,000 objects.
- Poppins from Google Fonts.

## Files

    index.html                     the page (CSS and JS inline)
    assets/earth-*.jpg             Earth day map, city lights, clouds, ocean shine
    data/satellites.txt            orbital data, one object per line
    scripts/update-satellites.mjs  refreshes data/satellites.txt from CelesTrak

## Running it locally

The page loads its data with fetch, so it must be served over http, not opened as a file:

    npx serve .        # or: python3 -m http.server

## Keeping the satellites accurate

Orbital data goes stale after a few days. Run the update script every 4 to 6 hours:

    node scripts/update-satellites.mjs

Any scheduler works: a server cron job, a GitHub Action that commits the file, or a
scheduled serverless function writing to the same path. The script refuses to overwrite the
file if a download looks incomplete. Browsers must never call CelesTrak directly; CelesTrak
blocks IPs that request too often.

## Putting it on the site

- To use it as the hero of an existing page, copy the `<section class="hero">` block, the
  `<style>` block and both `<script>` tags. Adjust the asset and data paths.
- For speed, serve `data/satellites.txt` with gzip or brotli compression (2.1 MB raw,
  about 0.7 MB compressed) and long cache headers on `assets/`.
- Keep the "Orbits from CelesTrak" credit visible.

## Before launch

- The Earth maps come from the three.js example files. For a commercial site, swap in NASA's
  public-domain Blue Marble (day) and Black Marble (city lights) images at 2048x1024. Same
  filenames, no code changes.
- Altitudes are compressed so distant orbits fit on screen; the panel says so.
