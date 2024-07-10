import React from 'react'
import { useSizes } from '../math/Coordinates'
import AppController from '../core/AppController'
import InputLayer from './InputLayer'
import FillTool from '../tools/FillTool'
import DrawTool from '../tools/DrawTool'
import styled from 'styled-components'
import EraseTool from '../tools/EraseTool'
import LineTool from '../tools/LineTool'
import RectangleTool from '../tools/RectangleTool'
import EventBus from '../eventbus/EventBus'

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
    const handleTouchMove = (e: TouchEvent) => e.preventDefault()
    document.body.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => document.body.removeEventListener('touchmove', handleTouchMove)
  }, [])
}

const SurfaceApp = () => {
  useDisableTouch()
  const controller = React.useMemo(() => new AppController(), [])
  React.useEffect(() => {
    return () => {
      controller.teardown()
    }
  }, [controller])
  const ref = React.useRef<HTMLCanvasElement>(null)
  React.useEffect(() => {
    controller.view.canvas = ref.current!
    controller.start()
    return () => controller.stop()
  }, [controller.view, ref.current, controller])

  return (
    <>
      <FullScreenCanvas ref={ref} />
      <InputLayer
        view={controller.view}
        onMouseDown={(position, metaKey) =>
          EventBus.emit('mouse-input', 'down', { position, metaKey })
        }
        onMouseMove={(position, metaKey) =>
          EventBus.emit('mouse-input', 'move', { position, metaKey })
        }
        onMouseUp={(position, metaKey) => EventBus.emit('mouse-input', 'up', { position, metaKey })}
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
      {/* <LayerBar>
        <button onClick={() => controller.world.sketch.newLayer()}>New</button>
        <button onClick={() => controller.world.sketch.deleteLayer()}>Delete</button>
        <button onClick={() => controller.world.sketch.flipLayers()}>Flip</button>
      </LayerBar> */}
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
