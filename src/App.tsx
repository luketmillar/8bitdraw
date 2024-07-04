import React from 'react'
import { useSizes } from './utils/Coordinates'
import AppWorld from './AppWorld'
import AppView from './AppView'
import AppController from './AppController'
import InputLayer from './utils/InputLayer'
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
  const world = React.useMemo(() => new AppWorld(vec2.fromValues(40, 30)), [])
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
      <FullScreenCanvas ref={ref} />
      <InputLayer
        view={view}
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
