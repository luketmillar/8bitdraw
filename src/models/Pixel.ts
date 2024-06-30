import { Color, Position, Size } from '../utils/types'
import { Rectangle } from '../views/Views'
import Model from './Base'

const getCenterPoint = (position: Position, size: Size): Position => ({
  x: position.x + size.width / 2,
  y: position.y + size.height / 2,
})

export default class Pixel extends Model {
  public position: Position

  public rectangle: Rectangle
  constructor(position: Position, fill: Color | null) {
    super()
    this.position = position
    this.rectangle = new Rectangle(getCenterPoint(position, { width: 1, height: 1 }), 1, 1, {
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
