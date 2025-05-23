import AppController from '../core/AppController'
import { Color } from '../models/Color'
import { Position } from '../utils/types'
import Undo from './BaseUndo'

export default class DrawUndo extends Undo<{
  position: Position
  before: Color | null
  after: Color | null
}> {
  private layerId: string

  constructor(
    changes: {
      position: Position
      before: Color | null
      after: Color | null
    }[],
    layerId: string
  ) {
    super(changes)
    this.layerId = layerId
  }

  public undo(controller: AppController) {
    // Save current active layer
    const currentActiveLayer = controller.getActiveLayerId()

    // Switch to the layer this undo was created on
    controller.setActiveLayer(this.layerId)

    // Apply the changes
    this.changes.forEach((change) => {
      controller.setColor(change.position, change.before)
    })

    // Restore original active layer
    controller.setActiveLayer(currentActiveLayer)
  }

  public redo(controller: AppController) {
    // Save current active layer
    const currentActiveLayer = controller.getActiveLayerId()

    // Switch to the layer this undo was created on
    controller.setActiveLayer(this.layerId)

    // Apply the changes
    this.changes.forEach((change) => {
      controller.setColor(change.position, change.after)
    })

    // Restore original active layer
    controller.setActiveLayer(currentActiveLayer)
  }
}
