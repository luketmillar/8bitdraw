import { Color, Position } from '../utils/types'
import Pixel from './Pixel'

export default class SketchOverrides {
  public isOverriding = false
  public overrides: Record<string, Pixel> = {}

  public start() {
    this.clear()
    this.isOverriding = true
  }

  public end() {
    this.isOverriding = false
    this.clear()
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
