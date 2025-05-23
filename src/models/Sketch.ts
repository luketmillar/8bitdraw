import { Position, Size } from '../utils/types'
import Model from './Base'
import Pixel from './Pixel'
import { pixelKey } from './utils'
import { Layer } from './Layer'
import { Color } from './Color'
import { SketchJSON } from '../api/JSON'
import { v4 as uuid } from 'uuid'
import { vec2 } from 'gl-matrix'
import EventBus from '../eventbus/EventBus'

type SketchOptions = {
  id?: string
  title?: string
  artist?: string
  layers?: Layer[]
  size: Size
}

export default class Sketch extends Model {
  public size: Size
  public id: string
  public title: string
  public artist: string

  constructor(options: SketchOptions) {
    super()
    this.id = options.id ?? uuid()
    this.title = options.title ?? 'Untitled'
    this.artist = options.artist ?? 'Anonymous'
    this.size = options.size
    this.layers = options.layers ?? [new Layer('Background')]
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
  public newLayer(title?: string) {
    const layer = new Layer(title)
    this.layers.push(layer)
    this.activeLayerId = layer.id
  }

  public addLayer(layer: Layer) {
    this.layers.push(layer)
    this.activeLayerId = layer.id
    EventBus.emit('sketch', 'changed', '')
  }

  public addLayerAt(layer: Layer, index: number) {
    if (index < 0) index = 0
    if (index > this.layers.length) index = this.layers.length

    this.layers.splice(index, 0, layer)
    this.activeLayerId = layer.id
    EventBus.emit('sketch', 'changed', '')
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
    EventBus.emit('sketch', 'changed', '')
  }
  public flipLayers() {
    for (let i = 0; i < this.layers.length / 2; i++) {
      const temp = this.layers[i]
      this.layers[i] = this.layers[this.layers.length - i - 1]
      this.layers[this.layers.length - i - 1] = temp
    }
  }

  public reorderLayers(layerIds: string[]) {
    const newLayers: Layer[] = []
    for (const id of layerIds) {
      const layer = this.layers.find((l) => l.id === id)
      if (layer) {
        newLayers.push(layer)
      }
    }
    this.layers = newLayers
  }

  // mutations
  public setColor(position: Position, color: Color | null) {
    this.activeLayer.pixels.set(pixelKey(position), new Pixel(position, color))
  }
  public getColor(position: Position): Color | null {
    return this.activeLayer.pixels.get(pixelKey(position))?.fill ?? null
  }
  public getColors(): Color[] {
    return this.layers
      .map((layer) => layer.pixels.getAll().map((pixel) => pixel.fill))
      .flat()
      .reduce((result: Color[], color) => {
        if (color && !result.find((c) => c.equals(color))) {
          result.push(color)
        }
        return result
      }, [] as Color[])
  }

  // model to views
  public getViews() {
    return this.layers.map((layer) => layer.getViews()).flat()
  }

  public toJSON(): SketchJSON {
    return {
      id: this.id,
      title: this.title,
      artist: this.artist,
      size: {
        w: this.size[0],
        h: this.size[1],
      },
      layers: this.layers.map((layer) => layer.toJSON()),
    }
  }

  public static fromJSON(json: SketchJSON): Sketch {
    const sketch = new Sketch({
      id: json.id,
      title: json.title,
      artist: json.artist,
      size: vec2.fromValues(json.size.w, json.size.h),
      layers: json.layers.map((layer) => Layer.fromJSON(layer)),
    })
    return sketch
  }
}
