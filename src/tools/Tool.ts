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

  public onStart(_position: Position) {}
  public onMove(_position: Position) {}
  public onEnd(_position: Position) {}

  public getObjects(): BaseObject[] {
    return []
  }
  public onUpdate() {}

  protected get toolStack() {
    return this.controller.toolStack
  }

  protected startOverride() {
    this.controller.world.sketch.startOverrides()
  }

  protected commitOverride() {
    this.controller.world.sketch.commitOverrides()
  }

  protected resetOverrides() {
    this.controller.world.sketch.resetOverrides()
  }

  protected cancelOverrides() {
    this.controller.world.sketch.cancelOverrides()
  }
}
