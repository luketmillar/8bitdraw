import { Color, Position, Stroke } from '../utils/types'

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
      ctx.fillStyle = this.options.fill
      ctx.fillRect(left, top, this.width, this.height)
    }
    if (this.options.stroke) {
      if (this.options.stroke.canvasSpace) {
        ctx.lineWidth = this.options.stroke.width / 100
      } else {
        ctx.lineWidth = this.options.stroke.width
      }
      ctx.strokeStyle = this.options.stroke.color
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
      ctx.fillStyle = this.options.fill
      ctx.fill()
    }
    if (this.options.stroke) {
      ctx.strokeStyle = this.options.stroke.color
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

  private getLineWidth() {
    const setWidth = this.options.stroke?.width ?? 1
    return this.options.stroke?.canvasSpace ? setWidth / 100 : setWidth
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.lineWidth = this.getLineWidth()
    ctx.strokeStyle = this.options.stroke?.color ?? '#000'
    ctx.beginPath()
    ctx.moveTo(this.a[0], this.a[1])
    ctx.lineTo(this.b[0], this.b[1])
    ctx.stroke()
  }
}
