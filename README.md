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
