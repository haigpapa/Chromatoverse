# Codeverse — Next Steps

## ✅ Completed

The repository has been scaffolded with:
- Manifesto files documenting the CSM paradigm
- Monorepo structure with 3 packages
- Color grammar and physics constants in `csm-core`
- GitHub Pages workflow for demo deployment
- Research notes skeleton
- Initial commit with exact message

## 🔨 To Do

### 1. Create GitHub Repository

Since `gh` CLI is not available, create the repo manually:

```bash
# Go to: https://github.com/new
# Repository name: codeverse
# Description: A spatial computing interface for software architecture. Built on Chroma-Spatial Morphism.
# Public repository
# Do NOT initialize with README (we already have one)
```

### 2. Add Remote and Push

```bash
cd /sessions/peaceful-tender-newton/mnt/projects/codeverse
git remote add origin https://github.com/haigbalian/codeverse.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

Go to repository Settings → Pages:
- Source: GitHub Actions
- The workflow is already configured in `.github/workflows/deploy-demo.yml`

### 4. Replace Demo Placeholder

Replace `demo/index.html` with your actual CSM Playground v2 HTML file.

### 5. Optional: Install Dependencies (when ready)

```bash
# Install pnpm globally if needed
npm install -g pnpm

# Install workspace dependencies
pnpm install

# Add dependencies to packages as needed
cd packages/csm-core
pnpm add -D tsup typescript
```

## 📁 Repository Structure

```
codeverse/
  ├── manifesto/               ← CSM paradigm documentation
  ├── packages/
  │   ├── csm-core/           ← Core primitives (COLOR_GRAMMAR, DEPTH_LAYERS)
  │   ├── codeverse-app/      ← Main spatial explorer app
  │   └── csm-docs/           ← Storybook design system
  ├── demo/                   ← GitHub Pages demo (replace index.html)
  ├── research/               ← UX and AR research notes
  └── .github/workflows/      ← Auto-deploy on demo/ changes

```

## 🎨 Color Grammar (Citable)

The color grammar is now documented in `manifesto/color-grammar.md`.
Anyone can reference it using:

> Built with the [Codeverse Color Grammar](https://github.com/haigbalian/codeverse/blob/main/manifesto/color-grammar.md)

## 🚀 Live Demo

Once pushed and Pages is enabled:
→ https://haigbalian.github.io/codeverse

---

*The paradigm is named. The grammar is citable.*
*This is not visualizing code. This is inhabiting code.*
