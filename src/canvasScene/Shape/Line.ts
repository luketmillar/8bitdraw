import { Color, Position } from '../types'
import Shape, { ShapeOptions } from './Shape'
import { createBounds } from '../Bounds'

export type LineOptions = {
  start: Position
  end: Position
  color: Color
  thickness: number
} & Omit<ShapeOptions, 'position'>

export default class Line extends Shape {
  public end: Position
  public color: Color
  public thickness: number
  public get start() {
    return this.position
  }
  constructor(options: LineOptions) {
    const shapeOptions = { position: options.start }
    super(shapeOptions)
    this.end = options.end
    this.color = options.color
    this.thickness = options.thickness
  }

  public intersects() {
    return false
  }

  public bounds() {
    return createBounds({
      top: Math.min(this.start.y, this.end.y),
      bottom: Math.max(this.start.y, this.end.y),
      left: Math.min(this.start.x, this.end.x),
      right: Math.max(this.start.x, this.end.x),
    })
  }
}
