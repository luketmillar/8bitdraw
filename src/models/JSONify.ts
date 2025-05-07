import { vec2 } from 'gl-matrix'
import Sketch from './Sketch'
import { pixelKey } from './utils'
import Pixel from './Pixel'

export type SketchJSON = {
  layer: string[][]
  size: { w: number; h: number }
}

export const toSketch = (sketchJSON: SketchJSON): Sketch => {
  const sketch = new Sketch(vec2.fromValues(sketchJSON.size.w, sketchJSON.size.h))
  for (let i = 0; i < sketchJSON.size.w; i++) {
    for (let j = 0; j < sketchJSON.size.h; j++) {
      const position = vec2.fromValues(j, i)
      const key = pixelKey(position)
      sketch.layers[0].pixels.set(key, new Pixel(position, sketchJSON.layer[i][j]))
    }
  }
  return sketch
}
