const period = 30000

export default class HueController {
  constructor () {
    this.hue = 0
  }

  animate (dt) {
    this.hue = (this.hue + dt / period) % 1
    return { hue: this.hue }
  }
}
