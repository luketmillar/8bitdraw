import { Bounds, Position } from '../types'
import { v4 as uuid } from 'uuid'

export type ShapeOptions = {
  position: Position
}
export default abstract class Shape {
  public readonly id = uuid()
  public position: Position
  constructor(options: ShapeOptions) {
    this.position = options.position
  }

  public abstract intersects(position: Position): boolean
  public abstract bounds(): Bounds
}
