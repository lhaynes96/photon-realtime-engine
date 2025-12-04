export function createGLContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
  const gl = canvas.getContext('webgl2', {
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });

  if (!gl) {
    throw new Error('Unable to initialize WebGL2. Your browser may not support it.');
  }

  gl.getExtension('OES_standard_derivatives');
  gl.clearColor(0.04, 0.04, 0.07, 1.0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  return gl;
}
