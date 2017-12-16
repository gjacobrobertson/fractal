import 'babel-polyfill'
import '../css/index.css'
import Renderer from './Renderer'
import AudioController from './AudioController'
import MouseController from './MouseController'
import CycleController from './CycleController'
import HueController from './HueController'
import CombinedController from './CombinedController'
import IterationsController from './IterationsController'

const canvas = document.createElement('canvas')

const renderer = new Renderer(canvas)
const mouseController = new MouseController()
const audioController = new AudioController()
const kernelController = new CycleController(audioController, mouseController)
const hueController = new HueController()
const iterationsController = new IterationsController()
const controller = new CombinedController(kernelController, hueController, iterationsController)

let prev = 0

const resize = () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

const animate = (timestamp) => {
  resize()
  const dt = timestamp - prev
  prev = timestamp
  const options = controller.animate(dt)
  renderer.draw(options)
  window.requestAnimationFrame(animate)
}

const init = async () => {
  document.body.appendChild(canvas)
  controller.init && await controller.init(canvas)
  animate(0)
}

init()
