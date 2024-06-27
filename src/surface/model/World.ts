import { World } from '../../canvasScene/Shape'
import { Size } from '../../canvasScene/types'
import Layer from './Layer'
import Pixel from './Pixel'

const initializeSurface = (size: Size) => {
  const pixels: Pixel[][] = []
  for (let i = 0; i < size.width; i++) {
    pixels.push([])
    for (let j = 0; j < size.height; j++) {
      pixels[i].push(new Pixel(null))
    }
  }
  return new Layer(pixels)
}

export default class SurfaceWorld extends World {
  public size: Size
  public layers: Layer[]
  constructor(size: Size) {
    const layer = initializeSurface(size)
    super([layer])
    this.layers = [layer]
    this.size = size
  }
}
