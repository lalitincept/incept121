# Incept RPO hero visual

Interactive visual for the left side of the "Recruitment Process Outsourcing for Government
Contractors" hero. It replaces the stock photo.

## What it shows

The recruiting pipeline drawn as a radar.

- Three sectors, one per role type: cleared (Secret, TS, TS/SCI), clearable (U.S. citizens ready
  for sponsorship) and non-cleared (commercial IT).
- Rings are hiring stages, from the outside in: sourced, screened, interview, offer. The centre
  counts hires.
- The sweep finds new candidates as it passes. Candidates move inward, some drop out, and about
  every 5 seconds one is hired.
- The header names the role being sourced or just filled. The footer shows dedicated recruiters,
  one monthly fee, and placement fees that stay at $0 however many hires go through.

Interaction:

- Hover a dot: a card with the role, clearance, stage and location, plus its path to the centre.
- Click a dot: move it to the next stage. At offer, a click hires it.
- Click a sector or its label: focus that role type. Click again to clear it.
- With reduced motion turned on, nothing plays by itself; hover and click still work.

Candidates are made up in the browser and are illustrative only. Don't present the hire counter
as real figures.

## What it is built on

- Plain HTML, CSS and JavaScript, drawn on a 2D canvas. No libraries, no build step, no network
  requests.
- Funnel Sans and Geist Mono, the site's own fonts. The preview page loads them from Google Fonts.

## Files

    index.html    preview page: the hero recreated with the visual in place

The visual itself is the three blocks in `index.html` marked "RPO visual": the
`<style id="rpo-visual-css">` block, the `<div class="rpo-visual">` markup, and the
`<script id="rpo-visual-js">` block. Everything else in the file is only there for the preview.

## Running it locally

Open `index.html` in a browser, or serve the folder:

    python3 -m http.server

## Putting it on the Webflow page

1. Delete the hero image and add a Code Embed element in its place.
2. Paste the three blocks into it in this order: styles, markup, script.
3. The visual fills the width of its parent and stays square. Give the embed the width the image
   had (553px in the current layout); it works from about 300px up.

The three blocks come to about 33,000 characters. If Webflow rejects the embed for length, put
the script block in the page's custom code ("Before `</body>` tag") and keep the styles and markup
in the embed.

Colours and fonts come from the site's Webflow variables (`--_colors---brand--brand-1`,
`--_colors---brand--brand-2`, `--_colors---ui--light-1`, `--_typography---typefaces--body`,
`--_typography---typefaces--badges`). If they are missing, the same values are used as fallbacks.

## Editing

- Wording: the header, sector labels and footer are plain HTML in the markup block.
- Sector colours: `--rpo-t0` (cleared), `--rpo-t1` (clearable), `--rpo-t2` (non-cleared) at the top
  of the styles.
- Roles, locations and clearance levels: `ROLES`, `PLACES` and `LEVELS` at the top of the script.
- Pace: `OMEGA` sets the sweep speed. `DWELL` and `ADVANCE` set how long candidates stay at each
  stage and how many move on, which together set how often a hire happens.
