import AppWorld from './AppWorld'
import { IView } from './mvc/BaseController'
import * as Coordinates from './utils/Coordinates'
import Model from './models/Base'

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
    console.log('rendering')

    // draw gutter backgournd
    ctx.fillStyle = '#eee'
    ctx.fillRect(0, 0, this.width, this.height)

    // transform to sketch space
    ctx.save()
    ctx.translate(this.gutter.left, this.gutter.top)
    const scale = Coordinates.canvasToSketchScale(world.sketch.size)
    ctx.scale(scale.x, scale.y)

    // white background
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, world.sketch.size.width, world.sketch.size.height)

    // draw everything
    this.renderModels(ctx, world.getModels())

    //restore canvas to canvas space
    ctx.restore()

    // restore starting point
    ctx.restore()
  }

  private renderModels = (ctx: CanvasRenderingContext2D, models: Model[]) =>
    models.forEach((model) => model.getViews().forEach((view) => view.render(ctx)))

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
