import BaseController from './mvc/BaseController'
import World from './World'
import ToolStack from './tools/ToolStack'
import BaseObject from './models/Base'
import { Position } from './utils/types'
import ShooterTool from './tools/ShooterTools'

export default class Controller extends BaseController<World> {
  public toolStack = new ToolStack()
  public onMouseDown = (position: Position) => {
    this.tool?.onMouseDown(position)
  }
  public onMouseMove = (position: Position) => {
    this.tool?.onMouseMove(position)
  }
  public onMouseUp = () => {
    this.tool?.onMouseUp()
  }

  protected onStart() {
    this.toolStack.on('objects-changed', this.handleToolObjectsChanged)
    this.toolStack.push(new ShooterTool(this))
  }

  private get tool() {
    return this.toolStack.top()
  }

  private handleToolObjectsChanged = ({
    previous,
    next,
  }: {
    previous: BaseObject[]
    next: BaseObject[]
  }) => {
    previous.forEach((obj) => this.world.removeObject(obj))
    next.forEach((obj) => this.world.addObject(obj))
  }
}
