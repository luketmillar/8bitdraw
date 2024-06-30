import { Color, Position, Stroke } from '../utils/types'

type IViewRenderOptions = {
  fill?: Color
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

    const left = this.position.x - this.width / 2
    const top = this.position.y - this.height / 2
    if (this.options.fill) {
      ctx.fillStyle = this.options.fill
      ctx.fillRect(left, top, this.width, this.height)
    }
    if (this.options.stroke) {
      ctx.lineWidth = this.options.stroke.width
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
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
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

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.lineWidth = this.options.stroke?.width ?? 1
    ctx.strokeStyle = this.options.stroke?.color ?? '#000'
    ctx.beginPath()
    ctx.moveTo(this.a.x, this.a.y)
    ctx.lineTo(this.b.x, this.b.y)
    ctx.stroke()
  }
}
