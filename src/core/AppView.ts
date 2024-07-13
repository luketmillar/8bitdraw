import AppWorld from './AppWorld'
import { IView } from './BaseController'
import Model from '../models/Base'
import Spaces from '../math/Spaces'
import Transform from '../math/Transform'
import { vec2 } from 'gl-matrix'

export default class AppView implements IView<AppWorld> {
  private _canvas: HTMLCanvasElement | undefined
  public spaces = new Spaces()

  public get canvas() {
    return this._canvas!
  }
  public set canvas(value: HTMLCanvasElement) {
    this._canvas = value
  }
  public gutter: { left: number; top: number } = { left: 0, top: 0 }

  public render = (world: AppWorld) => {
    this.spaces.canvasSize = vec2.fromValues(this.canvas.width, this.canvas.height)
    this.spaces.screenSize = vec2.fromValues(this.canvas.clientWidth, this.canvas.clientHeight)
    this.spaces.worldSize = world.sketch.size

    const ctx = this.ctx
    ctx.save()
    this.clear()

    // draw gutter backgournd
    ctx.fillStyle = '#F3F5F7'
    ctx.fillRect(0, 0, this.width, this.height)

    // transform to world space
    const matrix = this.spaces.worldToCanvasMatrix
    const transform = Transform.fromMatrix(matrix)
    this.ctx.translate(transform.translation[0], transform.translation[1])
    this.ctx.scale(transform.scale[0], transform.scale[1])

    // // white background
    ctx.fillStyle = '#F3F5F7'
    ctx.fillRect(0, 0, world.sketch.size[0], world.sketch.size[1])

    // // draw everything
    this.renderModels(ctx, world.getModels())

    // transform into canvas space
    ctx.restore()

    // draw gutter ghosting
    const gutter = this.spaces.fittedGutter
    ctx.fillStyle = 'rgb(243, 245, 247, 0.5)'
    ctx.fillRect(0, 0, gutter.left, this.height)
    ctx.fillRect(this.width - gutter.right, 0, gutter.right, this.height)
    ctx.fillRect(0, 0, this.width, gutter.top)
    ctx.fillRect(0, this.height - gutter.bottom, this.width, gutter.bottom)
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height)
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
