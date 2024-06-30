import BaseObject from './Base'
import * as Shapes from './Shapes'

const PIXEL_SIZE = 50

export default class Pixel extends BaseObject {
  public readonly x: number
  public readonly y: number
  public rectangle: Shapes.Rectangle
  constructor(x: number, y: number) {
    super()
    this.x = x
    this.y = y
    this.rectangle = new Shapes.Rectangle(
      { x: x * PIXEL_SIZE + PIXEL_SIZE / 2, y: y * PIXEL_SIZE + PIXEL_SIZE / 2 },
      PIXEL_SIZE,
      PIXEL_SIZE,
      { fill: '#0ff' }
    )
  }

  public getShapes() {
    return [this.rectangle]
  }
}
