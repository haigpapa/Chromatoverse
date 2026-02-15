#!/bin/bash
# Chromatoverse — Push to GitHub

echo "🎨 Chromatoverse — Pushing to GitHub..."
echo ""

# Clean up any git locks
echo "Cleaning up git locks..."
rm -f .git/index.lock .git/HEAD.lock .git/objects/maintenance.lock 2>/dev/null || true
sleep 1

# Check current state
echo "Current git status:"
git status --short

# Stage all changes
echo ""
echo "Staging all changes..."
git add -A

# Show what will be committed
echo ""
echo "Changes to be committed:"
git status --short

# Commit
echo ""
read -p "Create commit? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git commit -m "rebrand: Codeverse → Chromatoverse

Complete rebrand to Chromatoverse with CSM paradigm.
- Updated all package names to @chromatoverse/*
- Renamed codeverse-app → chromatoverse-app
- Updated all documentation and manifesto references
- Updated demo placeholder with Chromatoverse branding

The color grammar is now citable. The paradigm is named.
This is not visualizing code. This is inhabiting code."
fi

# Instructions for GitHub
echo ""
echo "================================================"
echo "Next steps:"
echo "================================================"
echo ""
echo "1. Delete old repo (if it exists):"
echo "   → https://github.com/haigpapa/codeverse/settings"
echo ""
echo "2. Create new repo:"
echo "   → https://github.com/new"
echo "   Name: chromatoverse"
echo "   Description: Spatial computing for software architecture. Built on Chroma-Spatial Morphism."
echo "   Public, no initialization"
echo ""
echo "3. Then run these commands:"
echo ""
echo "   git remote remove origin 2>/dev/null || true"
echo "   git remote add origin https://github.com/haigpapa/chromatoverse.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Enable GitHub Pages in repo Settings → Pages"
echo "   Source: GitHub Actions"
echo ""
