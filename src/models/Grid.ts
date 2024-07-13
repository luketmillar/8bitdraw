import { vec2 } from 'gl-matrix'
import { Color, Size } from '../utils/types'
import { Circle } from '../views/Views'
import Model from './Base'

const createGridDots = (size: Size, color: Color) => {
  const dots: Circle[] = []
  for (let x = -10; x <= size[0] + 10; x++) {
    for (let y = -10; y <= size[1] + 10; y++) {
      dots.push(
        new Circle(vec2.fromValues(x, y), 1 / 35, {
          fill: color,
        })
      )
    }
  }
  return dots
}

export default class Grid extends Model {
  public size: Size
  private gridDots: Circle[] = []
  constructor(size: Size) {
    super()
    this.size = size
    this.gridDots = createGridDots(size, '#AEBCC9')
  }

  public getViews() {
    return this.gridDots
  }
}
