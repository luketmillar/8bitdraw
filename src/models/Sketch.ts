import { Size } from '../utils/types'
import Model from './Base'
import Pixel from './Pixel'

const createPixels = (size: Size) => {
  const pixels: Pixel[][] = []
  for (let x = 0; x < size.width; x++) {
    pixels[x] = []
    for (let y = 0; y < size.height; y++) {
      pixels[x][y] = new Pixel({ x, y }, null)
    }
  }
  return pixels
}

export default class Sketch extends Model {
  public size: Size
  public pixels: Pixel[][] = []
  constructor(size: Size) {
    super()
    this.size = size
    this.pixels = createPixels(size)
  }

  public getViews() {
    return this.pixels
      .flat()
      .map((pixel) => pixel.getViews())
      .flat()
  }
}
