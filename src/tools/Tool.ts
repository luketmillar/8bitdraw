import AppController from '../core/AppController'
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

  protected startTransaction() {
    this.controller.transaction.start()
  }

  protected commitTransaction() {
    this.controller.transaction.commit()
  }

  protected resetTransaction() {
    this.controller.transaction.cancel()
    this.controller.transaction.start()
  }

  protected cancelTransaction() {
    this.controller.transaction.cancel()
  }
}
