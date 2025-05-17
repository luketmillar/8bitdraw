import { useEffect, useState } from 'react'
import Sketch from '../models/Sketch'
import { getPublishedSketches } from '../api/SketchAPI'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const GalleryContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`

const NewSketchButton = styled(Link)`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: #7c3aed;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: #6d28d9;
  }
`

const SketchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
`

const SketchCard = styled.a`
  overflow: hidden;
  cursor: pointer;
  border-radius: 8px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
`

const SketchSVG = styled.svg`
  height: 200px;
  width: 100%;
  display: block;
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
      <NewSketchButton to='/draw'>New sketch</NewSketchButton>
      <SketchesGrid>
        {sketches.map((sketch) => (
          <SketchCard key={sketch.id} href={`/draw/${sketch.id}`}>
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
