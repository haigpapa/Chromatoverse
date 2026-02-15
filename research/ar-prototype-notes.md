# AR Prototype Notes

## Target Platform
Apple Vision Pro — spatial computing as first-class paradigm

## CSM Translation to visionOS

| CSM Concept | visionOS Equivalent |
|---|---|
| Z-axis layers | RealityKit depth volumes |
| Blur falloff | Distance-based LOD |
| Color tinting | Material shader overlays |
| Snap physics | Spatial anchors + haptics |
| Acetate sheets | SwiftUI WindowGroups in 3D |

## Prototype Goals (Phase III)
1. Port demo/index.html to visionOS
2. Test color grammar legibility in passthrough AR
3. Validate spatial recall hypothesis with users
4. Explore pinch-to-expand gesture vocabulary

## Risks
- Color blending may not work in passthrough mode
- Depth perception issues in fully virtual mode
- Performance constraints with 100+ layers

## Next Steps
- [ ] Apply for Vision Pro developer kit
- [ ] Build Hello World RealityKit scene
- [ ] Prototype single acetate sheet with depth
