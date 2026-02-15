# Chromatoverse — Next Steps

## ✅ Completed

The repository has been scaffolded with:
- Manifesto files documenting the CSM paradigm
- Monorepo structure with 3 packages
- Color grammar and physics constants in `csm-core`
- GitHub Pages workflow for demo deployment
- Research notes skeleton
- Full Chromatoverse branding

## 🔨 To Do

### 1. Delete Old GitHub Repository (if it exists)

Go to: https://github.com/haigpapa/codeverse/settings
- Scroll to "Danger Zone"
- Click "Delete this repository"
- Type `haigpapa/codeverse` to confirm

### 2. Create New GitHub Repository

Go to: https://github.com/new
- Repository name: **chromatoverse**
- Description: *Spatial computing for software architecture. Built on Chroma-Spatial Morphism.*
- Public repository
- Do NOT initialize with README (we already have one)

### 3. Connect and Push

```bash
cd /sessions/peaceful-tender-newton/mnt/projects/codeverse

# Remove old remote (if exists)
git remote remove origin 2>/dev/null || true

# Add new remote
git remote add origin https://github.com/haigpapa/chromatoverse.git

# Create main branch
git branch -M main

# Push
git push -u origin main
```

### 4. Enable GitHub Pages

Go to repository Settings → Pages:
- Source: GitHub Actions
- The workflow is already configured in `.github/workflows/deploy-demo.yml`

### 5. Replace Demo Placeholder

Replace `demo/index.html` with your actual CSM Playground v2 HTML file.

### 6. Optional: Rename Local Directory

```bash
cd /sessions/peaceful-tender-newton/mnt/projects
mv codeverse chromatoverse
```

## 📁 Repository Structure

```
chromatoverse/
  ├── manifesto/               ← CSM paradigm documentation
  ├── packages/
  │   ├── csm-core/           ← @chromatoverse/csm-core
  │   ├── chromatoverse-app/  ← @chromatoverse/app
  │   └── csm-docs/           ← @chromatoverse/csm-docs
  ├── demo/                   ← GitHub Pages demo
  ├── research/               ← UX and AR research notes
  └── .github/workflows/      ← Auto-deploy on demo/ changes
```

## 🎨 Color Grammar (Citable)

The color grammar is now documented in `manifesto/color-grammar.md`.
Anyone can reference it using:

> Built with the [Chromatoverse Color Grammar](https://github.com/haigpapa/chromatoverse/blob/main/manifesto/color-grammar.md)

## 🚀 Live Demo

Once pushed and Pages is enabled:
→ https://haigpapa.github.io/chromatoverse

---

*The paradigm is named. The grammar is citable.*
*This is not visualizing code. This is inhabiting code.*
