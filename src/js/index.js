import 'babel-polyfill'
import '../css/index.css'
import Renderer from './Renderer'
import AudioController from './AudioController'
import MouseController from './MouseController'

const canvas = document.createElement('canvas')

const renderer = new Renderer(canvas)
const mouseController = new MouseController(canvas)
const audioController = new AudioController()

let prev = 0
let hue = 0

const draw = async (c) => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  await renderer.draw(c, hue)
}

const animate = async (timestamp) => {
  const dt = timestamp - prev
  prev = timestamp
  hue = (timestamp / 30000) % 1
  const c = audioController.animate(dt)
  await draw(c)
  window.requestAnimationFrame(animate)
}

const init = async () => {
  await audioController.init()
  animate(0)
  document.body.appendChild(canvas)
}

init()
