import Model from '../../canvasScene/Model/Model'
import { Rectangle, Shape } from '../../canvasScene/Shape'
import { Color, Position } from '../../canvasScene/types'
import { PIXEL_SIZE } from './consts'

export default class Pixel extends Model {
  public position: Position
  private rect: Rectangle
  constructor(position: Position, color: Color | null, opacity?: number) {
    super()
    this.position = position
    this.rect = new Rectangle({
      position: {
        x: position.x * PIXEL_SIZE + PIXEL_SIZE / 2,
        y: position.y * PIXEL_SIZE + PIXEL_SIZE / 2,
      },
      width: PIXEL_SIZE,
      height: PIXEL_SIZE,
      fill: color,
      stroke: { width: 1, color: '#ddd' },
      opacity,
    })
  }

  public get color(): Color | null {
    return this.rect.fill
  }

  public set color(color: Color | null) {
    this.rect.fill = color
  }

  public getShapes(): Shape[] {
    return [this.rect]
  }
}
