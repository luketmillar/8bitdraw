import React from 'react'
import { Position } from './types'

export const getScreenSize = () => ({ width: window.innerWidth, height: window.innerHeight })
const createWorldSize = (screenWidth: number, screenHeight: number) => ({
  width: screenWidth * window.devicePixelRatio,
  height: screenHeight * window.devicePixelRatio,
})
export const getWorldSize = () => {
  const screenSize = getScreenSize()
  return createWorldSize(screenSize.width, screenSize.height)
}

export const worldToScreen = (position: Position) => {
  const worldSize = getWorldSize()
  const screenSize = getScreenSize()
  const xRelative = position.x / worldSize.width
  const yRelative = position.y / worldSize.height
  return {
    x: Math.round(screenSize.width * xRelative),
    y: Math.round(screenSize.height * yRelative),
  }
}

export const screenToWorld = (position: Position) => {
  const worldSize = getWorldSize()
  const screenSize = getScreenSize()
  const xRelative = position.x / screenSize.width
  const yRelative = position.y / screenSize.height
  return {
    x: Math.round(worldSize.width * xRelative),
    y: Math.round(worldSize.height * yRelative),
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
  const worldSize = React.useMemo(
    () => createWorldSize(screenSize.width, screenSize.height),
    [screenSize.width, screenSize.height]
  )
  return { screenSize, worldSize }
}

export const distance = (a: Position, b: Position) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
