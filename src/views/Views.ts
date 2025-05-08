import { Position, Stroke } from '../utils/types'
import { vec2 } from 'gl-matrix'
import { Color } from '../models/Color'

type IViewRenderOptions = {
  fill?: Color | null
  stroke?: Stroke
}
export abstract class View {
  public options: IViewRenderOptions
  constructor(options?: IViewRenderOptions) {
    this.options = options ?? {}
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save()
    this.draw(ctx)
    ctx.restore()
  }
  protected abstract draw(ctx: CanvasRenderingContext2D): void
}
export class Rectangle extends View {
  public position: Position
  public width: number
  public height: number
  constructor(position: Position, width: number, height: number, options?: IViewRenderOptions) {
    super(options)
    this.position = position
    this.width = width
    this.height = height
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save()

    const left = this.position[0] - this.width / 2
    const top = this.position[1] - this.height / 2
    if (this.options.fill) {
      ctx.fillStyle = this.options.fill.toRGBA()
      ctx.fillRect(left, top, this.width, this.height)
    }
    if (this.options.stroke) {
      if (this.options.stroke.canvasSpace) {
        ctx.lineWidth = this.options.stroke.width / 100
      } else {
        ctx.lineWidth = this.options.stroke.width
      }
      ctx.strokeStyle = this.options.stroke.color.toRGBA()
      ctx.strokeRect(left, top, this.width, this.height)
    }
    ctx.restore()
  }
}

export class Circle extends View {
  public position: Position
  public radius: number
  constructor(position: Position, radius: number, options?: IViewRenderOptions) {
    super(options)
    this.position = position
    this.radius = radius
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(this.position[0], this.position[1], this.radius, 0, 2 * Math.PI)
    if (this.options.fill) {
      ctx.fillStyle = this.options.fill.toRGBA()
      ctx.fill()
    }
    if (this.options.stroke) {
      ctx.strokeStyle = this.options.stroke.color.toRGBA()
      ctx.lineWidth = this.options.stroke.width ?? 1
      ctx.stroke()
    }
  }
}

export class Line extends View {
  public a: Position
  public b: Position
  constructor(a: Position, b: Position, options?: IViewRenderOptions) {
    super(options)
    this.a = a
    this.b = b
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.lineWidth = this.options.stroke?.width ?? 1
    ctx.strokeStyle = this.options.stroke?.color?.toRGBA() ?? '#000000'
    ctx.beginPath()
    ctx.moveTo(this.a[0], this.a[1])
    ctx.lineTo(this.b[0], this.b[1])
    ctx.stroke()
  }
}

// Gridlines are a special all in canvas space
export class GridLines extends View {
  public worldSize: vec2
  public cellSize: vec2

  constructor(worldSize: vec2, cellSize: vec2) {
    super()
    this.worldSize = worldSize
    this.cellSize = cellSize
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save()

    // Get the current transform
    const transform = ctx.getTransform()

    // Draw in canvas space
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    // Calculate the transformed size
    const transformedWidth = this.worldSize[0] * transform.a
    const transformedHeight = this.worldSize[1] * transform.d

    // Calculate the transformed cell size
    const cellWidth = this.cellSize[0] * transform.a
    const cellHeight = this.cellSize[1] * transform.d

    // Draw vertical lines with two colors for better visibility
    ctx.lineWidth = 1
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
    ctx.shadowBlur = 1
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    const darkColor = 'rgba(0, 0, 0, 0.25)'
    const lightColor = 'rgba(255, 255, 255, 0.35)'

    // First set of lines (darker)
    ctx.strokeStyle = darkColor
    for (let x = 0; x <= transformedWidth; x += cellWidth) {
      const pixelX = Math.round(x + transform.e)
      ctx.beginPath()
      ctx.moveTo(pixelX, Math.round(transform.f + 1))
      ctx.lineTo(pixelX, Math.round(transform.f + transformedHeight - 1))
      ctx.stroke()
    }

    // Second set of lines (lighter)
    ctx.strokeStyle = lightColor
    for (let x = 0; x <= transformedWidth; x += cellWidth) {
      const pixelX = Math.round(x + transform.e)
      ctx.beginPath()
      ctx.moveTo(pixelX + 1, Math.round(transform.f + 1))
      ctx.lineTo(pixelX + 1, Math.round(transform.f + transformedHeight - 1))
      ctx.stroke()
    }

    // Draw horizontal lines with two colors
    // First set of lines (darker)
    ctx.strokeStyle = darkColor
    for (let y = 0; y <= transformedHeight; y += cellHeight) {
      const pixelY = Math.round(y + transform.f)
      ctx.beginPath()
      ctx.moveTo(Math.round(transform.e + 1), pixelY)
      ctx.lineTo(Math.round(transform.e + transformedWidth - 1), pixelY)
      ctx.stroke()
    }

    // Second set of lines (lighter)
    ctx.strokeStyle = lightColor
    for (let y = 0; y <= transformedHeight; y += cellHeight) {
      const pixelY = Math.round(y + transform.f)
      ctx.beginPath()
      ctx.moveTo(Math.round(transform.e + 1), pixelY + 1)
      ctx.lineTo(Math.round(transform.e + transformedWidth - 1), pixelY + 1)
      ctx.stroke()
    }

    ctx.restore()
  }
}
