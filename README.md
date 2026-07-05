# climate resource hub

A hand-curated, accessible directory of climate links — careers, research, education, and funding.

- **No frameworks, no build step** — plain HTML, one small CSS file, one small JS file. The only external asset is the Space Grotesk display font (Google Fonts).
- Topic pages: [Career](career.html), [Research](research.html), [Education](education.html), [Invest](invest.html), each grouped by category with **toggleable category filters** (selected categories jump to the top).
- Global search across every section, available from any page.
- Quirky design: hand-drawn box-shadow pixel-art mascots, per-section colours and voices, one consistent stroke-icon family.
- Automatic light/dark theme (follows the visitor's system preference).
- Accessible by design: landmarks, skip link, labelled search, live result announcements, visible focus states, no horizontal scrolling.

## Structure

```text
climate-resource-hub/
├── index.html            # Home: section overview + global search
├── career.html           # Career links
├── research.html         # Research links
├── education.html        # Education links
├── invest.html           # Invest links
├── CNAME                 # Custom domain for GitHub Pages
├── .nojekyll             # Disables Jekyll processing on GitHub Pages
├── .github/
│   └── workflows/
│       └── deploy-pages.yml   # GitHub Actions deploy workflow
└── assets/
    ├── data.js           # Link dataset (the only file to edit to add a link)
    ├── page.js           # Rendering and search
    └── style.css         # Styling (light + dark)
```

## Adding a link

Add an entry to `assets/data.js`:

```js
{
  title: "Climatebase",
  url: "https://climatebase.org/",
  topic: "Career",            // Career | Research | Education | Invest
  subtopic: "General",        // category shown as a group heading
  date: "2024-01-03",
  summary: "One-sentence description shown on the card."
}
```

## Pages setup

This repository is already prepared for GitHub Pages:

- `CNAME` is set to `youngo-science.org`
- `.nojekyll` is included for plain static serving
- `.github/workflows/deploy-pages.yml` deploys automatically on push to `main`
