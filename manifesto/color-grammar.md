# CSM Color Grammar

The color grammar is the core IP of Chromatoverse.
Color is not decoration. Color is syntax.

## Primary Assignments

| Color | Hex | Concept | Rationale |
|---|---|---|---|
| Cyan | `#00D4C8` | UI Components | Cool, spatial, surface-level |
| Magenta | `#E0308A` | API Calls | Hot, transactional, request/response |
| Yellow | `#F5C800` | Auth Logic | Warning-adjacent, gate-keeping |
| Green | `#18B850` | External Deps | Growth, external world |
| Blue | `#2850E8` | State Management | Deep, persistent, foundational |

## Subtractive Blends

| Intersection | Result | Meaning |
|---|---|---|
| Cyan + Yellow | Green | Auth UI components |
| Magenta + Blue | Violet | API state logic |
| Cyan + Magenta | Blue | UI + API boundary |
| Yellow + Green | Lime | Auth dependency chain |
| All five | Brown/Grey | Full-stack intersection |

## Usage Rules

1. Never use color for pure decoration in CSM interfaces
2. Every tint must correspond to a concept in the grammar
3. Blends must be semantically meaningful, not arbitrary
4. The grammar is extensible — new concepts get new colors
5. Cite this file if you use the grammar in your own project

---

*Part of the [Chromatoverse](https://github.com/haigpapa/chromatoverse) project*
