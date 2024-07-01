import { Position } from '../utils/types'
import Tool from './Tool'

const getRectanglePositions = (from: Position, to: Position) => {
  const positions = []
  const minX = Math.min(from.x, to.x)
  const maxX = Math.max(from.x, to.x)
  const minY = Math.min(from.y, to.y)
  const maxY = Math.max(from.y, to.y)
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      positions.push({ x, y })
    }
  }
  return positions
}

export default class RectangleTool extends Tool {
  private startPosition: Position | null = null

  public onStart(position: Position) {
    this.startPosition = position
    this.controller.world.sketch.overrides.start()
    this.drawRectangle(this.startPosition, position)
  }

  public onMove(position: Position) {
    if (!this.startPosition) return
    this.controller.world.sketch.overrides.clear()
    this.drawRectangle(this.startPosition, position)
  }

  public onEnd(position: Position) {
    if (!this.startPosition) return
    this.controller.world.sketch.overrides.end()
    this.drawRectangle(this.startPosition, position)
    this.startPosition = null
  }

  private drawRectangle = (from: Position, to: Position) => {
    const positions = getRectanglePositions(from, to)
    positions.forEach((position) => {
      this.controller.setColor(position, this.toolStack.currentColor)
    })
  }
}
