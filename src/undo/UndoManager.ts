import AppController from '../core/AppController'
import EventBus from '../eventbus/EventBus'
import Undo from './BaseUndo'

export default class UndoManager {
  private stack: Undo[] = []
  private pointer: number = 0
  private controller: AppController
  constructor(controller: AppController) {
    this.controller = controller
  }

  public start() {
    EventBus.on('undo', 'push', this.push)
  }

  public stop() {
    EventBus.off('undo', 'push', this.push)
  }

  public push = (undo: Undo) => {
    if (undo.changes.length === 0) return
    this.stack = this.stack.slice(0, this.pointer)
    this.stack.push(undo)
    this.pointer = this.stack.length
    EventBus.emit('undo', 'stack-changed', '')
  }

  public undo = () => {
    if (this.pointer === 0) {
      return
    }
    this.pointer--
    const undo = this.stack[this.pointer]
    undo.undo(this.controller)
    EventBus.emit('undo', 'stack-changed', '')
  }

  public redo = () => {
    if (this.pointer === this.stack.length) {
      return
    }
    const undo = this.stack[this.pointer]
    undo.redo(this.controller)
    this.pointer++
    EventBus.emit('undo', 'stack-changed', '')
  }

  public canUndo = () => {
    return this.pointer > 0
  }

  public canRedo = () => {
    return this.pointer < this.stack.length
  }
}
