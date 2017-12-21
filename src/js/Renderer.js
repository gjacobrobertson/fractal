import { vec2 } from 'gl-matrix'
import plane from '../glsl/plane.vertex.glsl'
import julia from '../glsl/julia.fragment.glsl'

export const center = vec2.fromValues(0, 0)
export const scale = vec2.fromValues(2, 1.5)

const vertices = [
  1.0, 1.0,
  -1.0, 1.0,
  1.0, -1.0,
  -1.0, -1.0
]

export default class Renderer {
  constructor (canvas) {
    this._gl = canvas.getContext('webgl')
    const vertexShader = this._initShader(this._gl.VERTEX_SHADER, plane)
    const fragmentShader = this._initShader(this._gl.FRAGMENT_SHADER, julia)
    this._initProgram(vertexShader, fragmentShader)
    this._initVertices()
    this._initUniforms()
  }

  _initShader (type, source) {
    const shader = this._gl.createShader(type)
    this._gl.shaderSource(shader, source)
    this._gl.compileShader(shader)
    if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
      console.error(this._gl.getShaderInfoLog(shader))
    }
    return shader
  }

  _initProgram (...shaders) {
    const program = this._gl.createProgram()
    shaders.forEach(this._gl.attachShader.bind(this._gl, program))
    this._gl.linkProgram(program)
    this._gl.useProgram(program)
    this._program = program
  }

  _initVertices () {
    const vertexBuffer = this._gl.createBuffer()
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertexBuffer)
    this._gl.bufferData(
      this._gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this._gl.STATIC_DRAW
    )
    const vertexLocation = this._gl.getAttribLocation(this._program, 'aVertex')
    this._gl.vertexAttribPointer(vertexLocation, 2, this._gl.FLOAT, false, 0, 0)
    this._gl.enableVertexAttribArray(vertexLocation)
  }

  _initUniforms () {
    this._locations = {
      kernel: this._gl.getUniformLocation(this._program, 'uKernel'),
      hue: this._gl.getUniformLocation(this._program, 'uHue'),
      center: this._gl.getUniformLocation(this._program, 'uCenter'),
      scale: this._gl.getUniformLocation(this._program, 'uScale'),
      iterations: this._gl.getUniformLocation(this._program, 'uIterations')
    }
    this._gl.uniform2fv(this._locations.center, center)
    this._gl.uniform2fv(this._locations.scale, scale)
  }

  draw ({kernel, hue, iterations}) {
    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height)
    this._gl.uniform2fv(this._locations.kernel, new Float32Array(kernel))
    this._gl.uniform1f(this._locations.hue, hue)
    this._gl.uniform1i(this._locations.iterations, iterations)
    this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4)
  }
}
