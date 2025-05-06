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
    ctx.fillStyle = '#222223'
    ctx.fillRect(0, 0, this.width, this.height)

    // transform to world space
    const matrix = this.spaces.worldToCanvasMatrix
    const transform = Transform.fromMatrix(matrix)
    this.ctx.translate(transform.translation[0], transform.translation[1])
    this.ctx.scale(transform.scale[0], transform.scale[1])

    clipAndShadowWorldSpace(world, transform, ctx)

    // white background
    ctx.fillStyle = '#F2F2F2'
    ctx.fillRect(0, 0, world.sketch.size[0], world.sketch.size[1])

    // draw sketch first
    this.renderModel(ctx, world.sketch)

    // draw grid on top
    if (world.showGrid) {
      this.renderModel(ctx, world.grid)
    }

    // transform into canvas space
    ctx.restore()
  }

  private clear() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height)
  }

  private renderModel = (ctx: CanvasRenderingContext2D, model: Model) =>
    this.renderModels(ctx, [model])
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

function clipAndShadowWorldSpace(
  world: AppWorld,
  transform: Transform,
  ctx: CanvasRenderingContext2D,
  radius: number = 20
) {
  // Calculate the world area in canvas space
  const worldWidth = world.sketch.size[0]
  const worldHeight = world.sketch.size[1]
  const scaleX = transform.scale[0]
  const scaleY = transform.scale[1]
  const widthPx = worldWidth * scaleX
  const heightPx = worldHeight * scaleY
  const offsetX = transform.translation[0]
  const offsetY = transform.translation[1]

  // Save the current transform
  ctx.save()
  // Reset transform to identity for clipping in canvas space
  ctx.setTransform(1, 0, 0, 1, 0, 0)

  // draw clip path
  ctx.beginPath()
  ctx.moveTo(offsetX + radius, offsetY)
  ctx.lineTo(offsetX + widthPx - radius, offsetY)
  ctx.quadraticCurveTo(offsetX + widthPx, offsetY, offsetX + widthPx, offsetY + radius)
  ctx.lineTo(offsetX + widthPx, offsetY + heightPx - radius)
  ctx.quadraticCurveTo(
    offsetX + widthPx,
    offsetY + heightPx,
    offsetX + widthPx - radius,
    offsetY + heightPx
  )
  ctx.lineTo(offsetX + radius, offsetY + heightPx)
  ctx.quadraticCurveTo(offsetX, offsetY + heightPx, offsetX, offsetY + heightPx - radius)
  ctx.lineTo(offsetX, offsetY + radius)
  ctx.quadraticCurveTo(offsetX, offsetY, offsetX + radius, offsetY)
  ctx.closePath()

  // draw shadow
  ctx.save()
  ctx.globalAlpha = 1
  ctx.shadowColor = 'rgba(0,0,0,0.48)'
  ctx.shadowBlur = 50
  ctx.shadowOffsetX = -10
  ctx.shadowOffsetY = 10
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.restore()

  ctx.clip()

  // Restore the world transform for further drawing
  // need this instead of ctx.restore() because we need to keep the transform for the next draw
  ctx.setTransform(
    transform.scale[0],
    0,
    0,
    transform.scale[1],
    transform.translation[0],
    transform.translation[1]
  )
}
