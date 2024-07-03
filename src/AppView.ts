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

    // draw gutter backgournd
    ctx.fillStyle = '#666'
    ctx.fillRect(0, 0, this.width, this.height)

    // transform to sketch space
    ctx.save()
    ctx.translate(this.gutter.left, this.gutter.top)
    const scale = Coordinates.canvasToSketchScale(world.sketch.size)
    ctx.scale(scale[0], scale[1])

    // white background
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, world.sketch.size[0], world.sketch.size[1])

    // draw everything
    this.renderModels(ctx, world.getModels())

    //restore canvas to canvas space
    ctx.restore()

    // draw gutter ghosting
    ctx.fillStyle = 'rgba(96, 96, 96, 0.9)'
    ctx.fillRect(0, 0, this.gutter.left, this.height)
    ctx.fillRect(0, 0, this.width, this.gutter.top)
    ctx.fillRect(this.width - this.gutter.left, 0, this.gutter.left, this.height)
    ctx.fillRect(0, this.height - this.gutter.top, this.width, this.gutter.top)

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
