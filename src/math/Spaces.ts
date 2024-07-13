import { mat3, vec2 } from 'gl-matrix'

import Transform from './Transform'

export type Gutter = { left: number; top: number; bottom: number; right: number }
const DefaultGutter: Gutter = {
  left: 100,
  top: 100,
  bottom: 100,
  right: 100,
}

const sketchToWorld = 10

export default class Spaces {
  public screenSize: vec2 = vec2.create()
  public canvasSize: vec2 = vec2.create()
  public worldSize: vec2 = vec2.create()
  // public get worldSize() {
  //   return vec2.multiply(
  //     vec2.create(),
  //     this.sketchSize,
  //     vec2.fromValues(sketchToWorld, sketchToWorld)
  //   )
  // }
  public sketchSize: vec2 = vec2.create()
  public camera: mat3 = mat3.create()

  public zoom: number = 1
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

  public fitWorldInCanvas() {
    const canvasSize = this.canvasSize
    const worldSize = this.worldSize
    const gutter = this.gutterInCanvasSpace
    const width = canvasSize[0] - (gutter.left + gutter.right)
    const height = canvasSize[1] - (gutter.top + gutter.bottom)
    const aspectRatio = width / height
    const worldAspectRatio = worldSize[0] / worldSize[1]
    let worldInCanvas = vec2.fromValues(0, 0)
    if (aspectRatio < worldAspectRatio) {
      worldInCanvas = vec2.fromValues(width, width / worldAspectRatio)
    } else {
      worldInCanvas = vec2.fromValues(height * worldAspectRatio, height)
    }
    const fitGutter = vec2.fromValues(
      (width - worldInCanvas[0]) / 2,
      (height - worldInCanvas[1]) / 2
    )
    return { fitGutter, worldInCanvas }
  }

  public get fittedGutter() {
    const gutter = this.gutterInCanvasSpace
    const { fitGutter } = this.fitWorldInCanvas()
    return {
      left: gutter.left + fitGutter[0],
      top: gutter.top + fitGutter[1],
      right: gutter.right + fitGutter[0],
      bottom: gutter.bottom + fitGutter[1],
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
    const worldSize = this.worldSize
    const gutter = this.gutterInCanvasSpace
    const { fitGutter, worldInCanvas } = this.fitWorldInCanvas()
    return Transform.Build()
      .translate(gutter.left + fitGutter[0], gutter.top + fitGutter[1])
      .scale(
        (this.zoom * worldInCanvas[0]) / worldSize[0],
        (this.zoom * worldInCanvas[1]) / worldSize[1]
      )
      .create().matrix
  }

  public get sketchToWorldMatrix() {
    return Transform.Build().scale(sketchToWorld, sketchToWorld).create().matrix
  }

  public get sketchToCanvasMatrix() {
    return mat3.mul(mat3.create(), this.worldToCanvasMatrix, this.sketchToWorldMatrix)
  }

  public get canvasToSketchMatrix() {
    return mat3.invert(mat3.create(), this.sketchToCanvasMatrix)!
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
    return vec2.floor(
      vec2.create(),
      vec2.transformMat3(vec2.create(), position, this.canvasToWorldMatrix)
    )
  }

  public canvasToSketchSpace(position: vec2) {
    return vec2.floor(
      vec2.create(),
      vec2.transformMat3(vec2.create(), position, this.canvasToSketchMatrix)
    )
  }

  public screenToWorldSpace(position: vec2) {
    return vec2.floor(
      vec2.create(),
      vec2.transformMat3(vec2.create(), position, this.screenToWorldMatrix)
    )
  }

  public screenToCanvas(position: vec2) {
    return vec2.transformMat3(vec2.create(), position, this.screenToCanvasMatrix)
  }
}
