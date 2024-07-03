import { vec2 } from 'gl-matrix'
import { Color, Position, Size } from '../utils/types'
import { Rectangle } from '../views/Views'
import Model from './Base'

const getCenterPoint = (position: Position, size: Size): Position =>
  vec2.fromValues(position[0] + size[0] / 2, position[1] + size[1] / 2)

export default class Pixel extends Model {
  public position: Position

  public rectangle: Rectangle
  constructor(position: Position, fill: Color | null) {
    super()
    this.position = position
    this.rectangle = new Rectangle(getCenterPoint(position, vec2.fromValues(1, 1)), 1, 1, {
      fill,
    })
  }

  public get fill() {
    return this.rectangle.options.fill ?? null
  }
  public set fill(fill: Color | null) {
    this.rectangle.options.fill = fill
  }

  public getViews() {
    return [this.rectangle]
  }
}
