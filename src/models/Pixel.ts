import { vec2 } from 'gl-matrix'
import { Position, Size } from '../utils/types'
import { Rectangle } from '../views/Views'
import Model from './Base'
import { PixelJSON } from '../api/JSON'
import { Color } from './Color'

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

  public static fromJSON(json: PixelJSON): Pixel {
    return new Pixel(
      vec2.fromValues(json.position.x, json.position.y),
      json.fill ? Color.fromJSON(json.fill) : null
    )
  }

  public toJSON(): PixelJSON {
    return {
      position: {
        x: this.position[0],
        y: this.position[1],
      },
      fill: this.fill?.toJSON() ?? null,
    }
  }
}
