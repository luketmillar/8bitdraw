import { mat3, vec2 } from 'gl-matrix'

import { rotationFromMat3, scaleFromMat3 } from './mat'

export interface ITransformOptions {
  translation?: vec2
  rotation?: number
  scale?: vec2
  rotationPivot?: vec2
  scalePivot?: vec2
}

class TransformBuilder {
  private _translation?: vec2
  private _rotation?: number
  private _scale?: vec2
  private _rotationPivot?: vec2
  private _scalePivot?: vec2

  public translate(x: number, y: number) {
    this._translation = vec2.fromValues(x, y)
    return this
  }
  public rotate(rad: number) {
    this._rotation = rad
    return this
  }
  public scale(x: number, y: number) {
    this._scale = vec2.fromValues(x, y)
    return this
  }
  public rotationPivot(x: number, y: number) {
    this._rotationPivot = vec2.fromValues(x, y)
    return this
  }
  public scalePivot(x: number, y: number) {
    this._scalePivot = vec2.fromValues(x, y)
    return this
  }
  public create() {
    return new Transform({
      translation: this._translation,
      rotation: this._rotation,
      scale: this._scale,
      rotationPivot: this._rotationPivot,
      scalePivot: this._scalePivot,
    })
  }
}

/** Represents an immutable 2D transform.  */
export default class Transform {
  public static Builder = TransformBuilder
  public static Build = () => new TransformBuilder()
  /** Compute the 3x3 matrix representation of the transform.
   * @return {mat3} the 3x3 matrix representation of the transform
   */
  public get matrix(): mat3 {
    if (!this._matrix) {
      this._matrix = mat3.create()
      mat3.translate(this._matrix, this._matrix, this.translation)
      mat3.rotate(this._matrix, this._matrix, (this.rotation * Math.PI) / 180)
      mat3.translate(this._matrix, this._matrix, this.rotationPivot)
      mat3.scale(this._matrix, this._matrix, this.scale)
      mat3.translate(this._matrix, this._matrix, this.scalePivot)
    }
    return this._matrix
  }
  public static fromJSON(json: any): Transform {
    const translation = json.t && vec2.fromValues(json.t[0], json.t[1])
    const scale = json.s && vec2.fromValues(json.s[0], json.s[1])
    const rotationPivot = json.rp && vec2.fromValues(json.rp[0], json.rp[1])
    const scalePivot = json.rp && vec2.fromValues(json.sp[0], json.sp[1])
    const rotation = json.r
    return new Transform({ translation, rotation, scale, rotationPivot, scalePivot })
  }
  public static fromMatrix(matrix: mat3): Transform {
    // figure out the scale in the matrix
    const scale = scaleFromMat3(vec2.create(), matrix)
    // remove the scale from the matrix
    const inverseScaling = mat3.invert(mat3.create(), mat3.fromScaling(mat3.create(), scale))
    if (inverseScaling) {
      matrix = mat3.mul(mat3.create(), matrix, inverseScaling)
    }
    const rotation = rotationFromMat3(matrix)
    const translation = vec2.fromValues(matrix[6], matrix[7])
    return new Transform({ translation, rotation, scale })
  }
  public readonly translation: vec2
  public readonly rotation: number
  public readonly scale: vec2
  public readonly rotationPivot: vec2
  public readonly scalePivot: vec2

  private _matrix: mat3 | undefined
  public constructor(options?: ITransformOptions) {
    this.translation = (options && options.translation) || vec2.fromValues(0, 0)
    this.rotation = (options && options.rotation) || 0
    this.scale = (options && options.scale) || vec2.fromValues(1, 1)
    this.rotationPivot = (options && options.rotationPivot) || vec2.fromValues(0, 0)
    this.scalePivot = (options && options.scalePivot) || vec2.fromValues(0, 0)
    this._matrix = undefined
  }

  public setTranslation(translation: vec2) {
    return new Transform({
      translation,
      rotation: this.rotation,
      scale: this.scale,
      rotationPivot: this.rotationPivot,
      scalePivot: this.scalePivot,
    })
  }

  public setRotation(rotation: number) {
    return new Transform({
      translation: this.translation,
      rotation,
      scale: this.scale,
      rotationPivot: this.rotationPivot,
      scalePivot: this.scalePivot,
    })
  }

  public setScale(scale: vec2) {
    return new Transform({
      translation: this.translation,
      rotation: this.rotation,
      scale,
      rotationPivot: this.rotationPivot,
      scalePivot: this.scalePivot,
    })
  }

  public translate(translation: vec2) {
    return Transform.fromMatrix(mat3.translate(mat3.create(), this.matrix, translation))
  }

  public transform(transform: mat3 | Transform) {
    if (transform instanceof Transform) {
      return Transform.fromMatrix(mat3.mul(mat3.create(), transform.matrix, this.matrix))
    } else {
      return Transform.fromMatrix(mat3.mul(mat3.create(), transform, this.matrix))
    }
  }

  public invert() {
    return Transform.fromMatrix(mat3.invert(mat3.create(), this.matrix))
  }

  public rotateAboutAnchor(anchorVertex: vec2, degrees: number): Transform {
    const rotatedTransform = this.setRotation(degrees)
    const initialAnchorLocation = vec2.transformMat3(vec2.create(), anchorVertex, this.matrix)
    const rotatedAnchorLocation = vec2.transformMat3(
      vec2.create(),
      anchorVertex,
      rotatedTransform.matrix
    )

    const translationDelta = vec2.sub(vec2.create(), initialAnchorLocation, rotatedAnchorLocation)

    const newTranslation = vec2.add(vec2.create(), rotatedTransform.translation, translationDelta)
    const finalTransform = rotatedTransform.setTranslation(newTranslation)
    return finalTransform
  }

  public equals(other: any): boolean {
    if (!(other instanceof Transform)) {
      return false
    }
    const otherTransform = other as Transform
    return (
      vec2.equals(otherTransform.translation, this.translation) &&
      otherTransform.rotation === this.rotation &&
      vec2.equals(otherTransform.scale, this.scale) &&
      vec2.equals(otherTransform.rotationPivot, this.rotationPivot) &&
      vec2.equals(otherTransform.scalePivot, this.scalePivot) &&
      mat3.equals(otherTransform.matrix, this.matrix)
    )
  }
}

/** A {@link Transform} instance where translation, rotation, rotationPivot and scale are all at their default values. */
export const IdentityTransform = new Transform()

/**
 * @external {vec2} http://glmatrix.net/docs/module-vec2.html
 */

/**
 * @external {mat3} http://glmatrix.net/docs/module-mat3.html
 */
