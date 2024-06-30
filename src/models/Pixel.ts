import { Color, Position } from '../utils/types'
import { Rectangle } from '../views/Views'
import Model from './Base'

export default class Pixel extends Model {
  public position: Position

  public rectangle: Rectangle
  constructor(position: Position, fill: Color | null) {
    super()
    this.position = position
    this.rectangle = new Rectangle({ x: 100, y: 200 }, 100, 150, { fill })
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
