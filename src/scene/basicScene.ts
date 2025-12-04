import vertexSource from '../shaders/vertex.glsl?raw';
import fragmentSource from '../shaders/fragment.glsl?raw';
import { createProgram } from '../core/shaderProgram';

interface MouseState {
  x: number;
  y: number;
}

export class BasicScene {
  private program: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private positionBuffer: WebGLBuffer;
  private mouse: MouseState = { x: 0, y: 0 };
  private mode = 0;
  private time = 0;

  private uTime: WebGLUniformLocation | null = null;
  private uResolution: WebGLUniformLocation | null = null;
  private uMouse: WebGLUniformLocation | null = null;
  private uMode: WebGLUniformLocation | null = null;

  constructor(private gl: WebGL2RenderingContext) {
    this.program = createProgram(gl, vertexSource, fragmentSource);
    this.vao = this.createQuadVAO();
    this.positionBuffer = this.createPositionBuffer();
    this.cacheUniformLocations();
  }

  private cacheUniformLocations() {
    const { gl, program } = this;
    this.uTime = gl.getUniformLocation(program, 'u_time');
    this.uResolution = gl.getUniformLocation(program, 'u_resolution');
    this.uMouse = gl.getUniformLocation(program, 'u_mouse');
    this.uMode = gl.getUniformLocation(program, 'u_mode');
  }

  private createPositionBuffer(): WebGLBuffer {
    const { gl, program, vao } = this;
    const positions = new Float32Array([
      -1, -1,
      3, -1,
      -1, 3,
    ]);

    const buffer = gl.createBuffer();
    if (!buffer) {
      throw new Error('Failed to create position buffer');
    }

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return buffer;
  }

  private createQuadVAO(): WebGLVertexArrayObject {
    const vao = this.gl.createVertexArray();
    if (!vao) {
      throw new Error('Failed to create VAO');
    }
    return vao;
  }

  update(dt: number, elapsed: number) {
    this.time = elapsed;
  }

  setMousePosition(normalizedX: number, normalizedY: number) {
    this.mouse.x = normalizedX;
    this.mouse.y = normalizedY;
  }

  setMode(mode: number) {
    this.mode = mode;
  }

  render() {
    const { gl } = this;
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);

    if (this.uTime) gl.uniform1f(this.uTime, this.time);
    if (this.uResolution) gl.uniform2f(this.uResolution, gl.canvas.width, gl.canvas.height);
    if (this.uMouse) gl.uniform2f(this.uMouse, this.mouse.x, this.mouse.y);
    if (this.uMode) gl.uniform1i(this.uMode, this.mode);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindVertexArray(null);
    gl.useProgram(null);
  }
}
