# Mini Apps — Workflow

## Vision
A casual, growing collection of single-page web apps — each purpose-built and self-contained.
Hosted by a lightweight Express server with live-reload for fast development.
State lives in the browser (localStorage) or URL (for shareable/small state).

## Security rules — this is a public repo
- **Never commit secrets**: no API keys, tokens, passwords, or credentials
- **No `.env` files**: use environment variables locally; `.env*` is gitignored
- **No key/cert files**: `*.key`, `*.pem`, `*.cert`, `id_rsa*` are gitignored
- All apps are fully client-side — if an app ever needs a secret, it goes through a backend proxy, never in the browser code

## Stack
- **Server**: Node.js + Express (local dev only)
- **Live reload**: livereload + connect-livereload + nodemon
- **Styling/JS**: CDN imports (Tailwind, Alpine, etc.) — no build step
- **Storage**: localStorage or URL params (no backend DB)
- **Deployment**: GitHub Pages via `docs/` folder (static build)

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

## Dev Workflow
1. `npm run dev` — start Express + live-reload at http://localhost:6767
2. Create/edit apps under `apps/<name>/` — changes live-reload automatically

## Deploy to GitHub Pages
1. `npm run build` — regenerates `docs/` from current `apps/`
2. Commit and push `docs/` to main
3. GitHub Pages serves from `docs/` on main branch

## Adding a New App
1. Create `apps/<name>/` directory
2. Add `meta.json` with `title`, `description`, `emoji`
3. Build `index.html`, `logic.js`, `style.css`
4. App auto-appears on the home page (dev) and in the build (deploy)

## Completed
- [x] Express server with live-reload (livereload + connect-livereload)
- [x] nodemon for server auto-restart
- [x] Home page with dynamic app listing
- [x] `/api/apps` endpoint reads `apps/` directory + `meta.json`
- [x] Casual, modern home page UI (Tailwind via CDN)

## Apps

### ⚡ Speed Math (`apps/speed-math/`)
- **Audience**: Tweens (10–14)
- **Goal**: Answer the most multiplication questions (tables 11–20) in 60 seconds
- **Features**: Countdown, 4-choice MCQ, correct/wrong animations, per-round score reveal, session leaderboard, localStorage persistence, mobile-responsive
- [x] Question bank — all 110 products (11–20 × 1–12) expanded into array
- [x] Random shuffle, no repeats per game
- [x] Plausible distractors (adjacent table products + nearby traps)
- [x] Countdown 3-2-1-GO! with CSS animation
- [x] 60-second timer bar (green → yellow → red + urgent pulse)
- [x] Correct flash / wrong shake animations on option buttons
- [x] Score reveal screen with staggered animation
- [x] Leaderboard with add-player / end-game flow
- [x] localStorage persistence across sessions

### ⛏️ Minecraft Adventure (`apps/minecraft/`)
- **Audience**: All ages
- **Goal**: Collect as many diamonds as possible in 90 seconds
- **Features**: Canvas game, procedural world, pixel-art textures, Steve + Creeper sprites, mining, day/night cycle, high score
- [x] 8×8 pixel-art textures baked to offscreen canvases (grass, dirt, stone, bedrock, coal ore, diamond ore, wood, leaves)
- [x] Procedural terrain: surface height variation, trees, ores (coal + diamond)
- [x] Steve: walk/jump physics, walk animation, invincibility flash on hit
- [x] Creeper AI: patrol + chase player, explosion particles, damage
- [x] Block mining: click/hold or E key, progress overlay with crack lines, dig sounds
- [x] Diamond drops: rotating animated gem, collect on touch
- [x] Day/night sky cycle over 90 seconds (sun, moon, stars, clouds)
- [x] HUD: hearts, score badge, timer, mining progress bar, music toggle
- [x] Mobile controls: on-canvas D-pad (←, →, ↑, ⛏)
- [x] Menu + Game Over screens drawn on canvas
- [x] High score persistence via localStorage
- [x] Ambient Minecraft-style background music (Web Audio API)
