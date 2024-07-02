import Overrideable from '../utils/Overrideable'
import { Color, Position, Size } from '../utils/types'
import Model from './Base'
import Pixel from './Pixel'

const pixelKey = (position: Position) => `${position.x},${position.y}`

const createPixels = (pixels: Overrideable<Pixel>, size: Size) => {
  pixels.clear()
  for (let x = 0; x < size.width; x++) {
    for (let y = 0; y < size.height; y++) {
      pixels.set(pixelKey({ x, y }), new Pixel({ x, y }, null))
    }
  }
}

class Layer extends Model {
  public pixels = new Overrideable<Pixel>()

  constructor(size: Size) {
    super()
    createPixels(this.pixels, size)
  }

  public getViews() {
    return this.pixels
      .getAll()
      .map((pixel) => pixel.getViews())
      .flat()
  }
}

export default class Sketch extends Model {
  public size: Size
  public layers: Layer[] = []

  constructor(size: Size) {
    super()
    this.size = size
    this.layers = [new Layer(size)]
  }

  public get activeLayer() {
    return this.layers[0]
  }

  public setColor(position: Position, color: Color | null) {
    this.activeLayer.pixels.set(pixelKey(position), new Pixel(position, color))
  }

  public getColor(position: Position): Color | null {
    return this.activeLayer.pixels.get(pixelKey(position))?.fill ?? null
  }

  public getViews() {
    return this.layers.map((layer) => layer.getViews()).flat()
  }

  public startOverrides() {
    this.activeLayer.pixels.start()
  }
  public cancelOverrides() {
    this.activeLayer.pixels.cancel()
  }
  public resetOverrides() {
    this.activeLayer.pixels.clearOverrides()
  }
  public commitOverrides() {
    this.activeLayer.pixels.commit()
  }
}
