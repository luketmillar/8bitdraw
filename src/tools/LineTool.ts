import { getLinePositions } from '../utils/DrawLine'
import { Position } from '../utils/types'
import Tool from './Tool'

export default class LineTool extends Tool {
  private startPosition: Position | null = null

  public onStart(position: Position) {
    this.startPosition = position
    this.controller.world.sketch.overrides.start()
    this.drawLine(this.startPosition, position)
  }

  public onMove(position: Position) {
    if (!this.startPosition) return
    this.controller.world.sketch.overrides.clear()
    this.drawLine(this.startPosition, position)
  }

  public onEnd(position: Position) {
    if (!this.startPosition) return
    this.controller.world.sketch.overrides.end()
    this.drawLine(this.startPosition, position)
    this.startPosition = null
  }

  private drawLine = (from: Position, to: Position) => {
    const positions = getLinePositions(from, to)
    positions.forEach((position) => {
      this.controller.setColor(position, this.toolStack.currentColor)
    })
  }
}
