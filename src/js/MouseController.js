import { vec2 } from 'gl-matrix'
import { center, scale } from './Renderer'

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
      vec2.set(this._target, x, y)
      vec2.mul(this._target, this._target, scale)
      vec2.add(this._target, this._target, center)
    })
  }

  animate (dt) {
    const error = vec2.create()
    const delta = vec2.create()
    vec2.sub(error, this._target, this.kernel)
    vec2.scale(delta, error, dt / 500)
    vec2.add(this.kernel, this.kernel, delta)
    return { kernel: this.kernel }
  }
}
