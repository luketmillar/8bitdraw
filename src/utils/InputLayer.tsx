import React from 'react'
import { Position } from './types'
import * as Coordinates from './Coordinates'
import styled from 'styled-components'
import { vec2 } from 'gl-matrix'

const FullScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`

interface IProps {
  onClick?: (position: Position, metaKey?: boolean) => void
  onMouseMove?: (position: Position, metaKey?: boolean) => void
  onMouseUp?: (position: Position, metaKey?: boolean) => void
  onMouseDown?: (position: Position, metaKey?: boolean) => void
}
const InputLayer = ({ onClick, onMouseMove, onMouseUp, onMouseDown }: IProps) => {
  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      const position = Coordinates.screenToCanvas(vec2.fromValues(e.clientX, e.clientY))
      onClick?.(position, e.metaKey)
    },
    [onClick]
  )
  const handleTouchStart = React.useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      const position = Coordinates.screenToCanvas(
        vec2.fromValues(e.touches[0].clientX, e.touches[0].clientY)
      )
      onMouseDown?.(position, e.metaKey)
    },
    [onMouseDown]
  )
  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      if (e.detail !== 1 || e.button !== 0) {
        return
      }
      const position = Coordinates.screenToCanvas(vec2.fromValues(e.clientX, e.clientY))
      onMouseDown?.(position, e.metaKey)
    },
    [onMouseDown]
  )
  React.useEffect(() => {
    const handleUp = (e: MouseEvent) => {
      const position = Coordinates.screenToCanvas(vec2.fromValues(e.clientX, e.clientY))
      onMouseUp?.(position, e.metaKey)
    }
    window.addEventListener('mouseup', handleUp)
    return () => window.removeEventListener('mouseup', handleUp)
  }, [onMouseUp])
  React.useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const position = Coordinates.screenToCanvas(vec2.fromValues(e.clientX, e.clientY))
      onMouseMove?.(position, e.metaKey)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [onMouseMove])
  React.useEffect(() => {
    const handleMove = (e: TouchEvent) => {
      e.preventDefault()
      const position = Coordinates.screenToCanvas(
        vec2.fromValues(e.touches[0].clientX, e.touches[0].clientY)
      )
      onMouseMove?.(position, e.metaKey)
    }
    window.addEventListener('touchmove', handleMove)
    return () => window.removeEventListener('touchmove', handleMove)
  }, [onMouseMove])
  React.useEffect(() => {
    const handleEnd = (e: TouchEvent) => {
      e.preventDefault()
      onMouseUp?.(vec2.fromValues(0, 0), e.metaKey)
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

export default InputLayer
