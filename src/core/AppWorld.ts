import Model from '../models/Base'
import Grid from '../models/Grid'
import Sketch from '../models/Sketch'
import BaseWorld from '../core/BaseWorld'
import { Size } from '../utils/types'
import EventBus from '../eventbus/EventBus'

export default class AppWorld extends BaseWorld {
  public sketch: Sketch
  public grid: Grid

  public sketchSize: Size
  public showGrid = true

  constructor(sketchSize: Size) {
    super()
    this.sketchSize = sketchSize
    this.sketch = new Sketch({ size: sketchSize })
    this.grid = new Grid(sketchSize)
  }
  protected createWorld(): void {
    this.sketch = new Sketch({ size: this.sketchSize })
    this.grid = new Grid(this.sketch.size)
  }

  public loadSketch(sketch: Sketch) {
    this.sketchSize = sketch.size
    this.sketch = sketch
    this.grid = new Grid(this.sketch.size)
    EventBus.emit('sketch', 'changed', '')
  }

  public getModels(): Model[] {
    return [this.grid, this.sketch]
  }
  protected onUpdate = () => {}
}
