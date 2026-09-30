# Mini Apps

A collection of single-page apps hosted with a lightweight Express server.

## Requirements

- Node.js 18+

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:6767](http://localhost:6767).

Changes to any file in `public/` or `apps/` auto-refresh the browser.

The index page lists all mini apps, including Hindi Flash Cards. See [agents.md](agents.md) for project guidance and instructions for adding apps.

## Deploy to GitHub Pages

Live site: [Mini Apps](https://shubhit-jain.github.io/mini-apps/).

GitHub Pages is configured to deploy from the `docs/` folder on `main`.

1. Update the apps in `apps/` or the local index in `public/`.
2. Generate the static site:

   ```bash
   npm run build
   ```

   This recreates `docs/`, copies all apps and shared styles, and generates the app listing. Review the generated changes before committing.

3. Commit the source changes and generated `docs/` files, then push to `main`:

   ```bash
   git add README.md agents.md server.js build.js public/ apps/ docs/
   git commit -m "Update mini apps"
   git push origin main
   ```

4. GitHub Pages deploys automatically after the push. Wait for the `pages build and deployment` run in the repository's **Actions** tab to finish, then check the live site.

For initial setup, open **Settings → Pages**, choose **Deploy from a branch**, and select **main** with **/docs** as the folder.
