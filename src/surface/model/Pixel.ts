import Model from '../../canvasScene/Model/Model'
import { Rectangle, Shape } from '../../canvasScene/Shape'

export default class Pixel extends Model {
  public color: string | null
  public opacity: number
  private rect: Rectangle
  constructor(color: string | null, opacity?: number) {
    super()
    this.color = color
    this.opacity = opacity ?? 1
    this.rect = new Rectangle({
      width: 100,
      height: 100,
      position: { x: 0, y: 0 },
      stroke: { color: '#bbb', width: 1 },
    })
  }
  public getShapes(): Shape[] {
    return [this.rect]
  }
}
