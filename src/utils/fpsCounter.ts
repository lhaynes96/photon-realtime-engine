type UpdateHandler = (fps: number) => void;

export class FPSCounter {
  private frames = 0;
  private lastTime = performance.now();
  private handler: UpdateHandler;

  constructor(handler: UpdateHandler) {
    this.handler = handler;
  }

  frame() {
    this.frames += 1;
    const now = performance.now();
    const delta = now - this.lastTime;
    if (delta >= 500) {
      const fps = (this.frames / delta) * 1000;
      this.handler(Math.round(fps));
      this.frames = 0;
      this.lastTime = now;
    }
  }
}
