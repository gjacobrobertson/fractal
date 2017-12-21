const period = 30000

export default class HueController {
  constructor () {
    this._hue = 0
  }

  animate (dt) {
    this._hue = (this._hue + dt / period) % 1
    return { hue: this._hue }
  }
}
