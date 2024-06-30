import EventEmitter from './EventEmitter'
import { Position } from './types'
import * as Coordinates from './Coordinates'
import AppWorld from '../AppWorld'
import AppView from '../AppView'

interface DownOptions {
  position: Position
}

type EventOptions = { metaKey?: boolean }
type EventPayload = { position: Position; options: EventOptions }

export enum InputEvent {
  Start = 'start',
  Move = 'move',
  End = 'end',
}

export default class InputHandler extends EventEmitter<
  | { type: InputEvent.Start; payload: EventPayload }
  | { type: InputEvent.Move; payload: EventPayload }
  | { type: InputEvent.End; payload: {} }
> {
  private readonly world: AppWorld
  private readonly view: AppView

  private downOptions: DownOptions | null = null
  private get isMoving() {
    return this.downOptions !== null
  }

  constructor(world: AppWorld, view: AppView) {
    super()
    this.world = world
    this.view = view
  }

  public onMouseDown(canvasPosition: Position, options: EventOptions) {
    const sketchPosition = this.toSketchSpace(canvasPosition)
    this.downOptions = { position: sketchPosition }
    this.emit(InputEvent.Start, { position: sketchPosition, options })
  }

  public onMouseMove(canvasPosition: Position, options: EventOptions) {
    if (!this.isMoving) return
    const sketchPosition = this.toSketchSpace(canvasPosition)
    if (Coordinates.positionsAreEqual(this.downOptions!.position, sketchPosition)) return
    this.emit(InputEvent.Move, { position: sketchPosition, options })
  }

  public onMouseUp(_canvasPosition: Position, _options: EventOptions) {
    if (!this.isMoving) return
    this.downOptions = null
    this.emit(InputEvent.End, {})
  }

  private toSketchSpace = (position: Position) =>
    Coordinates.canvasToSketch(position, this.world.sketch.size, this.view.gutter)
}
