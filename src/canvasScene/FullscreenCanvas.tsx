import React from 'react'
import { useSizes } from './Coordinates'

const FullScreenCanvas = React.forwardRef((_, ref: React.ForwardedRef<HTMLCanvasElement>) => {
    const { screenSize, worldSize } = useSizes()
    return <canvas ref={ref} width={worldSize.width} height={worldSize.height} style={{ width: screenSize.width, height: screenSize.height }} />
})

export default FullScreenCanvas