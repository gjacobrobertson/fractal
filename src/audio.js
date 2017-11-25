let analyser
let freqs

let re = 0
let im = 0
let theta = 0

const pi2 = Math.PI * 2

const factor = Math.PI / 180

const sign = (i) => {
  const n = i + 1
  const mod = n % 2
  return 2 * mod - 1
}

const getIntensity = () => {
  const sum = freqs.reduce((acc, f, i) => acc + f)
  const mean = sum / freqs.length
  return mean / (256 * 10)
}

const getTheta = () => {
  const sum = freqs.reduce((acc, f, i) => acc + f * (i + 1) * sign(i))
  const delta = 0.5 * Math.log(1 + Math.abs(sum)) * Math.sign(sum) / 20
  const norm = re ** 2 + im ** 2
  if (norm > 0.8) {
    const kernelTheta = Math.atan2(im, re)
    const target = (kernelTheta + Math.PI) % pi2
    let diff = (target - theta)
    while (Math.abs(diff) > Math.PI) {
      diff = diff - Math.sign(diff) * pi2
    }
    const correction = diff * 0.5
    console.log([theta / factor, target / factor, correction / factor, re, im])
    theta += correction
  }
  theta += delta
  return theta
}

export const init = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({audio: true})
  const context = new window.AudioContext()
  const source = context.createMediaStreamSource(stream)
  analyser = context.createAnalyser()
  analyser.fftSize = 256
  freqs = new Uint8Array(analyser.frequencyBinCount)
  source.connect(analyser)
}

export default () => {
  analyser.getByteFrequencyData(freqs)
  const theta = getTheta()
  const intensity = getIntensity()
  // console.log(theta, intensity)
  re += intensity * Math.cos(theta)
  im += intensity * Math.sin(theta)
  return [re, im]
}
