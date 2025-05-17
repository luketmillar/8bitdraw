import { vec2 } from 'gl-matrix'
import { Color as ColorClass } from '../models/Color'

export type Vector = { x: number; y: number }
export type Position = vec2
export enum Direction {
  NS,
  EW,
}
export type Stroke = { width: number; color: ColorClass; canvasSpace?: boolean }
export type Size = vec2
