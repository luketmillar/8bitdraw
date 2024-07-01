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
    this.startOverride()
    this.startPosition = position
    this.drawRectangle(this.startPosition, position)
  }

  public onMove(position: Position) {
    if (!this.startPosition) return
    this.resetOverrides()
    this.drawRectangle(this.startPosition, position)
  }

  public onEnd(_position: Position) {
    if (!this.startPosition) return
    this.commitOverride()
    this.startPosition = null
  }

  private drawRectangle = (from: Position, to: Position) => {
    const positions = getRectanglePositions(from, to)
    positions.forEach((position) => {
      this.controller.setColor(position, this.toolStack.currentColor)
    })
  }
}
