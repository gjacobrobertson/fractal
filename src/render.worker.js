/* eslint-env serviceworker */
import { width, height, iterations } from './constants'
import complex from './plane'
import { julia } from './escapeTime'
import {smooth, hsv} from './color'

const transform = complex(width, height, 0, 0, width / height * 2.5, 2.5)

const drawJulia = (re, im, hue) => {
  const color = hsv(iterations, hue)
  const escapeTime = julia(iterations, re, im)
  return (x, y) => color(smooth(escapeTime(transform([x, y]))))
}

const draw = (options) => {
  const { buffer, range, re, im, hue } = options
  const data = new Uint32Array(buffer)

  const getPixel = drawJulia(re, im, hue)

  let offset = 0
  let x
  let y
  for (y = range.min; y < range.max; y++) {
    for (x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y)
      data[offset++] =
        a << 24 |
        b << 16 |
        g << 8 |
        r
    }
  }
  return buffer
}

self.addEventListener('message', ({data}) => {
  draw(data)
  self.postMessage(data.buffer, [data.buffer])
})
