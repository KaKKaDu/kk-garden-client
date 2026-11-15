export const gardenPluginCanvasStyles = (size: number, seed: number): string => `
.garden-plugin-canvas-container-${seed} {
  position: relative;
  width: 100%;
  max-width: ${size}px;
  aspect-ratio: 1/1;
  // border: solid 12px rgba(235,235,235,0.6);
  // border-radius: 16px;
  background: rgba(235,235,235,0.6);
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
}

.garden-plugin-canvas-${seed} {
  position: absolute;
  image-rendering: pixelated;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#garden-plugin-tile-canvas-${seed} {
  z-index: 1;
}

#garden-plugin-small-object-canvas-${seed} {
  z-index: 2;
}

#garden-plugin-object-canvas-${seed} {
  z-index: 3;
}
`;