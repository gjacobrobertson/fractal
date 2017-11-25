import 'babel-polyfill'
import './index.css'
import { render } from './render'
import controller, { init as initController } from './audio'

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let hue = 0

const draw = async (c) => {
  const image = await render(c, hue)
  ctx.canvas.width = window.innerWidth
  ctx.canvas.height = window.innerHeight
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
}

const animate = async (timestamp) => {
  hue = (hue + 1) % 360
  const c = controller(timestamp)
  await draw(c)
  window.requestAnimationFrame(animate)
}

const init = async () => {
  await initController(canvas)
  animate()
  document.body.appendChild(canvas)
}

init()
