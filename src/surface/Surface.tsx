import React from 'react'
import FullScreenCanvas from '../canvasScene/FullscreenCanvas'
import InputHandler from '../canvasScene/InputHandler'
import SurfaceController from './Controller'
import SurfaceWorld from './model/World'

interface SurfaceViewProps {}

const useController = (ref: React.RefObject<HTMLCanvasElement>) => {
  const [controller, setController] = React.useState<SurfaceController | undefined>()
  React.useEffect(() => {
    const controller = new SurfaceController(
      ref.current!,
      new SurfaceWorld({ width: 40, height: 20 })
    )
    setController(controller)
    controller.start()
    return () => controller.stop()
  }, [ref])
  return controller
}

const SurfaceView: React.FC<SurfaceViewProps> = (props) => {
  const ref = React.useRef<HTMLCanvasElement>(null)
  const controller = useController(ref)
  return (
    <div style={{ position: 'absolute', top: 0, left: 0 }}>
      <FullScreenCanvas ref={ref} />
      {controller && (
        <InputHandler onClick={controller.onClick} onMouseMove={controller.onMouseMove} />
      )}
    </div>
  )
}

export default SurfaceView
