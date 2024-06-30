import AppController from '../AppController'
import BaseObject from '../models/Base'
import { Position } from '../utils/types'

export default class Tool {
  protected readonly controller: AppController
  constructor(controller: AppController) {
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
