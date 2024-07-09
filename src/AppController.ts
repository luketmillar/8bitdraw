import BaseController from './mvc/BaseController'
import AppWorld from './AppWorld'
import ToolStack from './tools/ToolStack'
import { Color, Position } from './utils/types'
import DrawTool from './tools/DrawTool'
import AppView from './AppView'
import InputHandler, { InputEvent } from './utils/InputHandler'
import UndoStack from './undo/undo'

export default class AppController extends BaseController<AppWorld, AppView> {
  public toolStack = new ToolStack()
  public inputHandler = new InputHandler(this.view)
  public undoStack = new UndoStack(this)

  constructor(world: AppWorld, view: AppView) {
    super(world, view)
    this.inputHandler.on(InputEvent.Start, ({ position }) => this.tool?.onStart(position))
    this.inputHandler.on(InputEvent.Move, ({ position }) => this.tool?.onMove(position))
    this.inputHandler.on(InputEvent.End, ({ position }) => this.tool?.onEnd(position))
  }

  // event handlers
  public onMouseDown = (canvasPosition: Position, metaKey?: boolean) => {
    this.inputHandler.onMouseDown(canvasPosition, { metaKey })
  }
  public onMouseUp = (canvasPosition: Position, metaKey?: boolean) => {
    this.inputHandler.onMouseUp(canvasPosition, { metaKey })
  }
  public onMouseMove = (canvasPosition: Position, metaKey?: boolean) => {
    this.inputHandler.onMouseMove(canvasPosition, { metaKey })
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

  // overrides
  public startOverride() {
    this.world.sketch.startOverride()
  }
  public commitOverride() {
    this.world.sketch.commitOverride()
  }
  public resetOverride() {
    this.world.sketch.resetOverride()
  }
  public cancelOverride() {
    this.world.sketch.cancelOverride()
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
    this.toolStack.push(new DrawTool(this))
  }

  private get tool() {
    return this.toolStack.top()
  }
}
