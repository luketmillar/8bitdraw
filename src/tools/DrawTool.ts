import { getLinePositions } from '../utils/DrawLine'
import { Position } from '../utils/types'
import Tool from './Tool'

export default class DrawTool extends Tool {
  private startPosition: Position | null = null
  private lastPosition: Position | null = null
  public onStart(position: Position) {
    this.drawPixel(position)
    this.startPosition = position
    this.lastPosition = position
  }

  public onMove(position: Position) {
    if (this.startPosition === null || this.lastPosition === null) return
    const positions = getLinePositions(this.lastPosition, position)
    positions.forEach((position) => {
      this.drawPixel(position)
    })
    this.lastPosition = position
  }

  public onEnd() {
    this.startPosition = null
    this.lastPosition = null
  }

  public onUpdate() {}

  private drawPixel(position: Position) {
    if (!this.controller.isInSketch(position)) return
    this.controller.setColor(position, '#0ff')
  }
}
