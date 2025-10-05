# CV Generator

A simple CV generation tool that creates both PDF and HTML versions from a template and JSON data file.

## Overview

This application uses:

- **cv-merge.html**: The CV template with Vue.js for dynamic content rendering
- **job.json**: Your CV data (experience, education, skills, etc.)
- **generate-pdf.js**: Generates a PDF version using Puppeteer
- **generate-html.js**: Generates a standalone HTML file for GitHub Pages

## Prerequisites

- Node.js installed
- npm installed
- `http-server` package installed globally (for PDF generation)

## Installation

1. Install dependencies:

```bash
npm install
```

2. Install http-server globally (required for PDF generation):

```bash
npm install -g http-server
```

## Usage

### Generate PDF Only

Creates a `cv.pdf` file in the root directory:

```bash
npm run generate:pdf
```

### Generate HTML Only

Creates an `index.html` file in the root directory (suitable for GitHub Pages):

```bash
npm run generate:html
```

### Generate Both PDF and HTML

```bash
npm run generate:all
```

## How It Works

### PDF Generation

1. Starts a local HTTP server on port 8080
2. Launches a headless browser using Puppeteer
3. Loads the cv-merge.html template
4. Renders the page with data from job.json
5. Generates a PDF with A3 format
6. Stops the server and closes the browser

### HTML Generation

1. Reads the cv-merge.html template
2. Reads the job.json data
3. Embeds the JSON data directly into the HTML (replaces fetch call)
4. Fixes image paths for root-level deployment
5. Outputs a standalone index.html file

## Deploying to GitHub Pages

After generating the HTML:

1. Commit the generated `index.html`:

```bash
git add index.html
git commit -m "Update CV"
```

2. Push to your repository:

```bash
git push origin main
```

3. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Save

Your CV will be available at: `https://[username].github.io/[repository-name]/`

## File Structure

```
mycv/
├── generate-pdf.js       # PDF generator script
├── generate-html.js      # HTML generator script
├── job.json              # Your CV data
├── package.json          # Project configuration
├── html/
│   └── cv-merge.html     # CV template
├── images/               # Your images (profile, logos, etc.)
└── style/                # CSS styles
```

## Updating Your CV

1. Edit `job.json` with your updated information
2. Run the generation commands to create new PDF/HTML versions
3. Commit and push changes to update your GitHub Pages site

## Notes

- The PDF uses A3 format by default (configurable in generate-pdf.js)
- The HTML version is completely standalone and doesn't require a server
- Images are referenced relatively, ensure all images are in the `/images` folder
