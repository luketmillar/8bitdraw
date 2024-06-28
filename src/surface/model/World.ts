import { World } from '../../canvasScene/Shape'
import { Position, Size } from '../../canvasScene/types'
import Layer from './Layer'
import Pixel from './Pixel'
import { PIXEL_SIZE } from './consts'

const initializeBlankSurface = (size: Size) => {
  const pixels: Pixel[][] = []
  for (let i = 0; i < size.width; i++) {
    pixels.push([])
    for (let j = 0; j < size.height; j++) {
      pixels[i].push(new Pixel({ x: i, y: j }, null))
    }
  }
  return new Layer(pixels)
}

export default class SurfaceWorld extends World<Layer> {
  public size: Size
  constructor(size: Size) {
    const layer = initializeBlankSurface(size)
    super([])
    this.size = size
    this.addChild(layer)
  }

  public getLayers() {
    return this.models
  }

  public getActiveLayer() {
    return this.models[0]
  }

  public setColor(x: number, y: number, color: string) {
    this.getActiveLayer().pixels[x][y].color = color
  }

  public unsetColor(x: number, y: number) {
    this.getActiveLayer().pixels[x][y].color = null
  }

  public getSurfacePosition(position: Position): Position {
    return {
      x: Math.floor(position.x / PIXEL_SIZE),
      y: Math.floor(position.y / PIXEL_SIZE),
    }
  }
}
