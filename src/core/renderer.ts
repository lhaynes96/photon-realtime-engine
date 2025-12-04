export type UpdateFn = (dt: number, elapsed: number) => void;
export type RenderFn = () => void;

export class Renderer {
  private lastTime = 0;
  private rafId = 0;
  private isRunning = false;

  constructor(private update: UpdateFn, private render: RenderFn) {}

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    const loop = (time: number) => {
      if (!this.isRunning) return;
      const dt = (time - this.lastTime) / 1000;
      this.lastTime = time;
      const elapsed = time / 1000;

      this.update(dt, elapsed);
      this.render();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.rafId);
  }
}
