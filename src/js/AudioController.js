const fftSize = 256
const pi2 = Math.PI * 2

const sign = (n) => {
  const mod = n % 2
  return 2 * mod - 1
}

const correctionLimit = 0.8
const correctionAlpha = 0.5
const deltaFactor = 0.5

export default class AudioController {
  constructor () {
    this.kernel = [0, 0]
    this.theta = 0
    this.timestamp = 0
  }

  async init () {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true})
    const context = new window.AudioContext()
    const source = context.createMediaStreamSource(stream)
    this.analyser = context.createAnalyser()
    this.analyser.fftSize = fftSize
    this.freqs = new Uint8Array(this.analyser.frequencyBinCount)
    source.connect(this.analyser)
  }

  _intensity (dt) {
    const sum = this.freqs.reduce((acc, f) => acc + f)
    const mean = sum / this.freqs.length
    return (mean / 256) * (dt / 500)
  }

  _theta (dt) {
    const sum = this.freqs.reduce((acc, f, i) => acc + f * (i + 1) * sign(i + 1))
    let delta = deltaFactor * Math.sign(sum) * Math.log(1 + Math.abs(sum))

    const norm = this.kernel.map(x => x ** 2).reduce((x, y) => x + y)
    if (norm > correctionLimit) {
      delta += this._correction()
    }

    this.theta += delta * (dt / 500)
    return this.theta
  }

  _correction () {
    let [re, im] = this.kernel
    const kernelTheta = Math.atan2(im, re)
    const target = (kernelTheta + Math.PI) % pi2
    let diff = (target - this.theta)
    while (Math.abs(diff) > Math.PI) {
      diff = diff - Math.sign(diff) * pi2
    }
    return diff * correctionAlpha
  }

  animate (dt) {
    this.analyser.getByteFrequencyData(this.freqs)
    const theta = this._theta(dt)
    const intensity = this._intensity(dt)
    this.kernel[0] += intensity * Math.cos(theta)
    this.kernel[1] += intensity * Math.sin(theta)
    return this.kernel
  }
}
