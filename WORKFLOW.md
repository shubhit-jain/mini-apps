# Mini Apps — Workflow

## Vision
A casual, growing collection of single-page web apps — each purpose-built and self-contained.
Hosted by a lightweight Express server with live-reload for fast development.
State lives in the browser (localStorage) or URL (for shareable/small state).

## Stack
- **Server**: Node.js + Express
- **Live reload**: livereload + connect-livereload + nodemon
- **Styling/JS**: CDN imports (Tailwind, Alpine, etc.) — no build step
- **Storage**: localStorage or URL params (no backend DB)

## Project Structure
```
/
├── server.js         — Express server with live-reload
├── public/
│   └── index.html    — Home page, lists all apps dynamically
└── apps/
    └── <app-name>/
        ├── meta.json     — title, description, emoji
        ├── index.html
        ├── logic.js
        └── style.css     (if needed)
```

## Adding a New App
1. Create `apps/<name>/` directory
2. Add `meta.json` with `title`, `description`, `emoji`
3. Build `index.html`, `logic.js`, `style.css`
4. App auto-appears on the home page

## Completed
- [x] Express server with live-reload (livereload + connect-livereload)
- [x] nodemon for server auto-restart
- [x] Home page with dynamic app listing
- [x] `/api/apps` endpoint reads `apps/` directory + `meta.json`
- [x] Casual, modern home page UI (Tailwind via CDN)

## Apps
<!-- added here as apps are built -->
