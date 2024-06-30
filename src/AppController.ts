import BaseController from './mvc/BaseController'
import AppWorld from './AppWorld'
import ToolStack from './tools/ToolStack'
import BaseObject from './models/Base'
import { Position } from './utils/types'
import ToggleTool from './tools/ToggleTool'
import * as Coordinates from './utils/Coordinates'
import AppView from './AppView'

export default class AppController extends BaseController<AppWorld, AppView> {
  public toolStack = new ToolStack()
  public onMouseDown = (canvasPosition: Position) => {
    const sketchPosition = Coordinates.canvasToSketch(
      canvasPosition,
      this.world.sketch.size,
      this.view.gutter
    )
    this.tool?.onMouseDown(sketchPosition)
  }
  public onMouseMove = (canvasPosition: Position) => {
    const sketchPosition = Coordinates.canvasToSketch(
      canvasPosition,
      this.world.sketch.size,
      this.view.gutter
    )
    this.tool?.onMouseMove(sketchPosition)
  }
  public onMouseUp = () => {
    this.tool?.onMouseUp()
  }

  protected onStart() {
    this.toolStack.on('objects-changed', this.handleToolObjectsChanged)
    this.toolStack.push(new ToggleTool(this))
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
