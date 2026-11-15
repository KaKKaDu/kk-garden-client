import type { GridDrawer } from '@/lib/canvas-layer/grid-drawer/grid-drawer';
import type {
  Cell,
  Coordinates,
  GridDrawerElement,
  SpriteData,
  SpritesheetElement
} from "@kk-garden/shared/types";
import {AnimatedSprite} from "@kk-garden/shared/sets";

type ActiveSpriteState = {
  frames: GridDrawerElement[];
  frameIndex: number;
};

type SpriteManager = {
  draw: () => void;
  clear: () => void;
};

type SpriteIntervalId = number;

export class SpriteDrawer {
  private readonly drawer: GridDrawer;
  private spriteMap: Map<SpriteIntervalId, SpriteManager> = new Map<SpriteIntervalId, SpriteManager>([]);

  constructor(gridDrawer: GridDrawer) {
    this.drawer = gridDrawer;
  };

  private createSprite(sprite: AnimatedSprite<string>, cell: Cell, coordinates?: Coordinates): SpriteManager {
    const frames: GridDrawerElement[] = [];
    sprite.animation.forEach((frameKey: string) => frames.push({
      spritesheetPath: sprite.frames.path,
      element: sprite.frames.getElement(frameKey) as SpritesheetElement,
      cell,
      innerCoordinates: coordinates || undefined,
      index: 0,
    }));
    const state: ActiveSpriteState = {
      frames,
      frameIndex: 0,
    };
    const interval: number = Math.floor(1000/sprite.fps);
    const initialDelay: number = Math.random()*200;
    let intervalRef: SpriteIntervalId | null = null;
    const manager: SpriteManager = {
      draw: () => {
        setTimeout(() => {
          intervalRef = window.setInterval(() => {
            state.frameIndex++;
            if(state.frameIndex >= state.frames.length) {
              state.frameIndex = 0;
            }
            const nextFrame: GridDrawerElement = {
              ...state.frames[state.frameIndex],
            };
            this.drawer.drawElement(nextFrame, true);
          }, interval);
          this.spriteMap.set(intervalRef, manager);
        }, initialDelay);
      },
      clear: () => {
        if(intervalRef !== null) {
          window.clearInterval(intervalRef);
          this.spriteMap.delete(intervalRef);
          intervalRef = null;
        }
      }
    };
    return manager;
  };

  drawSprites(data: SpriteData[]): void {
    data.forEach((spriteData: SpriteData) => {
      const { sprite, cell, coordinates } = spriteData;
      const manager: SpriteManager = this.createSprite(sprite, cell, coordinates);
      manager.draw();
    });
  };

  clear(): void {
    Array.from(this.spriteMap.values()).forEach((manager: SpriteManager) => manager.clear());
  };
}