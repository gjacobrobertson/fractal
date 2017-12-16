export default class FallbackController {
  constructor (...controllers) {
    this._controllers = controllers
  }

  async init (canvas) {
    for (let controller of this._controllers) {
      try {
        controller.init && await controller.init(canvas)
        this._controller = controller
        return
      } catch (_) {
        continue
      }
    }
  }

  animate (dt) {
    return this._controller.animate(dt)
  }
}
