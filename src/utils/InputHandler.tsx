import React from 'react'
import { Position } from './types'
import * as Coordinates from './Coordinates'
import styled from 'styled-components'

const FullScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`

interface IProps {
  onClick?: (position: Position) => void
  onMouseMove?: (position: Position) => void
  onMouseUp?: (position: Position) => void
  onMouseDown?: (position: Position) => void
}
const InputHandler = ({ onClick, onMouseMove, onMouseUp, onMouseDown }: IProps) => {
  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      const position = Coordinates.screenToCanvas({ x: e.clientX, y: e.clientY })
      onClick?.(position)
    },
    [onClick]
  )
  const handleTouchStart = React.useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      const position = Coordinates.screenToCanvas({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      })
      onMouseDown?.(position)
    },
    [onMouseDown]
  )
  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      if (e.detail !== 1 || e.button !== 0) {
        return
      }
      const position = Coordinates.screenToCanvas({ x: e.clientX, y: e.clientY })
      onMouseDown?.(position)
    },
    [onMouseDown]
  )
  React.useEffect(() => {
    const handleUp = (e: MouseEvent) => {
      const position = Coordinates.screenToCanvas({ x: e.clientX, y: e.clientY })
      onMouseUp?.(position)
    }
    window.addEventListener('mouseup', handleUp)
    return () => window.removeEventListener('mouseup', handleUp)
  }, [onMouseUp])
  React.useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const position = Coordinates.screenToCanvas({ x: e.clientX, y: e.clientY })
      onMouseMove?.(position)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [onMouseMove])
  React.useEffect(() => {
    const handleMove = (e: TouchEvent) => {
      e.preventDefault()
      const position = Coordinates.screenToCanvas({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      })
      onMouseMove?.(position)
    }
    window.addEventListener('touchmove', handleMove)
    return () => window.removeEventListener('touchmove', handleMove)
  }, [onMouseMove])
  React.useEffect(() => {
    const handleEnd = (e: TouchEvent) => {
      e.preventDefault()
      onMouseUp?.({ x: 0, y: 0 })
    }
    window.addEventListener('touchend', handleEnd)
    return () => window.removeEventListener('touchend', handleEnd)
  }, [onMouseUp])
  return (
    <FullScreen
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    />
  )
}

export default InputHandler
