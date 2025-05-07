import { Position } from '../utils/types'
import Tool from './Tool'
import EventBus from '../eventbus/EventBus'
import AppController from '../core/AppController'

export default class EyedropperTool extends Tool {
  private popOnSelect: boolean
  constructor(controller: AppController, popOnSelect: boolean = false) {
    super(controller)
    this.popOnSelect = popOnSelect
  }
  public onStart = (position: Position) => {
    const color = this.controller.getColor(position)
    if (color) {
      EventBus.emit('tool', 'color', color)
    }
    if (this.popOnSelect) {
      this.controller.toolStack.pop()
    }
  }

  public onMove = () => {}

  public onEnd = () => {}
}
