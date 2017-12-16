import { vec2 } from 'gl-matrix'
import { center, scale } from './constants'

const normalize = (x, scale) => (x / scale) * 2 - 1

export default class MouseController {
  constructor (canvas) {
    this.canvas = canvas
    this.kernel = vec2.fromValues(0, 0)
  }

  init () {
    this.canvas.addEventListener('mousemove', (evt) => {
      const rect = this.canvas.getBoundingClientRect()
      const x = normalize(evt.clientX - rect.left, this.canvas.width)
      const y = -normalize(evt.clientY - rect.top, this.canvas.height)
      const kernel = vec2.fromValues(x, y)
      vec2.mul(kernel, kernel, scale)
      vec2.add(kernel, kernel, center)
      this.kernel = kernel
    })
  }

  animate () {
    return this.kernel
  }
}
