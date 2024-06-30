import { Color, Size } from '../utils/types'
import { Line } from '../views/Views'
import Model from './Base'

const createVerticalGridLines = (size: Size, color: Color) => {
  const lines: Line[] = []
  for (let x = 0; x < size.width; x++) {
    lines.push(
      new Line(
        { x, y: 0 },
        { x, y: size.height },
        { stroke: { color, width: 1, canvasSpace: true } }
      )
    )
  }
  return lines
}

const createHorizontalGridLines = (size: Size, color: Color) => {
  const lines: Line[] = []
  for (let y = 0; y < size.height; y++) {
    lines.push(
      new Line(
        { x: 0, y },
        { x: size.width, y },
        { stroke: { color, width: 1, canvasSpace: true } }
      )
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
