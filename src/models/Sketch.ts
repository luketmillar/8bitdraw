import { Color, Position, Size } from '../utils/types'
import Model from './Base'
import Pixel from './Pixel'

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

class Overrides {
  public isOverriding = false
  public overrides: Record<string, Pixel> = {}

  public start() {
    this.clear()
    this.isOverriding = true
  }

  public end(clear: boolean = true) {
    this.isOverriding = false
    if (clear) this.clear()
  }

  public getAll() {
    return this.overrides
  }

  public set(position: Position, color: Color | null) {
    this.overrides[this.createKey(position)] = new Pixel(position, color)
  }

  public get(position: Position): Color | null | undefined {
    const pixel = this.overrides[this.createKey(position)]
    if (pixel === undefined) return undefined
    return pixel.fill
  }

  public getPixel(position: Position): Pixel | undefined {
    return this.overrides[this.createKey(position)]
  }

  public unset(position: Position) {
    delete this.overrides[this.createKey(position)]
  }

  public clear() {
    this.overrides = {}
  }

  public hasOverride(position: Position) {
    return !!this.overrides[this.createKey(position)]
  }

  private createKey(position: Position) {
    return `${position.x}, ${position.y}`
  }
}

export default class Sketch extends Model {
  public size: Size
  public pixels: Pixel[][] = []

  public overrides: Overrides

  constructor(size: Size) {
    super()
    this.size = size
    this.pixels = createPixels(size)
    this.overrides = new Overrides()
  }

  public setColor(position: Position, color: Color | null) {
    if (this.overrides.isOverriding) {
      this.overrides.set(position, color)
    } else {
      this.getPixel(position).fill = color
    }
  }

  public getColor(position: Position, includeOverride?: boolean): Color | null {
    if (includeOverride) {
      const overridePixel = this.overrides.getPixel(position)
      if (overridePixel !== undefined) return overridePixel.fill
    }
    return this.getPixel(position).fill
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

  public startOverrides() {
    this.overrides.start()
  }
  public cancelOverrides() {
    this.overrides.clear()
    this.overrides.end()
  }
  public resetOverrides() {
    this.overrides.clear()
  }
  public commitOverrides() {
    this.overrides.end(false)
    const overrides = this.overrides.getAll()
    Object.values(overrides).forEach((pixel) => {
      this.setColor(pixel.position, pixel.fill)
    })
    this.overrides.clear()
  }

  private getPixel(position: Position): Pixel {
    return this.pixels[position.x][position.y]
  }
}
