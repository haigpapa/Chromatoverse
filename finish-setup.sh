#!/bin/bash
# Codeverse CSM Setup Completion Script

echo "🎨 Codeverse CSM - Finalizing setup..."
echo ""

# Remove git locks if they exist
echo "Cleaning up git locks..."
rm -f .git/index.lock .git/HEAD.lock .git/objects/maintenance.lock 2>/dev/null || true

# Stage all changes
echo "Staging changes..."
git add -A

# Commit the refactor
echo "Creating commit..."
git commit -m "refactor: pivot to CSM paradigm - remove old analyzer project

Removed old 'Codeverse Explorer' repo analyzer (api/, client/, server/)
Kept only the new CSM (Chroma-Spatial Morphism) spatial computing scaffold

The color grammar is now citable. The paradigm is named.
This is not visualizing code. This is inhabiting code."

# Create clean branch
echo "Creating csm-paradigm branch..."
git checkout -b csm-paradigm

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin csm-paradigm

echo ""
echo "✅ Complete! Your CSM scaffold is now on GitHub"
echo "→ https://github.com/haigpapa/codeverse/tree/csm-paradigm"
echo ""
echo "Next: Replace demo/index.html with your CSM Playground v2"
