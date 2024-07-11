import AppController from '../core/AppController'
import { Color, Position } from '../utils/types'
import Undo from './BaseUndo'

export default class DrawUndo extends Undo<{
  position: Position
  before: Color | null
  after: Color | null
}> {
  public undo(controller: AppController) {
    this.changes.forEach((change) => {
      controller.setColor(change.position, change.before)
    })
  }
  public redo(controller: AppController) {
    this.changes.forEach((change) => {
      controller.setColor(change.position, change.after)
    })
  }
}
