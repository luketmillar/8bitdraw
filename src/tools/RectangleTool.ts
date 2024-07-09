import { vec2 } from 'gl-matrix'
import { Position } from '../utils/types'
import Tool from './Tool'

const getRectanglePositions = (from: Position, to: Position): vec2[] => {
  const positions: vec2[] = []
  const minX = Math.min(from[0], to[0])
  const maxX = Math.max(from[0], to[0])
  const minY = Math.min(from[1], to[1])
  const maxY = Math.max(from[1], to[1])
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      positions.push(vec2.fromValues(x, y))
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
    this.resetOverride()
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
