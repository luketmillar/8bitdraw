import { useEffect, useState } from 'react'
import Sketch from '../models/Sketch'
import { getPublishedSketches } from '../api/SketchAPI'
import styled from 'styled-components'

const GalleryContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`

const SketchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`

const SketchCard = styled.div`
  overflow: hidden;
`

const SketchSVG = styled.svg`
  height: 200px;
`

function GalleryPage() {
  const [sketches, setSketches] = useState<Sketch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSketches() {
      try {
        const fetchedSketches = await getPublishedSketches()
        setSketches(fetchedSketches)
      } finally {
        setLoading(false)
      }
    }

    fetchSketches()
  }, [])

  if (loading) {
    return <GalleryContainer>Loading sketches...</GalleryContainer>
  }

  return (
    <GalleryContainer>
      <SketchesGrid>
        {sketches.map((sketch) => (
          <SketchCard key={sketch.id}>
            <SketchSVG
              viewBox={`0 0 ${sketch.size[0]} ${sketch.size[1]}`}
              width='200'
              height='200'
              shapeRendering='crispEdges'
            >
              {sketch.getViews().map((view, index) => (
                <rect
                  key={index}
                  x={Math.floor(view.position[0])}
                  y={Math.floor(view.position[1])}
                  width={1}
                  height={1}
                  fill={view.options.fill?.toRGBA() ?? 'transparent'}
                />
              ))}
            </SketchSVG>
          </SketchCard>
        ))}
      </SketchesGrid>
    </GalleryContainer>
  )
}

export default GalleryPage
