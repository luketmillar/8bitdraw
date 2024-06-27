import * as Model from '../Shape'

export const drawCircle = (model: Model.Circle, ctx: CanvasRenderingContext2D) => {
  ctx.save()
  ctx.beginPath()
  ctx.arc(model.position.x, model.position.y, model.radius, 0, 2 * Math.PI)
  if (model.fill) {
    ctx.fillStyle = model.fill
    ctx.fill()
  }
  if (model.stroke) {
    ctx.strokeStyle = model.stroke.color
    ctx.lineWidth = model.stroke.width
    ctx.stroke()
  }
  ctx.restore()
}
