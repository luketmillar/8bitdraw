import React from 'react'
import { useSizes } from './utils/Coordinates'
import AppWorld from './AppWorld'
import AppView from './AppView'
import AppController from './AppController'
import InputHandler from './utils/InputHandler'
import * as Coordinates from './utils/Coordinates'

const useDisableTouch = () => {
  React.useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => e.preventDefault()
    document.body.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => document.body.removeEventListener('touchmove', handleTouchMove)
  }, [])
}

const SurfaceApp = () => {
  useDisableTouch()
  const world = React.useMemo(() => new AppWorld({ width: 400, height: 300 }), [])
  const view = React.useMemo(() => new AppView(), [])
  const controller = React.useMemo(() => new AppController(world, view), [world, view])
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
  (
    { view, world }: { view: AppView; world: AppWorld },
    ref: React.ForwardedRef<HTMLCanvasElement>
  ) => {
    const { screenSize } = useSizes()
    React.useEffect(() => {
      const screenInCanvasSpace = Coordinates.screenToCanvas({
        x: screenSize.width,
        y: screenSize.height,
      })
      const screenInSketchSpace = Coordinates.canvasToSketch(screenInCanvasSpace, world.sketch.size)
      view.gutter = {
        left: (screenInSketchSpace.x - world.sketch.size.width) / 2,
        top: (screenInSketchSpace.y - world.sketch.size.height) / 2,
      }
    }, [screenSize.width, screenSize.height])
    return (
      <canvas
        ref={ref}
        width={screenSize.width * window.devicePixelRatio}
        height={screenSize.height * window.devicePixelRatio}
        style={{ width: screenSize.width, height: screenSize.height }}
      />
    )
  }
)

export default SurfaceApp
