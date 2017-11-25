import { width, height } from './constants'
import RenderWorker from './render.worker.js'

const canvas = document.createElement('canvas')
canvas.width = width
canvas.height = height
const ctx = canvas.getContext('2d')
const image = ctx.getImageData(0, 0, width, height)

const workers = Array(navigator.hardwareConcurrency).fill().map(_ => new RenderWorker())
const rowsPerWorker = Math.floor(height / workers.length)

const ranges = workers.map((_, i) => {
  const min = rowsPerWorker * i
  const max = min + rowsPerWorker
  return {min, max}
})

const buffers = workers.map(_ => new ArrayBuffer(width * rowsPerWorker * 4))

export const render = ([re, im], hue) => {
  let responses = workers.map((worker, i) => new Promise((resolve, reject) => {
    const range = ranges[i]
    const buffer = buffers[i]
    worker.onmessage = ({data}) => {
      // console.log(`Received Buffer ${i}: ${data.byteLength}`)
      buffers[i] = data
      resolve(data)
    }
    // console.log(`Sending Buffer ${i}: ${buffer.byteLength}`)
    worker.postMessage({ buffer, range, re, im, hue }, [buffer])
    // console.log(`Sent Buffer ${i}: ${buffer.byteLength}`)
  }))
  return Promise.all(responses).then(responses => {
    return responses.forEach((buf, i) => {
      const buf8 = new Uint8ClampedArray(buf)
      image.data.set(buf8, i * buf8.byteLength)
      ctx.putImageData(image, 0, 0)
    })
  })
  .then(_ => canvas)
}
