import * as Model from '../Shape'

export const drawLine = (model: Model.Line, ctx: CanvasRenderingContext2D) => {
  ctx.save()
  ctx.lineWidth = model.thickness
  ctx.strokeStyle = model.color
  ctx.beginPath()
  ctx.moveTo(model.start.x, model.start.y)
  ctx.lineTo(model.end.x, model.end.y)
  ctx.stroke()
  ctx.restore()
}
