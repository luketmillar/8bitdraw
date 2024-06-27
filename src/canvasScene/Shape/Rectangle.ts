import { Color, Position, Stroke } from '../types'
import Shape, { ShapeOptions } from './Shape'
import { createBounds } from '../Bounds'

export type RectangleOptions = {
  width: number
  height: number
  fill?: Color
  stroke?: Stroke
} & ShapeOptions

export default class Rectangle extends Shape {
  public width: number
  public height: number
  public fill?: Color
  public stroke?: Stroke
  constructor(options: RectangleOptions) {
    super(options)
    this.width = options.width
    this.height = options.height
    this.fill = options.fill
    this.stroke = options.stroke
  }

  public intersects(position: Position) {
    const bounds = this.bounds()
    if (position.x < bounds.left) {
      return false
    }
    if (position.x > bounds.right) {
      return false
    }
    if (position.y < bounds.top) {
      return false
    }
    if (position.y > bounds.bottom) {
      return false
    }
    return true
  }

  public bounds() {
    return createBounds({
      middle: this.position.y,
      center: this.position.x,
      height: this.height,
      width: this.width,
    })
  }

  public corners() {
    const bounds = this.bounds()
    const topLeft = { x: bounds.left, y: bounds.top }
    const topRight = { x: bounds.right, y: bounds.top }
    const bottomLeft = { x: bounds.left, y: bounds.bottom }
    const bottomRight = { x: bounds.right, y: bounds.bottom }
    return { topLeft, topRight, bottomLeft, bottomRight }
  }

  public expand(x: number, y: number) {
    return new Rectangle({
      position: this.position,
      width: this.width + x * 2,
      height: this.height + y * 2,
      fill: this.fill,
      stroke: this.stroke,
    })
  }
}
