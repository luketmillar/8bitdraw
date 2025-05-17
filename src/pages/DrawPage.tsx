import SurfaceApp from '../components/App'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Sketch from '../models/Sketch'
import { getPublishedSketches } from '../api/SketchAPI'

function DrawPage() {
  const { sketchId } = useParams()
  const [sketch, setSketch] = useState<Sketch | undefined>()

  useEffect(() => {
    async function loadSketch() {
      if (!sketchId) return

      const sketches = await getPublishedSketches()
      const foundSketch = sketches.find((s) => s.id === sketchId)
      if (foundSketch) {
        setSketch(foundSketch)
      }
    }

    loadSketch()
  }, [sketchId])

  return (
    <div className='draw-page'>
      <SurfaceApp initialSketch={sketch} />
    </div>
  )
}

export default DrawPage
