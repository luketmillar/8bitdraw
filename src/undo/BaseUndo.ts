import AppController from '../AppController'

export default abstract class Undo<C = any> {
  public readonly changes: C[]

  constructor(changes: C[]) {
    this.changes = changes
  }

  public abstract undo(controller: AppController): void
  public abstract redo(controller: AppController): void
}

// class LayerUndo extends Undo<Change> {
//   public undo(controller: AppController) {}
//   public redo(controller: AppController) {}
// }
// class SketchUndo extends Undo<Change> {
//   public undo(controller: AppController) {}
//   public redo(controller: AppController) {}
// }

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
