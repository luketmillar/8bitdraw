import { Rectangle } from '../views/Views'
import Model from './Base'

const PIXEL_SIZE = 50

export default class Pixel extends Model {
  public readonly x: number
  public readonly y: number
  public rectangle: Rectangle
  constructor(x: number, y: number) {
    super()
    this.x = x
    this.y = y
    this.rectangle = new Rectangle(
      { x: x * PIXEL_SIZE + PIXEL_SIZE / 2, y: y * PIXEL_SIZE + PIXEL_SIZE / 2 },
      PIXEL_SIZE,
      PIXEL_SIZE,
      { fill: '#0ff' }
    )
  }

  public getViews() {
    return [this.rectangle]
  }
}
