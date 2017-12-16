export default class CycleController {
  constructor (...controllers) {
    this._controllers = controllers
    this._index = 0
    this._select()
  }

  _select () {
    this._controller = this._controllers[this._index]
  }

  cycle () {
    const kernel = this._controller.kernel
    this._index = (this._index + 1) % this._controllers.length
    this._select()
    this._controller.kernel = kernel
  }

  async init (canvas) {
    for (let controller of this._controllers) {
      controller.init && await controller.init(canvas)
    }
    canvas.addEventListener('click', () => {
      this.cycle()
    })
  }

  animate (dt) {
    return this._controller.animate(dt)
  }
}
