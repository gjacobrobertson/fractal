const escapeTime = (iterations, radius, re, im) => ([cRe, cIm]) => {
  let zRe = cRe
  let zIm = cIm
  let tRe = zRe * zRe
  let tIm = zIm * zIm
  let kIm = im != null ? im : cIm
  let kRe = re != null ? re : cRe
  let step = 0
  for (step = 0; step < iterations; step++) {
    if ((tRe + tIm) > radius) {
      return [step, tRe, tIm]
    }
    zIm = 2 * zRe * zIm + kIm
    zRe = (tRe - tIm) + kRe
    tRe = zRe * zRe
    tIm = zIm * zIm
  }
  return [null, tRe, tIm]
}

export const mandelbrot = (iterations) => escapeTime(iterations, 4)
export const julia = (iterations, re, im) => escapeTime(iterations, 10, re, im)
