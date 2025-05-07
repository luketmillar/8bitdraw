import { vec2 } from 'gl-matrix'
import { Position } from '../utils/types'

export const pixelKey = (position: Position) => `${position[0]}:${position[1]}`
export const parsePixelKey = (key: string): Position => {
  const [x, y] = key.split(':').map((value) => parseInt(value))
  return vec2.fromValues(x, y)
}
