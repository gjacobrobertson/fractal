import { vec2 } from 'gl-matrix'
import { center, scale } from './constants'

const normalize = (x, scale) => (x / scale) * 2 - 1

export default class MouseController {
  constructor () {
    this.kernel = vec2.fromValues(0, 0)
    this._target = vec2.fromValues(0, 0)
  }

  init (canvas) {
    canvas.addEventListener('mousemove', (evt) => {
      const rect = canvas.getBoundingClientRect()
      const x = normalize(evt.clientX - rect.left, canvas.width)
      const y = -normalize(evt.clientY - rect.top, canvas.height)
      this._target = vec2.fromValues(x, y)
    })
  }

  animate (dt) {
    const target = vec2.clone(this._target)
    vec2.mul(target, target, scale)
    vec2.add(target, target, center)
    vec2.sub(target, target, this.kernel)
    vec2.scale(target, target, dt / 500)
    vec2.add(this.kernel, this.kernel, target)
    return { kernel: this.kernel }
  }
}
