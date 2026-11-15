import { gardenPluginCanvasStyles } from '@/lib/canvas-layer/garden-plugin/styles/canvas-styles';
import { CanvasContext } from '@/lib/canvas-layer/context/canvas-context';
import { GridDrawer } from '@/lib/canvas-layer/grid-drawer/grid-drawer';
import { SpriteDrawer } from '@/lib/canvas-layer/sprite-drawer/sprite-drawer';
import type {GridConstants} from "@kk-garden/shared/constants";
import type {GardenDrawData, Nullable} from "@kk-garden/shared/types";

type GardenCanvasContexts = {
  tile: CanvasContext;
  object: CanvasContext;
  smallObject: CanvasContext;
};

export class GardenPlugin {
  private readonly gridConstants: GridConstants;
  private readonly largeGridConstants: GridConstants;
  private readonly size: number;
  private readonly seeds: number[] = [];
  private ctxs: Map<number, Partial<GardenCanvasContexts>> = new Map<number, Partial<GardenCanvasContexts>>();
  private containers: Map<number, HTMLDivElement> = new Map<number, HTMLDivElement>();
  private styles: Map<number, HTMLStyleElement> = new Map<number, HTMLStyleElement>();
  private terminates: Map<number, () => void> = new Map<number, () => void>();

  constructor(size: number, gridConstants: GridConstants, largeGridConstants: GridConstants) {
    this.gridConstants = gridConstants;
    this.largeGridConstants = largeGridConstants;
    this.size = size;
  };

  public init(container: HTMLDivElement): number {
    const seed: number = Math.floor(Math.random() * 1000000000);
    const canvasContainer: HTMLDivElement = document.createElement('div');
    canvasContainer.classList.add(`garden-plugin-canvas-container-${seed}`);

    const tileCanvas: HTMLCanvasElement = document.createElement('canvas');
    tileCanvas.id = `garden-plugin-tile-canvas-${seed}`;
    tileCanvas.classList.add(`garden-plugin-canvas-${seed}`);

    const objectCanvas: HTMLCanvasElement = document.createElement('canvas');
    objectCanvas.id = `garden-plugin-object-canvas-${seed}`;
    objectCanvas.classList.add(`garden-plugin-canvas-${seed}`);

    const smallObjectCanvas: HTMLCanvasElement = document.createElement('canvas');
    smallObjectCanvas.id = `garden-plugin-small-object-canvas-${seed}`;
    smallObjectCanvas.classList.add(`garden-plugin-canvas-${seed}`);

    const style: HTMLStyleElement = document.createElement('style');
    style.id = `garden-plugin-canvas-styles-${seed}`;
    style.textContent = gardenPluginCanvasStyles(this.size, seed);

    document.head.appendChild(style);

    canvasContainer.appendChild(tileCanvas);
    canvasContainer.appendChild(objectCanvas);
    canvasContainer.appendChild(smallObjectCanvas);


    const tileCtx = new CanvasContext(tileCanvas, { width: this.gridConstants.canvasWidth, height: this.gridConstants.canvasHeight });
    const objectCtx = new CanvasContext(objectCanvas, { width: this.largeGridConstants.canvasWidth, height: this.largeGridConstants.canvasHeight });
    const smallObjectCtx = new CanvasContext(smallObjectCanvas, { width: this.gridConstants.canvasWidth, height: this.gridConstants.canvasHeight });

    this.ctxs.set(seed, { tile: tileCtx, object: objectCtx, smallObject: smallObjectCtx });
    this.containers.set(seed, canvasContainer);
    this.styles.set(seed, style);
    this.seeds.push(seed);

    container.appendChild(canvasContainer);

    return seed;
  };

  private validateCtxs = (seed: number): Nullable<GardenCanvasContexts> => {
    const ctxs: Nullable<Partial<GardenCanvasContexts>> = this.ctxs.get(seed);
    if(!ctxs) {
      return null;
    }
    const { tile, object, smallObject } = ctxs;
    if(!tile || !object || !smallObject) {
      return null;
    }
    return { tile, object, smallObject };
  };

  public async draw(seed: number, data: GardenDrawData): Promise<void> {
    const ctxs: Nullable<GardenCanvasContexts> = this.validateCtxs(seed);
    if(!ctxs) {
      return;
    }

    const tileDrawer: GridDrawer = new GridDrawer(ctxs.tile, this.gridConstants);

    const treesDrawer: GridDrawer = new GridDrawer(ctxs.object, this.largeGridConstants);
    const treesSpriteDrawer: SpriteDrawer = new SpriteDrawer(treesDrawer);

    const bushesDrawer: GridDrawer = new GridDrawer(ctxs.smallObject, this.gridConstants);
    const bushesSpriteDrawer: SpriteDrawer = new SpriteDrawer(bushesDrawer);

    const stonesDrawer: GridDrawer = new GridDrawer(ctxs.smallObject, this.gridConstants);

    await tileDrawer.drawElements(data.tile);
    await stonesDrawer.drawElements(data.stones);

    treesSpriteDrawer.drawSprites(data.trees);
    bushesSpriteDrawer.drawSprites(data.bushes);

    this.terminates.set(seed, () => {
      treesSpriteDrawer.clear();
      bushesSpriteDrawer.clear();

      const container: Nullable<HTMLDivElement> = this.containers.get(seed);
      const style: Nullable<HTMLStyleElement> = this.styles.get(seed);

      this.containers.delete(seed);
      this.ctxs.delete(seed);
      this.terminates.delete(seed);

      container?.remove();
      style?.remove();
    });
  };

  public async terminate(seed: number): Promise<void> {
    const terminate: Nullable<() => void> = this.terminates.get(seed);
    if(terminate) {
      terminate();
    }
  };
}