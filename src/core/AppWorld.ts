import Model from '../models/Base'
import Grid from '../models/Grid'
import Sketch from '../models/Sketch'
import BaseWorld from '../core/BaseWorld'
import { Size } from '../utils/types'

export default class AppWorld extends BaseWorld {
  public sketch: Sketch
  public grid: Grid

  public sketchSize: Size
  public showGrid = true

  constructor(sketchSize: Size) {
    super()
    this.sketchSize = sketchSize
    this.grid = new Grid(sketchSize)
    this.sketch = new Sketch(sketchSize)
  }
  protected createWorld(): void {
    this.sketch = new Sketch(this.sketch.size)
    this.grid = new Grid(this.sketch.size)
  }

  public getModels(): Model[] {
    return [this.grid, this.sketch]
  }
  protected onUpdate = () => {}
}
