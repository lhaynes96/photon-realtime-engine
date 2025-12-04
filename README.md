# Photon Realtime Engine

A minimal, fast, and extensible WebGL2 boilerplate built with Vite + TypeScript. It is designed to be a clean starting point for shader-driven visuals, particle systems, and input/audio-reactive graphics without extra frameworks.

## Quick start

```bash
npm install
npm run dev
```

- `npm run dev` – start a hot-reloading dev server.
- `npm run build` – bundle for production.
- `npm run preview` – serve the production build locally.

Open `http://localhost:5173` (default Vite port) to see the demo ripple shader.

## Project layout

```
photon-realtime-engine/
├─ index.html              # Fullscreen canvas + overlay UI
├─ src/
│  ├─ main.ts              # Entry point + engine bootstrap
│  ├─ core/
│  │  ├─ glContext.ts      # WebGL2 context creation & defaults
│  │  ├─ renderer.ts       # RAF-based render loop
│  │  └─ shaderProgram.ts  # Compile/link helpers
│  ├─ scene/
│  │  └─ basicScene.ts     # Fullscreen triangle scene with uniforms
│  ├─ shaders/
│  │  ├─ vertex.glsl
│  │  └─ fragment.glsl
│  └─ utils/
│     ├─ fpsCounter.ts
│     └─ resizeCanvasToDisplaySize.ts
├─ vite.config.ts
└─ tsconfig.json
```

## How it works

- **Canvas setup:** `main.ts` grabs the `#gl-canvas`, initializes WebGL2 via `createGLContext`, resizes to device pixel ratio, and starts the `Renderer` loop.
- **Render loop:** `Renderer` drives `update` and `render` callbacks with delta and elapsed time. The canvas is only resized when necessary to avoid extra allocations.
- **Scene:** `BasicScene` builds a fullscreen triangle VAO, compiles/link shaders, and exposes `update`, `render`, `setMousePosition`, and `setMode` for interaction.
- **UI overlay:** Shows FPS and a mode toggle that switches between two palette variations inside the fragment shader.
- **Input:** Pointer position is normalized and passed as `u_mouse`; leaving the canvas resets the value.

## Customizing shaders

- Replace `src/shaders/vertex.glsl` and `src/shaders/fragment.glsl` with your own code.
- Import additional shader files as strings using Vite's `?raw` suffix.
- Add uniforms in GLSL, then fetch/set them in `basicScene.ts` (see `u_time`, `u_resolution`, `u_mouse`, `u_mode`).

## Changing geometry

`basicScene.ts` uses a fullscreen triangle for efficient full-screen effects. To draw meshes or particles:

1. Create new buffers/VAOs with your vertex attributes.
2. Update `drawArrays`/`drawElements` calls accordingly.
3. Expand the vertex shader to handle your attributes (positions, colors, velocities, etc.).

## Adding more passes or scenes

- Add another scene class under `src/scene/` and instantiate it in `main.ts`.
- For post-processing, render your first pass into an FBO/texture, then feed that texture to a second pass' shader.
- Use the `Renderer`'s `update` callback to advance simulation state before rendering each pass.

## Tips for extensions

- Enable depth testing if you add 3D geometry: `gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);` (do this once after context creation).
- For audio-reactive visuals, feed FFT data into uniforms each frame.
- To keep allocations low, reuse buffers and programs (the boilerplate already does this).

Happy hacking! 🚀
