# Shayan — A portfolio, on repeat.

A complete, buildless portfolio for Shayan, a graphic designer based in Karachi. The signature hero pairs a rose vinyl record emerging from a white archival sleeve, flowing Portfolio calligraphy, and editorial copy on pure white. Fourteen independent projects populate the site, including the Cloudline sneaker campaign, e-commerce image set, and identity/creator kit. Optimised WebP artwork and full-screen case studies accompany the existing downloadable nine-page PDF; that PDF remains an earlier selection.

## Run locally

Run `node scripts/serve.mjs` from this folder, then open `http://127.0.0.1:4173`. Any static server works. Do not open `index.html` directly with `file://`, because browser ES modules require HTTP. No install or build is required. To change the preview port in PowerShell, use `$env:PORT=4174` before starting the server.

## File tree

```text
shayan-portfolio/
  index.html
  README.md
  .gitignore
  .nojekyll
  .openai/hosting.json
  css/styles.css
  js/main.js
  js/hero3d.js
  js/portfolio.js
  js/image-sizes.js
  assets/
    shayan-portfolio.pdf
    images/
      vinyl.svg
      favicon.svg
      social-cover.jpg
    work/
      25 optimised .webp campaign and identity images
      4 editable .svg identity/presentation artworks
      image-sizes.json
  scripts/
    serve.mjs
    prepare-dist.mjs
    prepare-assets.py
    design-assets.mjs
    create-pdf.py
```

The published directory is `dist/`, assembled from the same complete static files. Optional asset-authoring scripts are included for reference; they are not needed to run or deploy the website. `prepare-assets.py` refers to the original image-generation folder on the authoring computer. On a different machine, replace that source path before regenerating assets. The finished WebP files and PDF are already included.

## Your five main settings

1. **Palette:** the variables at the beginning of `css/styles.css` control white, ink, rose, gold and the light/dark section system.
2. **Signature:** the lettering is actual vector pen paths. To change the word, edit `WORD` in `scripts/create-signature.py`, regenerate the SVG and JS asset, then update `SETTINGS.heroWord` and the HTML heading label. The optional generator uses Pillow, NumPy and fontTools. The font and its OFL license are in `assets/fonts/`. No generation is needed to run the finished site.
3. **Vinyl colour:** change `HERO.color` at the beginning of `js/hero3d.js`. Update the rose stops in `assets/images/vinyl.svg` to match the static fallback.
4. **Hero copy:** edit `.hero-story` in `index.html` to update the editorial statement beside the record sleeve.
5. **Project data:** edit the exported `projects` array in `js/portfolio.js`. Images are resolved from `assets/work/` using the filename without `.webp`. Keep `js/image-sizes.js` in sync with replacement image sizes.

## Name, contact and social links

The supplied identity is Shayan, Karachi, `faisalshayan444@gmail.com`. To change it, update the visible HTML, SEO/JSON-LD metadata, and the `SETTINGS` object in `js/main.js`. Contact actions use email directly. No contact form backend is required.

Instagram, Behance and LinkedIn destinations were not supplied, so the site does not invent profiles or render dead links. Add your actual HTTPS profile URLs in `SETTINGS.socials` and the links appear automatically.

The availability month and Karachi clock update automatically through `Intl.DateTimeFormat`. Update the PDF separately when changing your portfolio; the included PDF remains the original eight-project handout; the website includes later additions.

## Replace artwork

Replace files in `assets/work/` or change their names in `projects`. Grid images are lazy-loaded and carry explicit intrinsic dimensions. Opening a case study immediately requests all three detail images. For new images, export WebP at roughly 1200–1600 px wide, then update `js/image-sizes.js`. The case view displays the entire hero image; grid images follow the configured editorial ratio. Choose a matching ratio when text needs to remain fully visible.

All projects are identified as **independent concepts**. The campaign review figures are supplied demonstration values, not claimed business results. No fabricated client relationships, experience figures or testimonials are presented.

## Motion and accessibility

- GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.20 and Three.js 0.169.0 are pinned on jsDelivr. Google Fonts uses `display=swap`.
- The session preloader runs once. The menu, filters, native modal dialog, Escape key, focus return and focus containment support keyboard use.
- The gallery stays in normal page flow, with native sideways scrolling, keyboard focus and previous/next arrows. Mobile also supports swiping.
- Reduced-motion visitors receive the static SVG vinyl, instant reveals, no preloader, no parallax.
- If WebGL or its CDN fails, the static record remains visible. If animation libraries fail, the core content, gallery, filters, menu and email links still work.
- The signature follows 19 curved pen-centre strokes over 5.4 seconds, using local vector letterforms with no web-font swap. WebGL starts after that reveal, caps device pixel ratio at 1.5, renders at 30 fps and pauses off-screen and in background tabs.
- JavaScript-free visitors can use the PDF or email link. This is a static site; external libraries and web fonts require an internet connection.

Performance scores depend on hosting, device, connection and browser; Lighthouse targets are not presented as measured results.

## Deploy

**Cloudflare Pages:** upload `index.html`, `css/`, `js/` and `assets/` as a static site. Alternatively, run `node scripts/prepare-dist.mjs` and deploy `dist/`. There is no framework or build dependency. For Git-connected Pages, set the build command to `node scripts/prepare-dist.mjs` and output directory to `dist`.

**GitHub Pages:** commit the root static files, including `.nojekyll`; choose the repository branch and root folder in Pages settings. All local asset paths are relative, so repository subpaths work. Change absolute Open Graph URLs and the JSON-LD URL in `index.html` to your final domain.

**Sites:** `.openai/hosting.json` retains the private Site identity and selects `dist/` for publication. It contains no credentials. Publishing does not make the site public automatically.

## Included source and artwork

Every working source file is included in full. The site itself uses native HTML, CSS and ES modules. SVG identity artwork is editable in vector tools. Campaign images are raster assets; image text and photography are not separate design layers. The PDF is a compact portfolio handout, not an editable slide deck.







The Print Edition includes three downloadable CMYK concept PDFs with 3 mm bleed, crop marks, and embedded fonts. The reel was omitted at the user's request. The latest curation leads with existing sneaker, identity, presentation, and creator-template work. New Noor Atelier clothing designs are delivered separately and have not been added to the site.
