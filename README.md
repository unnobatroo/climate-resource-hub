# 🌱 climate resource hub

A multi-page, accessible climate resource directory.

## Features

- Topic-based pages: "career", "research", "education", and "invest".
- Dedicated top lane for general links.
- Search with internal keyword tags.
- URL cards with favicon, summary, tags, host, and date information.
- Accessibility-friendly structure (landmarks, labels, focus states, skip links)

## Project Structure

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

## Run Locally

This is a static site. You can open `index.html` directly in a browser.

For best behavior with external assets and a local URL, run a simple local server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Data Format

Each link item in `assets/data.js` includes:

- `title`
- `url`
- `topic`
- `subtopic`
- `date`

Example:

```js
{
  title: "Climatebase",
  url: "https://climatebase.org/",
  topic: "Career",
  subtopic: "General",
  date: "2024-01-03"
}
```

## Deployment

Deploy as static files on any static host:

- GitHub Pages
- Netlify
- Vercel (static)
- Cloudflare Pages

No build step required.

### GitHub Pages Setup (Prepared)

This repository is already prepared for GitHub Pages:

- `CNAME` is set to `youngo-science.org`
- `.nojekyll` is included for plain static serving
- `.github/workflows/deploy-pages.yml` deploys automatically on push to `main`

To publish:

1. Push the repository to GitHub.
2. In GitHub repository settings, open **Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` (or run the workflow manually).

### Name.com DNS Setup for `youngo-science.org`

At Name.com DNS records, configure:

1. `A` record for host `@` to `185.199.108.153`
2. `A` record for host `@` to `185.199.109.153`
3. `A` record for host `@` to `185.199.110.153`
4. `A` record for host `@` to `185.199.111.153`
5. `CNAME` record for host `www` to `<your-github-username>.github.io`

After DNS propagation, in GitHub Pages settings ensure:

- Custom domain is `youngo-science.org`
- **Enforce HTTPS** is enabled

## Notes

- Set link dates manually in `assets/data.js` for full control.
