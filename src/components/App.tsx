import React from 'react'
import { useSizes } from '../math/Coordinates'
import AppController from '../core/AppController'
import InputLayer from './InputLayer'
import EventBus from '../eventbus/EventBus'
import { PanelLayout } from './panels/PanelLayout'
import Sketch from '../models/Sketch'

// const LayerBar = styled.div`
//   position: absolute;
//   bottom: 20px;
//   right: 20px;
//   z-index: 1000;
//   display: flex;
//   flex-direction: column;
// `

const useDisableTouch = () => {
  React.useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      // Only prevent default if the touch event is on the canvas
      if (e.target instanceof HTMLCanvasElement) {
        e.preventDefault()
      }
    }
    document.body.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => document.body.removeEventListener('touchmove', handleTouchMove)
  }, [])
}

interface SurfaceAppProps {
  initialSketch?: Sketch
}

const SurfaceApp = ({ initialSketch }: SurfaceAppProps) => {
  useDisableTouch()
  const controller = React.useMemo(() => new AppController(), [])
  const ref = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    controller.view.canvas = ref.current!
    controller.start()
    return () => controller.stop()
  }, [controller.view, ref.current, controller])

  React.useEffect(() => {
    if (initialSketch) {
      controller.loadSketch(initialSketch)
    }
  }, [initialSketch, controller])

  return (
    <>
      <FullScreenCanvas ref={ref} />
      <InputLayer
        controller={controller}
        onMouseDown={(position, metaKey) =>
          EventBus.emit('mouse-input', 'down', { position, metaKey })
        }
        onMouseMove={(position, metaKey) =>
          EventBus.emit('mouse-input', 'move', { position, metaKey })
        }
        onMouseUp={(position, metaKey) => EventBus.emit('mouse-input', 'up', { position, metaKey })}
      />
      <PanelLayout controller={controller} />
    </>
  )
}

const FullScreenCanvas = React.forwardRef((_, ref: React.ForwardedRef<HTMLCanvasElement>) => {
  const { screenSize, canvasSize } = useSizes()
  return (
    <canvas
      ref={ref}
      width={canvasSize[0]}
      height={canvasSize[1]}
      style={{ width: screenSize[0], height: screenSize[1] }}
    />
  )
})

export default SurfaceApp
