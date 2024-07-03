import React from 'react'
import { Position, Size } from './types'
import { vec2 } from 'gl-matrix'

export const getScreenSize = () => vec2.fromValues(window.innerWidth, window.innerHeight)
const createCanvasSize = (screenWidth: number, screenHeight: number): Size =>
  vec2.fromValues(screenWidth * window.devicePixelRatio, screenHeight * window.devicePixelRatio)
export const getCanvasSize = () => {
  const screenSize = getScreenSize()
  return createCanvasSize(screenSize[0], screenSize[1])
}

export const canvasToScreen = (position: Position) => {
  const canvasSize = getCanvasSize()
  const screenSize = getScreenSize()
  const xRelative = position[0] / canvasSize[0]
  const yRelative = position[1] / canvasSize[1]
  return vec2.fromValues(
    Math.round(screenSize[0] * xRelative),
    Math.round(screenSize[1] * yRelative)
  )
}

export const screenToCanvas = (position: Position) => {
  const canvasSize = getCanvasSize()
  const screenSize = getScreenSize()
  const xRelative = position[0] / screenSize[0]
  const yRelative = position[1] / screenSize[1]
  return vec2.fromValues(
    Math.round(canvasSize[0] * xRelative),
    Math.round(canvasSize[1] * yRelative)
  )
}

export const canvasToSketchScale = (sketchSize: Size) => {
  const canvasSize = getCanvasSize()
  const scaleX = canvasSize[0] / sketchSize[0]
  const scaleY = canvasSize[1] / sketchSize[1]
  if (scaleX < scaleY) {
    return vec2.fromValues(scaleX, scaleX)
  } else {
    return vec2.fromValues(scaleY, scaleY)
  }
}

export const canvasToSketch = (
  position: Position,
  sketchSize: Size,
  gutter: { left: number; top: number } = { left: 0, top: 0 }
) => {
  const scale = canvasToSketchScale(sketchSize)
  return vec2.fromValues(
    Math.floor((position[0] - gutter.left) / scale[0]),
    Math.floor((position[1] - gutter.top) / scale[1])
  )
}

export const sketchToCanvas = (position: Position, sketchSize: Size) => {
  const scale = canvasToSketchScale(sketchSize)
  return vec2.fromValues(position[0] * scale[0], position[1] * scale[1])
}

export const useScreenSize = () => {
  const [size, setSize] = React.useState(getScreenSize())
  React.useEffect(() => {
    const onResize = () => setSize(getScreenSize())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

export const useSizes = () => {
  const screenSize = useScreenSize()
  const canvasSize = React.useMemo(
    () => createCanvasSize(screenSize[0], screenSize[1]),
    [screenSize[0], screenSize[1]]
  )
  return { screenSize, canvasSize }
}

export const distance = (a: Position, b: Position) =>
  Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2))

export const positionsAreEqual = (a: Position, b: Position) => a[0] === b[0] && a[1] === b[1]
