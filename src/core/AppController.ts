import BaseController from './BaseController'
import ToolStack from '../tools/ToolStack'
import { Color, Position } from '../utils/types'
import DrawTool from '../tools/DrawTool'
import AppView from './AppView'
import InputHandler from '../utils/InputHandler'
import TransactionManager from '../transactions/TransactionManager'
import UndoManager from '../undo/UndoManager'
import AppWorld from './AppWorld'

export default class AppController extends BaseController<AppWorld, AppView> {
  public readonly toolStack = new ToolStack()
  public readonly inputHandler = new InputHandler(this.view)
  public readonly undoStack = new UndoManager(this)
  public readonly transaction = new TransactionManager()

  constructor() {
    const world = new AppWorld([40, 30])
    const view = new AppView()
    super(world, view)
  }

  // draw
  public getColor(position: Position) {
    return this.world.sketch.getColor(position)
  }
  public setColor(position: Position, color: Color | undefined) {
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

  public teardown() {
    this.inputHandler.teardown()
    this.toolStack.teardown()
  }

  protected onStart() {
    this.toolStack.push(new DrawTool(this))
  }
}
