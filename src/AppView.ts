import AppWorld from './AppWorld'
import { IView } from './mvc/BaseController'
import { View } from './views/Views'
import * as Coordinates from './utils/Coordinates'

export default class AppView implements IView<AppWorld> {
  private _canvas: HTMLCanvasElement | undefined
  public get canvas() {
    return this._canvas!
  }
  public set canvas(value: HTMLCanvasElement) {
    this._canvas = value
  }
  public gutter: { left: number; top: number } = { left: 0, top: 0 }

  public render = (world: AppWorld) => {
    const ctx = this.ctx
    ctx.save()
    ctx.clearRect(0, 0, this.width, this.height)

    // draw gutter backgournd
    ctx.fillStyle = '#eee'
    ctx.fillRect(0, 0, this.width, this.height)

    // transform canvas to sketch
    ctx.save()
    const scale = Coordinates.canvasToSketchScale(world.sketch.size)
    ctx.scale(scale.x, scale.y)

    // transform gutter
    ctx.save()
    ctx.translate(this.gutter.left, this.gutter.top)

    // white background
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, world.sketch.size.width, world.sketch.size.height)

    // draw everything
    this.renderViews(ctx, world.allViews())

    // restore gutter transform
    ctx.restore()

    //restore canvas to world transform
    ctx.restore()

    // restore starting point
    ctx.restore()
  }

  private renderViews = (ctx: CanvasRenderingContext2D, views: View[]) =>
    views.forEach((view) => view.render(ctx))

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
