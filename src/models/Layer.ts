import Overrideable from '../utils/Overrideable'
import Model from './Base'
import { v4 as uuid } from 'uuid'
import Pixel from './Pixel'
import { parsePixelKey, pixelKey } from './utils'
import EventBus from '../eventbus/EventBus'
import DrawUndo from '../undo/DrawUndo'
import { vec2 } from 'gl-matrix'
import { Color } from './Color'
import { LayerJSON } from '../api/JSON'

const createPixels = (pixels: Overrideable<Pixel>) => {
  pixels.clear()
}

class PixelMap extends Overrideable<Pixel> {
  public commit() {
    const changes = Object.keys(this.overrides).map((key) => {
      const position = parsePixelKey(key)
      return { position, before: this.values[key]?.fill, after: this.overrides[key]?.fill }
    })
    EventBus.emit('undo', 'push', new DrawUndo(changes))
    super.commit()
  }
}

interface LayerMetadata {
  title: string
}

export class Layer extends Model {
  public id = uuid()
  public pixels: PixelMap
  public metadata: LayerMetadata

  constructor(title?: string) {
    super()
    this.pixels = new PixelMap()
    createPixels(this.pixels)
    this.metadata = {
      title: title ?? `Layer ${uuid().slice(0, 4)}`,
    }
  }

  public getViews() {
    return this.pixels
      .getAll()
      .map((pixel) => pixel.getViews())
      .flat()
  }

  public getMostUsedColor(): Color | null {
    const colorCounts = new Map<string, { color: Color; count: number }>()

    this.pixels.getAll().forEach((pixel) => {
      if (pixel.fill) {
        const key = pixel.fill.toRGBA()
        const existing = colorCounts.get(key)
        if (existing) {
          existing.count++
        } else {
          colorCounts.set(key, { color: pixel.fill, count: 1 })
        }
      }
    })

    let maxCount = 0
    let mostUsedColor: Color | null = null

    colorCounts.forEach(({ color, count }) => {
      if (count > maxCount) {
        maxCount = count
        mostUsedColor = color
      }
    })

    return mostUsedColor
  }

  public toJSON(): LayerJSON {
    return {
      id: this.id,
      title: this.metadata.title,
      pixels: this.pixels.getAll().map((pixel) => pixel.toJSON()),
    }
  }

  public static fromJSON(json: LayerJSON): Layer {
    const layer = new Layer(json.title)
    for (const pixel of json.pixels) {
      layer.pixels.set(
        pixelKey(vec2.fromValues(pixel.position.x, pixel.position.y)),
        Pixel.fromJSON(pixel)
      )
    }
    return layer
  }
}
