import { center, scale } from './constants'
import plane from '../glsl/plane.vertex.glsl'
import julia from '../glsl/julia.fragment.glsl'

const vertices = [
  1.0, 1.0,
  -1.0, 1.0,
  1.0, -1.0,
  -1.0, -1.0
]

export default class Renderer {
  constructor (canvas) {
    this.gl = canvas.getContext('webgl')
    const vertexShader = this._initShader(this.gl.VERTEX_SHADER, plane)
    const fragmentShader = this._initShader(this.gl.FRAGMENT_SHADER, julia)
    this._initProgram(vertexShader, fragmentShader)
    this._initVertices()
    this._initUniforms()
  }

  _initShader (type, source) {
    const shader = this.gl.createShader(type)
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)
    return shader
  }

  _initProgram (...shaders) {
    const program = this.gl.createProgram()
    shaders.forEach(this.gl.attachShader.bind(this.gl, program))
    this.gl.linkProgram(program)
    this.gl.useProgram(program)
    this.program = program
  }

  _initVertices () {
    const vertexBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.STATIC_DRAW
    )
    const vertexLocation = this.gl.getAttribLocation(this.program, 'aVertex')
    this.gl.vertexAttribPointer(vertexLocation, 2, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(vertexLocation)
  }

  _initUniforms () {
    this.kernelLocation = this.gl.getUniformLocation(this.program, 'uKernel')
    this.hueLocation = this.gl.getUniformLocation(this.program, 'uHue')
    this.centerLocation = this.gl.getUniformLocation(this.program, 'uCenter')
    this.scaleLocation = this.gl.getUniformLocation(this.program, 'uScale')
    this.gl.uniform2fv(this.centerLocation, center)
    this.gl.uniform2fv(this.scaleLocation, scale)
  }

  draw (kernel, hue) {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.gl.uniform2fv(this.kernelLocation, new Float32Array(kernel))
    this.gl.uniform1f(this.hueLocation, hue)
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
  }
}
