import type {Nullable, SizeMeasures} from "@kk-garden/shared/types";

export class CanvasContext {
  private readonly ctx: Nullable<CanvasRenderingContext2D> = null;

  public useContext(callback: (context: CanvasRenderingContext2D) => void) {
    if(this.ctx) {
      callback(this.ctx);
    }
  };

  constructor(canvas: HTMLCanvasElement, sizes: SizeMeasures) {
    this.ctx = canvas.getContext('2d');
    this.useContext(context => {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      canvas.width = sizes.width;
      canvas.height = sizes.height;
    });
  };
}