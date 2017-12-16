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
    console.log(this.gl.getShaderInfoLog(shader))
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
    this._locations = {
      kernel: this.gl.getUniformLocation(this.program, 'uKernel'),
      hue: this.gl.getUniformLocation(this.program, 'uHue'),
      center: this.gl.getUniformLocation(this.program, 'uCenter'),
      scale: this.gl.getUniformLocation(this.program, 'uScale'),
      iterations: this.gl.getUniformLocation(this.program, 'uIterations')
    }
    this.gl.uniform2fv(this._locations.center, center)
    this.gl.uniform2fv(this._locations.scale, scale)
  }

  draw ({kernel, hue, iterations}) {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.gl.uniform2fv(this._locations.kernel, new Float32Array(kernel))
    this.gl.uniform1f(this._locations.hue, hue)
    this.gl.uniform1i(this._locations.iterations, iterations)
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
  }
}
