import AppController from '../AppController'
import { Color, Position } from '../utils/types'
import Undo from './BaseUndo'

export default class DrawUndo extends Undo<{
  position: Position
  before: Color | undefined
  after: Color | undefined
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
