# The Thirteen Temperaments

An interactive Temperament Atlas: a self-scored profile across thirteen dimensions of
reactivity and regulation, with narrative results. Static single-page app (React via CDN).

## Structure
- `index.html` — app shell and template
- `support.js` — runtime (loads React/ReactDOM/Babel from unpkg)
- `atlas-data.js` — dimension data and content
- `atlas-questions.js` — assessment questions
- `image-slot.js` — image component

## Run locally
Serve the folder with any static server, e.g. `python3 -m http.server`, then open the URL.

## Deploy
Deployed as a static site to Cloudflare Pages (`13temperaments.pages.dev`).

## Connection Analysis (connect.html)
An AI companion that compares two or more temperament profiles and reports points of
connection, the gifts each person flows to, points of contention, and an ease-of-flow
meter, plus a follow-up chat. Profiles come from saved localStorage profiles, manual
entry, or uploaded results PDFs.

- `connect.html` — the analysis UI (vanilla JS, same-origin, reads `atlas.profiles`)
- `functions/api/analyze.js` — Cloudflare Pages Function proxying Google Gemini
  (model `gemini-3.5-flash`). The API key is stored server-side as the Pages secret
  `GEMINI_API_KEY` and is never exposed to the browser.
