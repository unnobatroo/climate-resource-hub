
A resource database for the climate movement, built with MkDocs.

## Setup

Install Python dependencies:
```bash
pip install -r requirements.txt
```

### Development

Run the local development server:
```bash
mkdocs serve
```

Visit http://localhost:8000

### Build

Build the static site:
```bash
mkdocs build
```

Output is generated in the `site/` directory.

### Deploy

Deploy to GitHub Pages:
```bash
mkdocs gh-deploy
```

## Project Structure

```
docs/
├── index.md           # Homepage
├── education.md       # Education resources
├── research.md        # Research resources
├── data.md            # Data and tools
├── careers.md         # Career resources
├── invest.md          # Finance and investment resources
├── javascripts/       # Custom scripts
└── stylesheets/       # Custom styles

mkdocs.yml            # Site configuration
requirements.txt      # Python dependencies
```

## Contributing

1. Fork the repository
2. Add resources to the appropriate markdown file
3. Test locally with `mkdocs serve`
4. Submit a pull request

## License

Open source - contributions welcome
