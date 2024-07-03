import { mat3, vec2 } from 'gl-matrix'

import Transform from './Transform'

export type Gutter = { left: number; top: number; bottom: number; right: number }
const DefaultGutter: Gutter = {
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
}

export default class Spaces {
  public screenSize: vec2 = vec2.create()
  public canvasSize: vec2 = vec2.create()
  public worldSize: vec2 = vec2.create()
  public camera: mat3 = mat3.create()
  // screenspace gutter
  public gutter: Gutter = DefaultGutter

  public get gutterInCanvasSpace() {
    const scale = this.screenToCanvasVec
    return {
      left: this.gutter.left * scale[0],
      right: this.gutter.right * scale[0],
      top: this.gutter.top * scale[1],
      bottom: this.gutter.bottom * scale[1],
    }
  }

  public get screenToCanvasVec() {
    if (this.screenSize[0] === 0 || this.screenSize[1] === 0) {
      return vec2.fromValues(1, 1)
    }
    return vec2.div(vec2.create(), this.canvasSize, this.screenSize)
  }
  public get canvasToScreenVec() {
    return vec2.inverse(vec2.create(), this.screenToCanvasVec)!
  }

  public get worldToCanvasMatrix() {
    const canvasSize = this.canvasSize
    const worldSize = this.worldSize
    const gutter = this.gutterInCanvasSpace
    const width = canvasSize[0] - (gutter.left + gutter.right)
    const height = canvasSize[1] - (gutter.top + gutter.bottom)
    const aspectRatio = width / height
    const worldAspectRatio = worldSize[0] / worldSize[1]
    const worldInCanvas = { width: 0, height: 0 }
    if (aspectRatio < worldAspectRatio) {
      worldInCanvas.width = width
      worldInCanvas.height = width / worldAspectRatio
    } else {
      worldInCanvas.height = height
      worldInCanvas.width = height * worldAspectRatio
    }
    const fitGutter = {
      left: (width - worldInCanvas.width) / 2,
      top: (height - worldInCanvas.height) / 2,
    }
    return Transform.Build()
      .translate(gutter.left + fitGutter.left, gutter.top + fitGutter.top)
      .scale(worldInCanvas.width / worldSize[0], worldInCanvas.height / worldSize[1])
      .create().matrix
  }

  public get canvasToWorldMatrix() {
    return mat3.invert(mat3.create(), this.worldToCanvasMatrix)!
  }

  public get screenToCanvasMatrix() {
    const scale = this.screenToCanvasVec
    return Transform.Build().scale(scale[0], scale[1]).create().matrix
  }

  public get canvasToScreenMatrix() {
    return mat3.invert(mat3.create(), this.screenToCanvasMatrix)!
  }

  public get screenToWorldMatrix() {
    return mat3.mul(mat3.create(), this.canvasToWorldMatrix, this.screenToCanvasMatrix)
  }

  public get worldToScreenMatrix() {
    return mat3.invert(mat3.create(), this.screenToWorldMatrix)
  }

  public canvasToWorldSpace(position: vec2) {
    return vec2.round(
      vec2.create(),
      vec2.transformMat3(vec2.create(), position, this.canvasToWorldMatrix)
    )
  }

  public screenToWorldSpace(position: vec2) {
    return vec2.round(
      vec2.create(),
      vec2.transformMat3(vec2.create(), position, this.screenToWorldMatrix)
    )
  }

  public screenToCanvas(position: vec2) {
    return vec2.transformMat3(vec2.create(), position, this.screenToCanvasMatrix)
  }
}
