import AppController from '../core/AppController'
import Command from './Command'

const matches = (e: KeyboardEvent): boolean => e.key === 'z' && e.metaKey && e.shiftKey
const canRun = (appController: AppController): boolean => appController.undoStack.canUndo()
const run = (appController: AppController): void => {
  appController.undoStack.redo()
}
export const redo: Command = { name: 'redo', matches, canRun, run }
