import AppController from '../AppController'
import { Color, Position } from '../utils/types'

export abstract class Undo<C = any> {
  public readonly changes: C[]

  constructor(changes: C[]) {
    this.changes = changes
  }

  public abstract undo(controller: AppController): void
  public abstract redo(controller: AppController): void
}

export type DrawChange = { position: Position; before: Color | undefined; after: Color | undefined }
export class DrawUndo extends Undo<DrawChange> {
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
// class LayerUndo extends Undo<Change> {
//   public undo(controller: AppController) {}
//   public redo(controller: AppController) {}
// }
// class SketchUndo extends Undo<Change> {
//   public undo(controller: AppController) {}
//   public redo(controller: AppController) {}
// }

export default class UndoStack {
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

// export const useUndo = () => {
//   const [canUndo, setCanUndo] = React.useState(false)
//   const [canRedo, setCanRedo] = React.useState(false)

//   React.useEffect(() => {
//     const onChange = () => {
//       setCanUndo(undoStack.canUndo())
//       setCanRedo(undoStack.canRedo())
//     }
//     return undoStack.subscribe(onChange)
//   }, [])

//   return { canUndo, canRedo }
// }

// export default undoStack
