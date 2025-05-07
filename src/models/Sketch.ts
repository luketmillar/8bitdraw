import { vec2 } from 'gl-matrix'
import Overrideable from '../utils/Overrideable'
import { Color, Position, Size } from '../utils/types'
import Model from './Base'
import Pixel from './Pixel'
import { v4 as uuid } from 'uuid'
import EventBus from '../eventbus/EventBus'
import DrawUndo from '../undo/DrawUndo'
import { parsePixelKey, pixelKey } from './utils'

const createPixels = (pixels: Overrideable<Pixel>, size: Size) => {
  pixels.clear()
  for (let x = 0; x < size[0]; x++) {
    for (let y = 0; y < size[1]; y++) {
      pixels.set(pixelKey(vec2.fromValues(x, y)), new Pixel(vec2.fromValues(x, y), null))
    }
  }
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

class Layer extends Model {
  public id = uuid()
  public pixels: PixelMap

  constructor(size: Size) {
    super()
    this.pixels = new PixelMap()
    createPixels(this.pixels, size)
  }

  public getViews() {
    return this.pixels
      .getAll()
      .map((pixel) => pixel.getViews())
      .flat()
  }
}

export default class Sketch extends Model {
  public size: Size

  constructor(size: Size) {
    super()
    this.size = size
    this.layers = [new Layer(size)]
    this.activeLayerId = this.layers[0].id
  }

  // layers
  public layers: Layer[]
  public activeLayerId: string
  public get activeLayer() {
    return this.layers.find((layer) => layer.id === this.activeLayerId)!
  }
  public get activeLayerIndex() {
    return this.layers.findIndex((layer) => layer.id === this.activeLayerId)
  }
  public newLayer() {
    const layer = new Layer(this.size)
    this.layers.push(layer)
    this.activeLayerId = layer.id
  }
  public deleteLayer(id?: string) {
    if (!id) {
      id = this.activeLayerId
    }
    this.layers = this.layers.filter((layer) => layer.id !== id)
    if (this.activeLayerId === id) {
      const newIndex = Math.max(this.activeLayerIndex - 1, 0)
      this.activeLayerId = this.layers[newIndex].id
    }
  }
  public flipLayers() {
    for (let i = 0; i < this.layers.length / 2; i++) {
      const temp = this.layers[i]
      this.layers[i] = this.layers[this.layers.length - i - 1]
      this.layers[this.layers.length - i - 1] = temp
    }
  }

  // mutations
  public setColor(position: Position, color: Color | null) {
    this.activeLayer.pixels.set(pixelKey(position), new Pixel(position, color))
  }
  public getColor(position: Position): Color | null {
    return this.activeLayer.pixels.get(pixelKey(position))?.fill ?? null
  }

  // model to views
  public getViews() {
    return this.layers.map((layer) => layer.getViews()).flat()
  }
}
