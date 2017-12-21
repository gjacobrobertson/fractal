const fftSize = 256
const pi2 = Math.PI * 2
const correctionLimit = 0.8
const correctionAlpha = 0.5
const deltaFactor = 0.5

const sign = (n) => 2 * (n % 2) - 1

export default class AudioController {
  constructor () {
    this.kernel = [0, 0]
    this._theta = 0
  }

  async init () {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true})
    const context = new window.AudioContext()
    const source = context.createMediaStreamSource(stream)
    this._analyser = context.createAnalyser()
    this._analyser.fftSize = fftSize
    this._freqs = new Uint8Array(this._analyser.frequencyBinCount)
    source.connect(this._analyser)
  }

  _getIntensity (dt) {
    const sum = this._freqs.reduce((acc, f) => acc + f)
    const mean = sum / this._freqs.length
    return (mean / 256) * (dt / 500)
  }

  _getTheta (dt) {
    const sum = this._freqs.reduce((acc, f, i) => acc + f * (i + 1) * sign(i + 1))
    let delta = deltaFactor * Math.sign(sum) * Math.log(1 + Math.abs(sum))

    const norm = this.kernel.map(x => x ** 2).reduce((x, y) => x + y)
    if (norm > correctionLimit) {
      delta += this._correction()
    }

    this._theta += delta * (dt / 500)
    return this._theta
  }

  _correction () {
    let [re, im] = this.kernel
    const kernelTheta = Math.atan2(im, re)
    const target = (kernelTheta + Math.PI) % pi2
    let diff = (target - this._theta)
    while (Math.abs(diff) > Math.PI) {
      diff = diff - Math.sign(diff) * pi2
    }
    return diff * correctionAlpha
  }

  animate (dt) {
    dt = Math.min(dt, 1000)
    this._analyser.getByteFrequencyData(this._freqs)
    const theta = this._getTheta(dt)
    const intensity = this._getIntensity(dt)
    this.kernel[0] += intensity * Math.cos(theta)
    this.kernel[1] += intensity * Math.sin(theta)
    return { kernel: this.kernel }
  }
}
