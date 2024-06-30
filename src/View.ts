import { IView, IWorld } from './BaseController'
import * as Shapes from './models/Shapes'
import { Size } from './utils/types'

export default class View implements IView {
  private _canvas: HTMLCanvasElement | undefined
  public get canvas() {
    return this._canvas!
  }
  public set canvas(value: HTMLCanvasElement) {
    this._canvas = value
  }
  public gutter: { left: number; top: number } = { left: 0, top: 0 }

  public getCanvasSize(world: IWorld, screenSize: Size): Size {
    const screenAspectRatio = screenSize.width / screenSize.height
    const worldAspectRatio = world.size.width / world.size.height
    const canvasSize = { width: 0, height: 0 }
    if (worldAspectRatio < screenAspectRatio) {
      // the screen will have horizontal padding
      canvasSize.height = world.size.height
      canvasSize.width = world.size.height * screenAspectRatio
    } else {
      // the screen will have vertical padding
      canvasSize.width = world.size.width
      canvasSize.height = world.size.width / screenAspectRatio
    }
    return canvasSize
  }

  public render = (world: IWorld) => {
    const ctx = this.ctx
    ctx.save()
    ctx.clearRect(0, 0, this.width, this.height)

    ctx.save()
    ctx.transform(1, 0, 0, 1, this.gutter.left, this.gutter.top)
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, world.size.width, world.size.height)
    this.renderShapes(ctx, world.allShapes())
    ctx.restore()

    ctx.fillStyle = '#eee'
    ctx.fillRect(0, 0, this.gutter.left, this.height)
    ctx.fillRect(world.size.width + this.gutter.left, 0, this.gutter.left, this.height)
    ctx.fillRect(0, 0, this.width, this.gutter.top)
    ctx.fillRect(0, world.size.height + this.gutter.top, this.width, this.gutter.top)

    ctx.restore()
  }

  private renderShapes = (ctx: CanvasRenderingContext2D, shapes: Shapes.Shape[]) =>
    shapes.forEach((shape) => shape.render(ctx))

  private get ctx() {
    return this.canvas.getContext('2d')!
  }

  private get width() {
    return this.canvas.width
  }

  private get height() {
    return this.canvas.height
  }
}
