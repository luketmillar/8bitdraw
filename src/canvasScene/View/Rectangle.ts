import * as Model from '../Shape'

export const drawRectangle = (model: Model.Rectangle, ctx: CanvasRenderingContext2D) => {
  ctx.save()
  const bounds = model.bounds()
  if (model.fill) {
    ctx.save()
    if (model.opacity > 0) {
      ctx.globalAlpha = model.opacity
    }
    ctx.fillStyle = model.fill
    ctx.fillRect(bounds.left, bounds.top, bounds.width, bounds.height)
    ctx.restore
  }
  if (model.stroke) {
    ctx.lineWidth = model.stroke.width
    ctx.strokeStyle = model.stroke.color
    ctx.strokeRect(bounds.left, bounds.top, bounds.width, bounds.height)
  }

  ctx.restore()
}
