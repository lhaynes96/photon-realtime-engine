import { createGLContext } from './core/glContext';
import { Renderer } from './core/renderer';
import { BasicScene } from './scene/basicScene';
import { FPSCounter } from './utils/fpsCounter';
import { resizeCanvasToDisplaySize } from './utils/resizeCanvasToDisplaySize';

function getHTMLElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
}

export function initPhotonEngine() {
  const canvas = getHTMLElement<HTMLCanvasElement>('gl-canvas');
  const fpsLabel = getHTMLElement<HTMLSpanElement>('fps');
  const statusLabel = getHTMLElement<HTMLSpanElement>('status');
  const modeToggle = getHTMLElement<HTMLInputElement>('mode-toggle');

  const gl = createGLContext(canvas);
  const scene = new BasicScene(gl);

  const fpsCounter = new FPSCounter((fps) => {
    fpsLabel.textContent = `FPS: ${fps}`;
  });

  const renderer = new Renderer(
    (dt, elapsed) => {
      scene.update(dt, elapsed);
      fpsCounter.frame();
    },
    () => {
      if (resizeCanvasToDisplaySize(canvas)) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      scene.render();
    }
  );

  const updateMouse = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = 1 - (event.clientY - rect.top) / rect.height;
    scene.setMousePosition(x, y);
  };

  const updateMode = () => {
    const mode = modeToggle.checked ? 1 : 0;
    scene.setMode(mode);
    statusLabel.textContent = `Mode: ${mode === 0 ? 'A' : 'B'}`;
  };

  canvas.addEventListener('pointermove', updateMouse);
  canvas.addEventListener('pointerleave', () => scene.setMousePosition(0, 0));
  modeToggle.addEventListener('change', updateMode);

  window.addEventListener('resize', () => {
    if (resizeCanvasToDisplaySize(canvas)) {
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  });

  updateMode();
  resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);
  renderer.start();
}

window.addEventListener('DOMContentLoaded', initPhotonEngine);
