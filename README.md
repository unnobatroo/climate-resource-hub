
A resource database for the climate movement, built with MkDocs.

## Setup

### Prerequisites
- Python 3.10 or higher (3.12+ recommended)
- pip (latest version recommended)

### Quick Start

1. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate  # On Windows
```

2. Upgrade pip:
```bash
pip install --upgrade pip
```

3. Install dependencies:
```bash
# Option 1: Core dependencies only (recommended for most users)
pip install -r requirements-core.txt

# Option 2: Exact versions (for reproducing exact environment)
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
