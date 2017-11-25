const logBase = 1.0 / Math.log(2.0)
const logHalfBase = Math.log(0.5) * logBase

/*
 * Convert hue-saturation-value/luminosity to RGB.
 *
 * Input ranges:
 *   H =   [0, 360] (integer degrees)
 *   S = [0.0, 1.0] (float)
 *   V = [0.0, 1.0] (float)
 */
const hsvToRgb = (h, s, v) => {
  if (v > 1.0) v = 1.0
  var hp = h / 60.0
  var c = v * s
  var x = c * (1 - Math.abs((hp % 2) - 1))
  var rgb = [0, 0, 0]

  if (hp >= 0 && hp < 1) rgb = [c, x, 0]
  if (hp >= 1 && hp < 2) rgb = [x, c, 0]
  if (hp >= 2 && hp < 3) rgb = [0, c, x]
  if (hp >= 3 && hp < 4) rgb = [0, x, c]
  if (hp >= 4 && hp < 5) rgb = [x, 0, c]
  if (hp >= 5 && hp < 6) rgb = [c, 0, x]

  var m = v - c
  rgb[0] += m
  rgb[1] += m
  rgb[2] += m

  rgb[0] *= 255
  rgb[1] *= 255
  rgb[2] *= 255
  return rgb
}

export const smooth = ([n, tRe, tIm]) => {
  return n && (5 + n - logHalfBase - Math.log(Math.log(tRe + tIm)) * logBase)
}

export const grayscale = iterations => {
  let scale = 256 / iterations
  return v => {
    v = scale * v % 256
    return [v, v, v, 255]
  }
}

export const hsv = (iterations, hue = 0) => {
  let hScale = 360 / iterations
  let vScale = 5 / iterations
  return v => {
    if (!v) {
      let rgb = hsvToRgb((hue + 270) % 360, 1, 0.5)
      rgb.push(255)
      return rgb
    }
    let h = (hue + (v * hScale)) % 360
    let rgb = hsvToRgb(h, 1, v * vScale)
    rgb.push(255)
    return rgb
  }
}
