export interface ColorJSON {
  hex: string
  opacity: number
}

interface PositionJSON {
  x: number
  y: number
}

export interface PixelJSON {
  position: PositionJSON
  fill: ColorJSON | null
}

export interface LayerJSON {
  id: string
  title: string
  pixels: PixelJSON[]
}

export interface SizeJSON {
  w: number
  h: number
}

export interface SketchJSON {
  id: string
  title: string
  artist: string
  size: SizeJSON
  layers: LayerJSON[]
}
