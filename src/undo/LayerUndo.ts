import AppController from '../core/AppController'
import { Layer } from '../models/Layer'
import Undo from './BaseUndo'

// Base class for all layer operations that need to track active layer
abstract class LayerUndoWithActive<C> extends Undo<C> {
  constructor(changes: C[]) {
    super(changes)
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
    const change = this.changes[0]
    controller.addLayerAt(change.layer, change.index, false)
  }

  public redo(controller: AppController) {
    const change = this.changes[0]
    controller.deleteLayerById(change.layer.id, false)
  }
}

export class ReorderLayersUndo extends LayerUndoWithActive<{
  before: string[]
  after: string[]
}> {
  public undo(controller: AppController) {
    const change = this.changes[0]
    controller.reorderLayers(change.before, false)
  }

  public redo(controller: AppController) {
    const change = this.changes[0]
    controller.reorderLayers(change.after, false)
  }
}
