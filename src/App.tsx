import React from 'react'
import { useSizes } from './utils/Coordinates'
import World from './World'
import View from './View'
import Controller from './Controller'
import InputHandler from './utils/InputHandler'

const useDisableTouch = () => {
  React.useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => e.preventDefault()
    document.body.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => document.body.removeEventListener('touchmove', handleTouchMove)
  }, [])
}

const SurfaceApp = () => {
  useDisableTouch()
  const world = React.useMemo(() => new World(), [])
  const view = React.useMemo(() => new View(), [])
  const controller = React.useMemo(() => new Controller(world, view), [world, view])
  const ref = React.useRef<HTMLCanvasElement>(null)
  React.useEffect(() => {
    view.canvas = ref.current!
    controller.start()
    return () => controller.stop()
  }, [view, ref.current, controller])

  return (
    <>
      <FullScreenCanvas view={view} world={world} ref={ref} />
      <InputHandler
        onMouseDown={controller.onMouseDown}
        onMouseMove={controller.onMouseMove}
        onMouseUp={controller.onMouseUp}
      />
    </>
  )
}

const FullScreenCanvas = React.forwardRef(
  ({ view, world }: { view: View; world: World }, ref: React.ForwardedRef<HTMLCanvasElement>) => {
    const { screenSize } = useSizes()
    const canvasSize = view.getCanvasSize(world, screenSize)
    React.useEffect(() => {
      view.gutter = {
        left: (canvasSize.width - world.size.width) / 2,
        top: (canvasSize.height - world.size.height) / 2,
      }
    }, [canvasSize.width, canvasSize.height, world.size.width, world.size.height])
    return (
      <canvas
        ref={ref}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{ width: screenSize.width, height: screenSize.height }}
      />
    )
  }
)

export default SurfaceApp
