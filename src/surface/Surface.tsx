type Size = {
  h: number
  w: number
}
interface SurfaceViewProps {
  size: Size
}

const SurfaceView: React.FC<SurfaceViewProps> = (props) => {
  return (
    <div>
      <h1>surface</h1>
      {Array.from({ length: props.size.h }).map((_, i) => (
        <SurfaceRow key={i} cells={props.size.w} />
      ))}
    </div>
  )
}

interface RowProps {
  cells: number
}
const SurfaceRow: React.FC<RowProps> = (props) => {
  return (
    <div style={{ display: ' flex' }}>
      {Array.from({ length: props.cells }).map((_, i) => (
        <div key={i} style={{ width: 20, height: 20, border: '1px solid grey' }} />
      ))}
    </div>
  )
}

export default SurfaceView
