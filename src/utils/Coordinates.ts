import React from 'react'
import { Position, Size } from './types'

export const getScreenSize = () => ({ width: window.innerWidth, height: window.innerHeight })
const createCanvasSize = (screenWidth: number, screenHeight: number) => ({
  width: screenWidth * window.devicePixelRatio,
  height: screenHeight * window.devicePixelRatio,
})
export const getCanvasSize = () => {
  const screenSize = getScreenSize()
  return createCanvasSize(screenSize.width, screenSize.height)
}

export const canvasToScreen = (position: Position) => {
  const canvasSize = getCanvasSize()
  const screenSize = getScreenSize()
  const xRelative = position.x / canvasSize.width
  const yRelative = position.y / canvasSize.height
  return {
    x: Math.round(screenSize.width * xRelative),
    y: Math.round(screenSize.height * yRelative),
  }
}

export const screenToCanvas = (position: Position) => {
  const canvasSize = getCanvasSize()
  const screenSize = getScreenSize()
  const xRelative = position.x / screenSize.width
  const yRelative = position.y / screenSize.height
  return {
    x: Math.round(canvasSize.width * xRelative),
    y: Math.round(canvasSize.height * yRelative),
  }
}

export const canvasToSketchScale = (sketchSize: Size) => {
  const canvasSize = getCanvasSize()
  const scaleX = canvasSize.width / sketchSize.width
  const scaleY = canvasSize.height / sketchSize.height
  if (scaleX < scaleY) {
    return { x: scaleX, y: scaleX }
  } else {
    return { x: scaleY, y: scaleY }
  }
}

export const canvasToSketch = (
  position: Position,
  sketchSize: Size,
  gutter: { left: number; top: number } = { left: 0, top: 0 }
) => {
  const scale = canvasToSketchScale(sketchSize)
  return {
    x: Math.floor((position.x - gutter.left) / scale.x),
    y: Math.floor((position.y - gutter.top) / scale.y),
  }
}

export const sketchToCanvas = (position: Position, sketchSize: Size) => {
  const scale = canvasToSketchScale(sketchSize)
  return {
    x: position.x * scale.x,
    y: position.y * scale.y,
  }
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
    () => createCanvasSize(screenSize.width, screenSize.height),
    [screenSize.width, screenSize.height]
  )
  return { screenSize, canvasSize }
}

export const distance = (a: Position, b: Position) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

export const positionsAreEqual = (a: Position, b: Position) => a.x === b.x && a.y === b.y
