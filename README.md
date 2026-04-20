# climate resource hub

A multi-page, accessible climate resource directory.

- Topic-based pages: "Career", "Research", "Education", and "Invest".
- Dedicated top lane for general links.
- Search with internal keyword tags.
- URL cards with favicon, summary, tags, host, and date information.
- Accessibility-friendly structure (landmarks, labels, focus states, skip links)

### Project Structure

```text
climate-resource-hub/
├── index.html            # Landing page with topic navigation
├── career.html           # Career links page
├── research.html         # Research links page
├── education.html        # Education links page
├── invest.html           # Invest links page
├── CNAME                 # Custom domain for GitHub Pages
├── .nojekyll             # Disables Jekyll processing on GitHub Pages
├── .github/
│   └── workflows/
│       └── deploy-pages.yml   # GitHub Actions deploy workflow
└── assets/
  ├── data.js           # Link dataset
  ├── page.js           # Rendering, search, and sorting logic
  └── style.css         # Shared styling
```

### Data format

Each link item in `assets/data.js` includes:

```js
{
  title: "Climatebase",
  url: "https://climatebase.org/",
  topic: "Career",
  subtopic: "General",
  date: "2024-01-03"
}
```

## GitHub Pages setup

This repository is already prepared for GitHub Pages:

- `CNAME` is set to `youngo-science.org`
- `.nojekyll` is included for plain static serving
- `.github/workflows/deploy-pages.yml` deploys automatically on push to `main`
