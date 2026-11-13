# NISC 2026 Companion App

A mobile-first, installable web app (PWA) for the **Northeast Intercollegiate Sales Competition** at Bryant University (Nov 13–14, 2026), styled in Gartner colors.

## Features
- **Home** – live countdown / "LIVE now" banner, next sessions, quick links
- **Schedule** – day tabs, track filters, ★ personal agenda (saved on device)
- **Compete** – Role Play, Speed Sell and AI Case Study overviews with tips
- **Practice** – pitch timer (1/3/10/20 min), prep checklist, private notes
- **Info** – venue, map, contact, official links

Works offline after the first visit and can be added to a phone's home screen.

## Run
No build step. Serve the folder with any static server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Deploy by uploading the folder to GitHub Pages, Netlify, etc.

## Update content
All event content lives in `data.js`. **The agenda times are placeholders** — replace them with the official schedule from nisc.bryant.edu before distributing.
