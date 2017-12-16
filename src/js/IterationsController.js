const minIterations = 50
const maxIterations = 500
const range = maxIterations - minIterations

const base = 5
const period = 40000

export default class IterationsController {
  constructor () {
    this._time = 0
  }

  animate (dt) {
    this._time += dt
    let iterations = base ** (Math.sin(this._time * 2 * Math.PI / period) + 1)
    iterations -= 1
    iterations = iterations * (range / ((base ** 2) - 1))
    iterations = Math.floor(minIterations + iterations)
    return { iterations }
  }
}
