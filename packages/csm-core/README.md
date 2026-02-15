# @chromatoverse/csm-core

Core primitives for **Chroma-Spatial Morphism (CSM)** interfaces.

## What's included

- `COLOR_GRAMMAR` — The five semantic color tokens
- `DEPTH_LAYERS` — Z-axis positioning constants
- `PHYSICS_DEFAULTS` — Tuned snap physics parameters
- `SUBTRACTIVE_BLENDS` — Precomputed color intersections

## Usage

```typescript
import { COLOR_GRAMMAR, DEPTH_LAYERS } from '@chromatoverse/csm-core';

const sheet = {
  tint: COLOR_GRAMMAR.UI,
  ...DEPTH_LAYERS.FILE,
};
```

## Status

🔨 **In progress** — Phase I scaffold complete, implementation pending
