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
  const world = React.useMemo(() => new AppWorld({ width: 20, height: 30 }), [])
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
    const { screenSize, canvasSize } = useSizes()
    React.useEffect(() => {
      const sketchInCanvasSpace = Coordinates.sketchToCanvas(
        {
          x: world.sketch.size.width,
          y: world.sketch.size.height,
        },
        world.sketch.size
      )
      view.gutter = {
        left: (canvasSize.width - sketchInCanvasSpace.x) / 2,
        top: (canvasSize.height - sketchInCanvasSpace.y) / 2,
      }
    }, [canvasSize.width, canvasSize.height])
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
