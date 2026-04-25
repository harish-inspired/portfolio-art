# Deploying This Portfolio

This repository is a static website (HTML/CSS/JS/images). Below are step-by-step ways to deploy to Netlify or Vercel and get a public HTTPS URL.

Prerequisites
- A GitHub account (recommended for continuous deploys).
- Node.js + npm (for CLI tools) — optional.

Quick options

- Netlify (drag & drop):
  1. Zip this project (all files) or open the project folder.
  2. Go to https://app.netlify.com/drop and drop the folder/zip.
  3. Netlify publishes a public URL with HTTPS automatically.

- Vercel (drag & drop):
  1. Go to https://vercel.com/new and select "Import Project" → "Deploy a Git Repository" or drag via the Vercel UI.
  2. Follow the prompts. Vercel enables HTTPS automatically.

CLI-based deploys

- Netlify CLI (quick manual deploy):
  1. Install the CLI:

```bash
npm install -g netlify-cli
```

  2. Login and deploy (from project root):

```bash
npx netlify login
npx netlify deploy --prod --dir=.
```

  3. The CLI returns a live URL (HTTPS).

- Vercel CLI:
  1. Install the CLI:

```bash
npm install -g vercel
```

  2. Deploy (from project root):

```bash
vercel # follow prompts
vercel --prod # to push a production deployment
```

Deploy via GitHub (recommended for continuous deploys)
1. Create a GitHub repo and push this project.
2. In Netlify: "New site from Git" → connect repo → set publish directory to `/` → deploy.
3. In Vercel: "Import Project" → select repo → deploy. Both providers enable HTTPS automatically.

Checks after deployment
- Ensure all images are committed to the repo and referenced with relative paths (already done here: e.g., `p1.jpeg`).
- Visit the live URL, check mobile responsiveness, and confirm assets load. Use browser DevTools to confirm no 404s.

Limitations
- I cannot create the live URL from this environment without authenticating to your Netlify/Vercel/GitHub account. If you want me to perform the deployment, provide an OAuth link/temporary access or invite a deployment bot account with instructions.

If you want, I can:
- Create a Git repo in this folder and produce the `git` commands to run locally.
- Generate a sample GitHub Actions workflow to auto-deploy to Netlify (requires Netlify deploy key) or Vercel (requires Vercel token).

Tell me which provider you prefer and whether you want me to create the Git steps and CI config files.
