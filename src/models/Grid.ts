import { vec2 } from 'gl-matrix'
import { Color, Size } from '../utils/types'
import { Line } from '../views/Views'
import Model from './Base'

const createVerticalGridLines = (size: Size, color: Color) => {
  const lines: Line[] = []
  for (let x = 0; x < size[0]; x++) {
    lines.push(
      new Line(vec2.fromValues(x, 0), vec2.fromValues(x, size[1]), {
        stroke: { color, width: 1, canvasSpace: true },
      })
    )
  }
  return lines
}

const createHorizontalGridLines = (size: Size, color: Color) => {
  const lines: Line[] = []
  for (let y = 0; y < size[1]; y++) {
    lines.push(
      new Line(vec2.fromValues(0, y), vec2.fromValues(size[0], y), {
        stroke: { color, width: 1, canvasSpace: true },
      })
    )
  }
  return lines
}

export default class Grid extends Model {
  public size: Size
  private verticalGridLines: Line[] = []
  private horizontalGridLines: Line[] = []
  constructor(size: Size) {
    super()
    this.size = size
    this.verticalGridLines = createVerticalGridLines(size, '#eee')
    this.horizontalGridLines = createHorizontalGridLines(size, '#eee')
  }

  public getViews() {
    return [...this.verticalGridLines, ...this.horizontalGridLines]
  }
}
