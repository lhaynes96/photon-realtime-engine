export function compileShader(gl: WebGL2RenderingContext, source: string, type: GLenum): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error('Failed to create shader');
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${info ?? 'unknown error'}`);
  }

  return shader;
}

export function createProgram(gl: WebGL2RenderingContext, vertexSrc: string, fragmentSrc: string): WebGLProgram {
  const vertexShader = compileShader(gl, vertexSrc, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, fragmentSrc, gl.FRAGMENT_SHADER);

  const program = gl.createProgram();
  if (!program) {
    throw new Error('Failed to create shader program');
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    throw new Error(`Program link error: ${info ?? 'unknown error'}`);
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  return program;
}
