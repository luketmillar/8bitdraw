import React from 'react'
import { Position } from '../utils/types'
import styled from 'styled-components'
import { vec2 } from 'gl-matrix'
import { useKeyboardCommands } from './KeyboardInput'
import AppController from '../core/AppController'

const FullScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`

interface IProps {
  controller: AppController
  onClick?: (position: Position, metaKey?: boolean) => void
  onMouseMove?: (position: Position, metaKey?: boolean) => void
  onMouseUp?: (position: Position, metaKey?: boolean) => void
  onMouseDown?: (position: Position, metaKey?: boolean) => void
}
const InputLayer = ({ controller, onClick, onMouseMove, onMouseUp, onMouseDown }: IProps) => {
  useKeyboardCommands(controller)
  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      const position = controller.view.spaces.screenToCanvas(vec2.fromValues(e.clientX, e.clientY))
      onClick?.(position, e.metaKey)
    },
    [onClick]
  )
  const handleTouchStart = React.useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      const position = controller.view.spaces.screenToCanvas(
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
      const position = controller.view.spaces.screenToCanvas(vec2.fromValues(e.clientX, e.clientY))
      onMouseDown?.(position, e.metaKey)
    },
    [onMouseDown]
  )
  React.useEffect(() => {
    const handleUp = (e: MouseEvent) => {
      const position = controller.view.spaces.screenToCanvas(vec2.fromValues(e.clientX, e.clientY))
      onMouseUp?.(position, e.metaKey)
    }
    window.addEventListener('mouseup', handleUp)
    return () => window.removeEventListener('mouseup', handleUp)
  }, [onMouseUp])
  React.useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const position = controller.view.spaces.screenToCanvas(vec2.fromValues(e.clientX, e.clientY))
      onMouseMove?.(position, e.metaKey)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [onMouseMove])
  React.useEffect(() => {
    const handleMove = (e: TouchEvent) => {
      e.preventDefault()
      const position = controller.view.spaces.screenToCanvas(
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
