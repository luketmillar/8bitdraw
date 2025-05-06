import { vec2 } from 'gl-matrix'
import { Size } from '../utils/types'
import { GridLines } from '../views/Views'
import Model from './Base'

export default class Grid extends Model {
  public size: Size
  private gridLines: GridLines

  constructor(size: Size) {
    super()
    this.size = size
    this.gridLines = new GridLines(vec2.fromValues(size[0], size[1]), vec2.fromValues(1, 1))
  }

  public getViews() {
    return [this.gridLines]
  }
}
