// @chromatoverse/csm-core
// Chroma-Spatial Morphism — Layer Primitives
// Phase I scaffold — implementation in progress

export const CSM_VERSION = '0.0.1';

// Color Grammar tokens
export const COLOR_GRAMMAR = {
  UI:    '#00D4C8',  // Cyan    — UI Components
  API:   '#E0308A',  // Magenta — API Calls
  AUTH:  '#F5C800',  // Yellow  — Auth Logic
  DEPS:  '#18B850',  // Green   — External Deps
  STATE: '#2850E8',  // Blue    — State Management
} as const;

// Z-axis depth constants
export const DEPTH_LAYERS = {
  ROOT:     { zIndex: 0, blur: 16, opacity: 0.40 },
  DIR:      { zIndex: 1, blur: 8,  opacity: 0.65 },
  SUBDIR:   { zIndex: 2, blur: 3,  opacity: 0.82 },
  FILE:     { zIndex: 3, blur: 0,  opacity: 1.00 },
  PINNED:   { zIndex: 4, blur: 0,  opacity: 1.00 },
} as const;

// Physics defaults (tuned from playground)
export const PHYSICS_DEFAULTS = {
  tension:    1.56,
  swing:      7.0,
  blurMax:    16,
  tintOpacity: 0.52,
} as const;

// Subtractive color blend results
export const SUBTRACTIVE_BLENDS: Record<string, { color: string; label: string }> = {
  'UI+AUTH':   { color: '#00c878', label: 'Auth UI Components' },
  'API+STATE': { color: '#8800cc', label: 'API State Logic' },
  'UI+API':    { color: '#0050cc', label: 'UI/API Boundary' },
  'AUTH+DEPS': { color: '#80cc00', label: 'Auth Dependency Chain' },
};

// AcetateSheet — placeholder interface (implementation: Phase II)
export interface AcetateSheetProps {
  tint: keyof typeof COLOR_GRAMMAR;
  zLayer: keyof typeof DEPTH_LAYERS;
  width: number;
  height: number;
  x: number;
  y: number;
  content?: React.ReactNode;
  onSnap?: () => void;
}

// TODO Phase I: implement AcetateSheet React component
// TODO Phase II: implement SnapPhysics engine
// TODO Phase III: implement SubtractiveFilter
