import AppController from '../core/AppController'
import { Layer } from '../models/Layer'
import Undo from './BaseUndo'

// Base class for all layer operations that need to track active layer
abstract class LayerUndoWithActive<C> extends Undo<C> {
  constructor(changes: C[]) {
    super(changes)
  }

  protected saveAndRestoreActiveLayer(controller: AppController, operation: () => void) {
    // Save current active layer
    const currentActiveLayer = controller.getActiveLayerId()

    // Perform the operation
    operation()

    // Restore original active layer
    controller.setActiveLayer(currentActiveLayer)
  }
}

export class NewLayerUndo extends LayerUndoWithActive<{
  layer: Layer
  index?: number
}> {
  public undo(controller: AppController) {
    const change = this.changes[0]
    controller.deleteLayerById(change.layer.id, false)
  }

  public redo(controller: AppController) {
    const change = this.changes[0]
    controller.addLayerAt(change.layer, change.index ?? 0, false)
  }
}

export class DeleteLayerUndo extends LayerUndoWithActive<{
  layer: Layer
  index: number
}> {
  public undo(controller: AppController) {
    this.saveAndRestoreActiveLayer(controller, () => {
      const change = this.changes[0]
      controller.addLayerAt(change.layer, change.index, false) // Add the layer back at its original position
    })
  }

  public redo(controller: AppController) {
    this.saveAndRestoreActiveLayer(controller, () => {
      const change = this.changes[0]
      controller.deleteLayerById(change.layer.id, false) // Delete without creating an undo entry
    })
  }
}

export class ReorderLayersUndo extends LayerUndoWithActive<{
  before: string[]
  after: string[]
}> {
  public undo(controller: AppController) {
    this.saveAndRestoreActiveLayer(controller, () => {
      const change = this.changes[0]
      controller.reorderLayers(change.before, false) // Restore previous order
    })
  }

  public redo(controller: AppController) {
    this.saveAndRestoreActiveLayer(controller, () => {
      const change = this.changes[0]
      controller.reorderLayers(change.after, false) // Apply new order
    })
  }
}
