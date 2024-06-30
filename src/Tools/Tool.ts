import Controller from '../AppController'
import BaseObject from '../models/Base'
import EventEmitter from '../utils/EventEmitter'
import { Position } from '../utils/types'

export default class Tool extends EventEmitter<{
  type: 'objects-changed'
  payload: { previous: BaseObject[]; next: BaseObject[] }
}> {
  protected readonly controller: Controller
  constructor(controller: Controller) {
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
