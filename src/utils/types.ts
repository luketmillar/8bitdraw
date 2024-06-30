import { Bounds, createBounds } from './Bounds'

export type Vector = { x: number; y: number }
export type Position = { x: number; y: number }
export enum Direction {
  NS,
  EW,
}
export type Color = string
export type Stroke = { width: number; color: Color; canvasSpace?: boolean }
export type Size = { width: number; height: number }
export type { Bounds }
export { createBounds }
