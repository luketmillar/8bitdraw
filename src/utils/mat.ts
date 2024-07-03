import { mat3, mat4, vec2, vec3 } from 'gl-matrix'

export function unscaleMat3(outMat: mat3, inMat: mat3): mat3 {
  const unitFirstRow = vec2.normalize(vec2.create(), vec2.fromValues(inMat[0], inMat[1]))
  const unitSecondRow = vec2.normalize(vec2.create(), vec2.fromValues(inMat[3], inMat[4]))
  outMat[0] = unitFirstRow[0]
  outMat[1] = unitFirstRow[1]
  outMat[2] = inMat[2]
  outMat[3] = unitSecondRow[0]
  outMat[4] = unitSecondRow[1]
  outMat[5] = inMat[5]
  outMat[6] = inMat[6]
  outMat[7] = inMat[7]
  outMat[8] = inMat[8]
  return outMat
}

export function scaleFromMat3(outVec: vec2, inMat: mat3): vec2 {
  outVec[0] = vec2.length(vec2.fromValues(inMat[0], inMat[1]))
  outVec[1] = vec2.length(vec2.fromValues(inMat[3], inMat[4]))
  return outVec
}

export function scaleFromMat4(outVec: vec3, inMat: mat4): vec3 {
  outVec[0] = vec3.length(vec3.fromValues(inMat[0], inMat[1], inMat[2]))
  outVec[1] = vec3.length(vec3.fromValues(inMat[4], inMat[5], inMat[6]))
  outVec[2] = vec3.length(vec3.fromValues(inMat[8], inMat[9], inMat[10]))
  return outVec
}

export function rotationFromMat3(inMat: mat3): number {
  return (Math.atan2(inMat[1], inMat[4]) * 180) / Math.PI
}

export function translationFromMat3(inMat: mat3): vec2 {
  return vec2.fromValues(inMat[6], inMat[7])
}

export function clearTranslationFromMat3(matrix: mat3): mat3 {
  const result = mat3.clone(matrix)
  result[6] = 0
  result[7] = 0
  return result
}

export function mat3FromRotation(radian: number, rotationOrigin: vec2) {
  const translateOriginToCenter = mat3.fromTranslation(
    mat3.create(),
    vec2.fromValues(-rotationOrigin[0], -rotationOrigin[1])
  )
  const rotate = mat3.fromRotation(mat3.create(), radian)
  const unTranslate = mat3.fromTranslation(mat3.create(), rotationOrigin)

  const composed = mat3.mul(
    mat3.create(),
    unTranslate,
    mat3.mul(mat3.create(), rotate, translateOriginToCenter)
  )
  return composed
}

export function mat3ToCSS(inMat: mat3): string {
  const m = inMat
  return `matrix(${m[0]},${m[1]},${m[3]},${m[4]},${m[6]},${m[7]})`
}

export function vec2Clamp(outVec: vec2, ...inVecs: vec2[]): vec2 {
  const xs = [] as number[]
  const ys = [] as number[]
  for (const inVec of inVecs) {
    xs.push(inVec[0])
    ys.push(inVec[1])
  }
  outVec[0] = Math.min(...xs)
  outVec[1] = Math.min(...ys)
  return outVec
}

export function mat3FromMat4Transform(inMat: mat4): mat3 {
  return mat3.fromValues(inMat[0], inMat[1], 0, inMat[4], inMat[5], 0, inMat[12], inMat[13], 1)
}

export function mat4FromMat3Transform(inMat: mat3): mat4 {
  return mat4.fromValues(
    inMat[0],
    inMat[1],
    0,
    0,
    inMat[3],
    inMat[4],
    0,
    0,
    0,
    0,
    1,
    0,
    inMat[6],
    inMat[7],
    0,
    1
  )
}

export function aspectRatio(vec: vec2): number {
  return vec[0] / vec[1]
}

// Computes the matrix that transforms from one coordinate space to another given the associated vectors
//  in each coordinate space
export function mat3FromBasis(from: [vec2, vec2, vec2], to: [vec2, vec2, vec2]): mat3 | null {
  const fromMatrix = mat3.fromValues(
    from[0][0],
    from[0][1],
    1,
    from[1][0],
    from[1][1],
    1,
    from[2][0],
    from[2][1],
    1
  )
  const toMatrix = mat3.fromValues(
    to[0][0],
    to[0][1],
    1,
    to[1][0],
    to[1][1],
    1,
    to[2][0],
    to[2][1],
    1
  )

  const fromInverse = mat3.invert(mat3.create(), fromMatrix)

  if (fromInverse === null) {
    return null
  }

  return mat3.mul(mat3.create(), toMatrix, fromInverse)
}
