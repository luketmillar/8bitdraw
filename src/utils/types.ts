import { vec2 } from 'gl-matrix'
import { Bounds, createBounds } from './Bounds'

export type Vector = { x: number; y: number }
export type Position = vec2
export enum Direction {
  NS,
  EW,
}
export type Color = string
export type Stroke = { width: number; color: Color; canvasSpace?: boolean }
export type Size = vec2
export type { Bounds }
export { createBounds }
