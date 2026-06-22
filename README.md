# BSEBC Website

**Live site:** https://bsebc.com

## Updating Content

All text content lives in **`content.js`** — this is the ONLY file most contributors need to touch.

### How to edit text (no coding required):

1. Open `content.js` in any text editor
2. Find the section you want to update (e.g. `schedule`, `about`, `donate`)
3. Each item has a `ru` (Russian) and `en` (English) value — update both
4. Save the file and push to GitHub — Vercel auto-deploys in ~30 seconds

### Example: Updating service times

```js
// In content.js, find the schedule section:
{ time: "10:00 AM", name: { ru: "Утреннее богослужение", en: "Morning Service" } },

// Change the time:
{ time: "10:30 AM", name: { ru: "Утреннее богослужение", en: "Morning Service" } },
```

### Adding photos to the gallery

1. Add your `.jpg` or `.webp` files to the `assets/` folder
2. Open `index.html` and find the `gallery-grid` section
3. Replace a `<div class="gallery-placeholder">` with: `<img src="assets/your-photo.jpg" alt="Description" style="width:100%;height:100%;object-fit:cover;cursor:pointer;" onclick="openGallery()">`

## File Structure

```
bsebc-site/
├── index.html      ← main page structure (HTML)
├── styles.css      ← all design & layout
├── content.js      ← ALL text content (edit this!)
├── CNAME           ← subdomain config for Vercel/GitHub Pages
├── assets/
│   └── church.webp ← hero background photo
└── README.md       ← this file
```

## Deploying

This site is connected to Vercel. Any push to the `main` branch automatically deploys to https://bsebc.ivanmorhun.com.

**To deploy a change:**
```bash
git add .
git commit -m "Update service schedule"
git push
```

Done. Live in ~30 seconds.

## Contributing

1. Clone the repo
2. Make your changes (mostly in `content.js`)
3. Open `index.html` in a browser to preview locally
4. Push to GitHub

No build tools, no npm, no dependencies. Just plain HTML/CSS/JS.
