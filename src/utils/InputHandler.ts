import { Position } from './types'
import * as Coordinates from '../math/Coordinates'
import AppView from '../core/AppView'
import EventBus from '../eventbus/EventBus'

interface DownOptions {
  position: Position
}

var i = 0

type MouseInputPayload = { position: Position; metaKey?: boolean }
export default class InputHandler {
  private readonly view: AppView

  private downOptions: DownOptions | null = null
  private lastPosition: Position | null = null
  private get isMoving() {
    return this.downOptions !== null
  }

  public i: number
  constructor(view: AppView) {
    this.view = view
    this.i = i
    i++
    EventBus.on('mouse-input', 'down', this.onMouseDown)
    EventBus.on('mouse-input', 'up', this.onMouseUp)
    EventBus.on('mouse-input', 'move', this.onMouseMove)
  }

  public onMouseDown = ({ position, metaKey }: MouseInputPayload) => {
    const sketchPosition = this.toSketchSpace(position)
    this.downOptions = { position: sketchPosition }
    this.lastPosition = sketchPosition
    EventBus.emit('tool', 'start', { position: sketchPosition, metaKey })
  }

  public onMouseMove = ({ position, metaKey }: MouseInputPayload) => {
    if (!this.isMoving) return
    const sketchPosition = this.toSketchSpace(position)
    if (Coordinates.positionsAreEqual(this.lastPosition!, sketchPosition)) return
    this.lastPosition = sketchPosition
    EventBus.emit('tool', 'move', { position: sketchPosition, metaKey })
  }

  public onMouseUp = ({ position, metaKey }: MouseInputPayload) => {
    if (!this.isMoving) return
    this.downOptions = null
    this.lastPosition = null
    const sketchPosition = this.toSketchSpace(position)
    EventBus.emit('tool', 'end', { position: sketchPosition, metaKey })
  }

  public teardown() {
    EventBus.off('mouse-input', 'down', this.onMouseDown)
    EventBus.off('mouse-input', 'up', this.onMouseUp)
    EventBus.off('mouse-input', 'move', this.onMouseMove)
  }

  private toSketchSpace = (position: Position) => this.view.spaces.canvasToWorldSpace(position)
}
