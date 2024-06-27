import Model from '../../canvasScene/Model/Model'
import { Shape } from '../../canvasScene/Shape'
import Pixel from './Pixel'

export default class Layer extends Model {
  public pixels: Pixel[][]
  constructor(pixels: Pixel[][]) {
    super()
    this.pixels = pixels
  }
  public getShapes(): Shape[] {
    return this.pixels.flat().flatMap((pixel) => pixel.getShapes())
  }
}
