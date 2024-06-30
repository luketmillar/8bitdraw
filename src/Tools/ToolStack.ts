import BaseObject from '../models/Base'
import EventEmitter from '../utils/EventEmitter'
import Tool from './Tool'

export default class ToolStack extends EventEmitter<{
  type: 'objects-changed'
  payload: { previous: BaseObject[]; next: BaseObject[] }
}> {
  public readonly stack: Tool[] = []

  public push = (tool: Tool) => {
    this.stack.push(tool)
    tool.initialize()
    tool.on('objects-changed', this.handleToolObjectsChanged)
  }

  public pop = () => {
    const tool = this.stack.pop()
    tool?.teardown()
    tool?.off('objects-changed', this.handleToolObjectsChanged)
    return tool
  }

  public top = () => {
    return this.stack[this.stack.length - 1]
  }

  private handleToolObjectsChanged = (payload: { previous: BaseObject[]; next: BaseObject[] }) => {
    this.emit('objects-changed', payload)
  }
}
