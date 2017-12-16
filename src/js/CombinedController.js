export default class CombinedController {
  constructor (...controllers) {
    this._controllers = controllers
  }

  async init (canvas) {
    for (let controller of this._controllers) {
      controller.init && await controller.init(canvas)
    }
  }

  animate (dt) {
    return this._controllers.map(controller => controller.animate(dt))
    .reduce((merged, opts) => Object.assign(merged, opts))
  }
}
