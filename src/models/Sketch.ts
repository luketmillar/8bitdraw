import { Color, Position, Size } from '../utils/types'
import Model from './Base'
import Pixel from './Pixel'
import SketchOverrides from './SketchOverrides'

const createPixels = (size: Size) => {
  const pixels: Pixel[][] = []
  for (let x = 0; x < size.width; x++) {
    pixels[x] = []
    for (let y = 0; y < size.height; y++) {
      pixels[x][y] = new Pixel({ x, y }, null)
    }
  }
  return pixels
}

class Layer extends Model {
  public pixels: Pixel[][] = []

  public overrides: SketchOverrides

  constructor(size: Size) {
    super()
    this.pixels = createPixels(size)
    this.overrides = new SketchOverrides()
  }

  public getViews() {
    return this.pixels
      .flat()
      .map((pixel) => {
        if (this.overrides.hasOverride(pixel.position)) {
          return this.overrides.getPixel(pixel.position)!
        }
        return pixel
      })
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
    if (this.activeLayer.overrides.isOverriding) {
      this.activeLayer.overrides.set(position, color)
    } else {
      this.getPixel(position).fill = color
    }
  }

  public getColor(position: Position, includeOverride?: boolean): Color | null {
    if (includeOverride) {
      const overridePixel = this.activeLayer.overrides.getPixel(position)
      if (overridePixel !== undefined) return overridePixel.fill
    }
    return this.getPixel(position).fill
  }

  public getViews() {
    return this.layers
      .map((layer) =>
        layer.pixels
          .flat()
          .map((pixel) => {
            if (this.activeLayer.overrides.hasOverride(pixel.position)) {
              return this.activeLayer.overrides.getPixel(pixel.position)!
            }
            return pixel
          })
          .map((pixel) => pixel.getViews())
          .flat()
      )
      .flat()
  }

  public startOverrides() {
    this.activeLayer.overrides.start()
  }
  public cancelOverrides() {
    this.activeLayer.overrides.clear()
    this.activeLayer.overrides.end()
  }
  public resetOverrides() {
    this.activeLayer.overrides.clear()
  }
  public commitOverrides() {
    const overrides = this.activeLayer.overrides.getAll()
    this.activeLayer.overrides.end()
    Object.values(overrides).forEach((pixel) => {
      this.setColor(pixel.position, pixel.fill)
    })
  }

  private getPixel(position: Position): Pixel {
    return this.activeLayer.pixels[position.x][position.y]
  }
}
