import AppController from '../AppController'
import BaseObject from '../models/Base'
import EventEmitter from '../utils/EventEmitter'
import { Color, Position } from '../utils/types'

export default class Tool extends EventEmitter<{
  type: 'pixels-changed'
  payload: { pixels: Array<{ index: Position; color: Color | null }> }
}> {
  protected readonly controller: AppController
  constructor(controller: AppController) {
    super()
    this.controller = controller
  }
  public initialize() {}
  public teardown() {}

  public onMouseDown(_position: Position) {}
  public onMouseUp() {}
  public onMouseMove(_position: Position) {}

  public getObjects(): BaseObject[] {
    return []
  }
  public onUpdate() {}
}
