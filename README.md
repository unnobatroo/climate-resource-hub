# Climate resource hub

Hand-curated, accessible directory of climate links — careers, research, education, and funding.

- Plain HTML, one small CSS file, one small JS file.
- Topic pages: [Career](career.html), [Research](research.html), [Education](education.html), [Invest](invest.html), each grouped by category with toggleable category filters (selected categories jump to the top).
- Global search across every section, available from any page.
- Accessible by design: landmarks, skip link, labelled search, live result announcements, visible focus states, no horizontal scrolling.

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
