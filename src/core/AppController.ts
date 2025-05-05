import BaseController from './BaseController'
import ToolStack from '../tools/ToolStack'
import { Color, Position } from '../utils/types'
import DrawTool from '../tools/DrawTool'
import AppView from './AppView'
import InputHandler from '../utils/InputHandler'
import TransactionManager from '../transactions/TransactionManager'
import UndoManager from '../undo/UndoManager'
import AppWorld from './AppWorld'
import CommandManager from '../commands/CommandManager'

export default class AppController extends BaseController<AppWorld, AppView> {
  public readonly toolStack = new ToolStack()
  public readonly inputHandler = new InputHandler(this.view)
  public readonly undoStack = new UndoManager(this)
  public readonly transaction = new TransactionManager()
  public readonly command = new CommandManager(this)

  constructor() {
    const world = new AppWorld([20, 20])
    const view = new AppView()
    super(world, view)
  }

  // draw
  public getColor(position: Position) {
    return this.world.sketch.getColor(position)
  }
  public setColor(position: Position, color: Color | undefined | null) {
    if (color === undefined) {
      this.unsetColor(position)
    } else {
      this.world.sketch.setColor(position, color)
    }
  }
  public unsetColor(position: Position) {
    this.world.sketch.setColor(position, null)
  }

  public isInSketch(position: Position) {
    return (
      position[0] >= 0 &&
      position[0] < this.world.sketch.size[0] &&
      position[1] >= 0 &&
      position[1] < this.world.sketch.size[1]
    )
  }

  protected onStart() {
    this.inputHandler.start()
    this.toolStack.start()
    this.undoStack.start()
    this.toolStack.push(new DrawTool(this))
  }

  protected onStop() {
    this.inputHandler.stop()
    this.toolStack.stop()
    this.undoStack.stop()
  }
}
