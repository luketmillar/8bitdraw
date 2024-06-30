import React from 'react'
import { useSizes } from './utils/Coordinates'
import AppWorld from './AppWorld'
import AppView from './AppView'
import AppController from './AppController'
import InputLayer from './utils/InputLayer'
import * as Coordinates from './utils/Coordinates'
import FillTool from './tools/FillTool'
import DrawTool from './tools/DrawTool'
import styled from 'styled-components'

const ToolBar = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`

const ColorBar = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`

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
      <InputLayer
        onMouseDown={controller.onMouseDown}
        onMouseMove={controller.onMouseMove}
        onMouseUp={controller.onMouseUp}
      />
      <ToolBar>
        <button onClick={() => controller.toolStack.replace(new FillTool(controller))}>Fill</button>
        <button onClick={() => controller.toolStack.push(new DrawTool(controller))}>Draw</button>
      </ToolBar>
      <ColorBar>
        <button onClick={() => (controller.toolStack.currentColor = '#000')}>Black</button>
        <button onClick={() => (controller.toolStack.currentColor = '#0ff')}>Teal</button>
        <button onClick={() => (controller.toolStack.currentColor = '#f00')}>Red</button>
        <button onClick={() => (controller.toolStack.currentColor = '#fff')}>White</button>
      </ColorBar>
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
