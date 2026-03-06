#!/usr/bin/env node
// build.js — Generate static site in docs/ for GitHub Pages deployment.
//
// Usage:  node build.js   (or: npm run build)
//
// What it does:
//  1. Reads apps/<name>/meta.json to get the app list
//  2. Copies apps/ → docs/apps/
//  3. Generates docs/index.html with the app list baked in (no /api/apps fetch)

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DOCS = path.join(ROOT, 'docs');
const APPS_DIR = path.join(ROOT, 'apps');

// ── helpers ──────────────────────────────────────────────────────────────────

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// ── read apps ─────────────────────────────────────────────────────────────────

const apps = fs.readdirSync(APPS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => {
    const metaPath = path.join(APPS_DIR, d.name, 'meta.json');
    const meta = fs.existsSync(metaPath)
      ? JSON.parse(fs.readFileSync(metaPath, 'utf8'))
      : {};
    return {
      slug: d.name,
      title: meta.title || d.name,
      description: meta.description || '',
      emoji: meta.emoji || '🧩',
    };
  });

// ── clean + recreate docs/ ────────────────────────────────────────────────────

fs.rmSync(DOCS, { recursive: true, force: true });
fs.mkdirSync(DOCS);

// ── copy apps + shared assets ─────────────────────────────────────────────────

copyDir(APPS_DIR, path.join(DOCS, 'apps'));
copyDir(path.join(ROOT, 'public', 'shared'), path.join(DOCS, 'shared'));

// ── generate index.html ───────────────────────────────────────────────────────

const appCards = apps.map(app => `
      <a href="apps/${app.slug}/" class="card group flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-200 transition-all duration-200">
        <div class="text-3xl leading-none mt-0.5">${app.emoji}</div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <h2 class="font-semibold text-slate-800 text-base truncate">${app.title}</h2>
            <span class="arrow text-slate-300 text-lg flex-shrink-0">→</span>
          </div>
          ${app.description ? `<p class="text-sm text-slate-400 mt-0.5 line-clamp-2">${app.description}</p>` : ''}
        </div>
      </a>`).join('');

const emptyState = `
      <div class="text-center py-20 text-slate-400 col-span-2">
        <div class="text-5xl mb-4">🚧</div>
        <p class="text-lg font-medium">No apps yet — check back soon!</p>
      </div>`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mini Apps</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="shared/base.css" />
  <style>
    body { font-family: 'Inter', sans-serif; }
    .card:hover .arrow { transform: translateX(4px); }
    .arrow { transition: transform 0.2s ease; }
    /* home logo colour overrides */
    .home-logo { background: #fff; border: 1.5px solid #e2e8f0; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
    .home-logo:hover { box-shadow: 0 2px 8px rgba(99,102,241,0.15); border-color: #a5b4fc; }
    .home-logo-sq { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
  </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">

  <!-- Home nav logo -->
  <a href="./" aria-label="Home" class="home-logo">
    <div class="home-logo-sq"></div>
  </a>

  <div class="max-w-3xl mx-auto px-6 py-16">

    <div class="mb-12">
      <h1 class="text-4xl font-bold text-slate-800 mb-2">Mini Apps</h1>
      <p class="text-slate-500 text-lg">A growing collection of fun little tools.</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      ${apps.length > 0 ? appCards : emptyState}
    </div>

  </div>

</body>
</html>
`;

fs.writeFileSync(path.join(DOCS, 'index.html'), html);

console.log(`✓ Built ${apps.length} app(s) → docs/`);
apps.forEach(a => console.log(`  ${a.emoji}  ${a.title}  →  docs/apps/${a.slug}/`));
