import type {GridDrawerElement, Nullable, SpritesheetPath} from "@kk-garden/shared/types";
import type { CanvasContext } from '@/lib/canvas-layer/context/canvas-context';
import {GridConstants} from "@kk-garden/shared/constants";
import {getSpritesheetAsset} from "@kk-garden/shared/assets";

type ElementLayerMapTuple = [number, GridDrawerElement[]];

export class GridDrawer {
  private ctx: CanvasContext;
  private images = new Map<SpritesheetPath, HTMLImageElement>();
  private readonly consts: GridConstants;

  constructor(context: CanvasContext, constants: GridConstants) {
    this.ctx = context;
    this.consts = constants;
  };

  private getImage = async (path: SpritesheetPath): Promise<HTMLImageElement> => {
    const retrieveImage: Nullable<HTMLImageElement> = this.images.get(path);
    if(retrieveImage) {
      return retrieveImage;
    } else {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getSpritesheetAsset(path);
        img.onload = () => {
          this.images.set(path, img);
          return resolve(img);
        }
      });
    }
  }

  public async drawElement(element: GridDrawerElement, erase: boolean = false): Promise<void> {
    const img: HTMLImageElement = await this.getImage(element.spritesheetPath);
    const { x: srcX, y: srcY, width: srcWidth, height: srcHeight } = element.element;
    const { row, column } = element.cell;
    const { x: canvasX, y: canvasY } = {
      x: column * this.consts.cellSize + (element.innerCoordinates?.x || 0),
      y: row * this.consts.cellSize + (element.innerCoordinates?.y || 0),
    };
    this.ctx.useContext((context: CanvasRenderingContext2D): void => {
      if(erase) {
        context.clearRect(canvasX, canvasY, element.sizes?.width || srcWidth, element.sizes?.height || srcHeight);
      }
      context.drawImage(img, srcX, srcY, srcWidth, srcHeight, canvasX, canvasY, element.sizes?.width || srcWidth, element.sizes?.height || srcHeight);
    });
  };

  public async drawElements(elements: GridDrawerElement[]): Promise<void> {
    const elementLayers: Map<number, GridDrawerElement[]> = new Map<number, GridDrawerElement[]>();
    for(const el of elements) {
      const { index } = el;
      if(!elementLayers.has(index)) {
        elementLayers.set(index, [el]);
      } else {
        elementLayers.get(index)?.push(el);
      }
    }
    const sortedLayers: ElementLayerMapTuple[] = Array.from(elementLayers.entries())
      .sort((a: ElementLayerMapTuple, b: ElementLayerMapTuple) => a[0] - b[0]);

    for (const [, layerElements] of sortedLayers) {
      await Promise.all(
        layerElements.map(el => this.drawElement(el))
      );
    }
  };
}