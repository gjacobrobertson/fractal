import complex from './plane'

let canvas
let re = 0
let im = 0
const onMouseMove = (evt) => {
  const rect = canvas.getBoundingClientRect()
  const x = evt.clientX - rect.left
  const y = evt.clientY - rect.top
  const transform = complex(canvas.width, canvas.height, 0, 0, canvas.width / canvas.height * 2.5, 2.5)
  const c = transform([x, y])
  console.log(c)
  re = c[0]
  im = c[1]
}

export const init = (canv) => {
  canvas = canv
  canvas.addEventListener('mousemove', onMouseMove)
}

export default () => [re, im]
