const express = require('express');
const path = require('path');
const fs = require('fs');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

const app = express();
const PORT = process.env.PORT || 6767;

// Live reload — watches public/ and apps/ for changes
const lrServer = livereload.createServer();
const watchPaths = [
  path.join(__dirname, 'public'),
  path.join(__dirname, 'apps'),
];
lrServer.watch(watchPaths);

// Inject livereload script into HTML responses
app.use(connectLivereload());

// Serve public/ (home page)
app.use(express.static(path.join(__dirname, 'public')));

// Serve each app under /apps/<name>/
app.use('/apps', express.static(path.join(__dirname, 'apps')));

// API: list available apps so the home page can render links dynamically
app.get('/api/apps', (req, res) => {
  const appsDir = path.join(__dirname, 'apps');
  if (!fs.existsSync(appsDir)) return res.json([]);

  const entries = fs.readdirSync(appsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => {
      const metaPath = path.join(appsDir, d.name, 'meta.json');
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

  res.json(entries);
});

app.listen(PORT, () => {
  console.log(`\n  Mini Apps running at http://localhost:${PORT}\n`);
});
