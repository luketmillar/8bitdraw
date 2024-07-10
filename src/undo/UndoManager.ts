import AppController from '../core/AppController'
import Undo from './BaseUndo'

export default class UndoManager {
  private stack: Undo[] = []
  private pointer: number = 0
  private controller: AppController
  constructor(controller: AppController) {
    this.controller = controller
  }

  public push = (undo: Undo) => {
    this.stack = this.stack.slice(0, this.pointer)
    this.stack.push(undo)
    this.pointer = this.stack.length
    this.notify()
  }

  public undo = () => {
    if (this.pointer === 0) {
      return
    }
    this.pointer--
    const undo = this.stack[this.pointer]
    undo.undo(this.controller)
    this.notify()
  }

  public redo = () => {
    if (this.pointer === this.stack.length) {
      return
    }
    const undo = this.stack[this.pointer]
    undo.redo(this.controller)
    this.pointer++
    this.notify()
  }

  public canUndo = () => {
    return this.pointer > 0
  }

  public canRedo = () => {
    return this.pointer < this.stack.length
  }

  private subs: Array<() => void> = []
  public subscribe = (callback: () => void) => {
    this.subs.push(callback)
    return () => {
      this.subs = this.subs.filter((s) => s !== callback)
    }
  }
  private notify = () => {
    this.subs.forEach((s) => s())
  }
}
