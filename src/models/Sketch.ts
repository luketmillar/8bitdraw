import { Size } from '../utils/types'
import Model from './Base'
import Pixel from './Pixel'

export default class Sketch extends Model {
  public size: Size
  public pixel: Pixel
  constructor(size: Size) {
    super()
    this.size = size
    this.pixel = new Pixel({ x: 0, y: 0 }, '#0ff')
  }

  public getViews() {
    return this.pixel.getViews()
  }
}
