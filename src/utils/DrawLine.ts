import { vec2 } from 'gl-matrix'
import { Position } from './types'

export const getLinePositions = (from: Position, to: Position): Position[] => {
  // Iterators, counters required by algorithm
  let x, y, dx, dy, dx1, dy1, px, py, xe, ye, i
  const x1 = from[0]
  const x2 = to[0]
  const y1 = from[1]
  const y2 = to[1]
  // Calculate line deltas
  dx = to[0] - from[0]
  dy = to[1] - from[1]
  // Create a positive copy of deltas (makes iterating easier)
  dx1 = Math.abs(dx)
  dy1 = Math.abs(dy)
  // Calculate error intervals for both axis
  px = 2 * dy1 - dx1
  py = 2 * dx1 - dy1
  // The line is X-axis dominant
  const positions: Position[] = []
  if (dy1 <= dx1) {
    // Line is drawn left to right
    if (dx >= 0) {
      x = x1
      y = y1
      xe = x2
    } else {
      // Line is drawn right to left (swap ends)
      x = x2
      y = y2
      xe = x1
    }
    positions.push(vec2.fromValues(x, y))
    // Rasterize the line
    for (i = 0; x < xe; i++) {
      x = x + 1
      // Deal with octants...
      if (px < 0) {
        px = px + 2 * dy1
      } else {
        if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
          y = y + 1
        } else {
          y = y - 1
        }
        px = px + 2 * (dy1 - dx1)
      }
      // Draw pixel from line span at
      // currently rasterized position
      positions.push(vec2.fromValues(x, y))
    }
  } else {
    // The line is Y-axis dominant
    // Line is drawn bottom to top
    if (dy >= 0) {
      x = x1
      y = y1
      ye = y2
    } else {
      // Line is drawn top to bottom
      x = x2
      y = y2
      ye = y1
    }
    positions.push(vec2.fromValues(x, y))
    // Rasterize the line
    for (i = 0; y < ye; i++) {
      y = y + 1
      // Deal with octants...
      if (py <= 0) {
        py = py + 2 * dx1
      } else {
        if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
          x = x + 1
        } else {
          x = x - 1
        }
        py = py + 2 * (dx1 - dy1)
      }
      // Draw pixel from line span at
      // currently rasterized position
      positions.push(vec2.fromValues(x, y))
    }
  }
  return positions
}
