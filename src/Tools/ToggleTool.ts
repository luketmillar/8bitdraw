import { Position } from '../utils/types'
import Tool from './Tool'

export default class ToggleTool extends Tool {
  public onMouseDown(position: Position) {
    const currentColor = this.controller.world.sketch.getColor(position)
    if (!currentColor) {
      this.controller.world.sketch.setColor(position, '#0ff')
    } else {
      this.controller.world.sketch.setColor(position, null)
    }
  }

  public onMouseUp() {}

  public onMouseMove() {}

  public onUpdate() {}
}
