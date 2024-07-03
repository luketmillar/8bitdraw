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
