import { getLinePositions } from '../utils/DrawLine'
import { Position } from '../utils/types'
import Tool from './Tool'

export default class EraseTool extends Tool {
  private startPosition: Position | null = null
  private lastPosition: Position | null = null
  public onStart(position: Position) {
    this.startOverride()
    this.erasePixel(position)
    this.startPosition = position
    this.lastPosition = position
  }

  public onMove(position: Position) {
    if (this.startPosition === null || this.lastPosition === null) return
    const positions = getLinePositions(this.lastPosition, position)
    positions.forEach((position) => {
      this.erasePixel(position)
    })
    this.lastPosition = position
  }

  public onEnd() {
    this.commitOverride()
    this.startPosition = null
    this.lastPosition = null
  }

  public onUpdate() {}

  private erasePixel(position: Position) {
    if (!this.controller.isInSketch(position)) return
    this.controller.unsetColor(position)
  }
}
