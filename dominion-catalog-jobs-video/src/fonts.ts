import { continueRender, delayRender, staticFile } from "remotion";

// Inter (SIL Open Font License) — variable woff2 bundled locally so renders
// never depend on network font fetching.
const handle = delayRender("Loading Inter");
const face = new FontFace("Inter", `url(${staticFile("fonts/Inter-latin-var.woff2")}) format("woff2")`, {
  weight: "100 900",
  style: "normal",
});
face
  .load()
  .then(() => {
    (document.fonts as unknown as { add: (f: FontFace) => void }).add(face);
    continueRender(handle);
  })
  .catch((err) => {
    console.error("Font failed to load", err);
    continueRender(handle);
  });
