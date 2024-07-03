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
import EraseTool from './tools/EraseTool'
import LineTool from './tools/LineTool'
import RectangleTool from './tools/RectangleTool'
import { vec2 } from 'gl-matrix'

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

const LayerBar = styled.div`
  position: absolute;
  bottom: 20px;
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
  const world = React.useMemo(() => new AppWorld(vec2.fromValues(10, 15)), [])
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
        <button onClick={() => controller.toolStack.push(new LineTool(controller))}>Line</button>
        <button onClick={() => controller.toolStack.push(new EraseTool(controller))}>Erase</button>
        <button onClick={() => controller.toolStack.push(new RectangleTool(controller))}>
          Rectangle
        </button>
      </ToolBar>
      <ColorBar>
        <button onClick={() => (controller.toolStack.currentColor = '#000')}>Black</button>
        <button onClick={() => (controller.toolStack.currentColor = '#0ff')}>Teal</button>
        <button onClick={() => (controller.toolStack.currentColor = '#f00')}>Red</button>
        <button onClick={() => (controller.toolStack.currentColor = '#fff')}>White</button>
      </ColorBar>
      <LayerBar>
        <button onClick={() => controller.world.sketch.newLayer()}>New</button>
        <button onClick={() => controller.world.sketch.deleteLayer()}>Delete</button>
        <button onClick={() => controller.world.sketch.flipLayers()}>Flip</button>
      </LayerBar>
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
      const sketchInCanvasSpace = Coordinates.sketchToCanvas(world.sketch.size, world.sketch.size)
      view.gutter = {
        left: (canvasSize[0] - sketchInCanvasSpace[0]) / 2,
        top: (canvasSize[1] - sketchInCanvasSpace[1]) / 2,
      }
    }, [canvasSize[0], canvasSize[1]])
    return (
      <canvas
        ref={ref}
        width={screenSize[0] * window.devicePixelRatio}
        height={screenSize[1] * window.devicePixelRatio}
        style={{ width: screenSize[0], height: screenSize[1] }}
      />
    )
  }
)

export default SurfaceApp
