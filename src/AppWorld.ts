import Sketch from './models/Sketch'
import BaseWorld from './mvc/BaseWorld'
import { Size } from './utils/types'

export default class AppWorld extends BaseWorld {
  public sketch: Sketch
  constructor(sketchSize: Size) {
    super()
    this.sketch = new Sketch(sketchSize)
  }
  protected createWorld(): void {
    this.sketch = new Sketch(this.sketch.size)
    this.addObject(this.sketch)
  }
  protected onUpdate = () => {}
}
