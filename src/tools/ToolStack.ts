import EventBus, { ToolPayload } from '../eventbus/EventBus'
import { Color } from '../utils/types'
import Tool from './Tool'

export default class ToolStack {
  public readonly stack: Tool[] = []
  public currentColor: Color = '#000'

  public replace = (tool: Tool) => {
    this.clearStack()
    this.push(tool)
    EventBus.emit('tool', 'stack-changed', this.tool)
  }
  public push = (tool: Tool) => {
    this.stack.push(tool)
    tool.initialize()
    EventBus.emit('tool', 'stack-changed', this.tool)
  }

  public pop = () => {
    const tool = this.stack.pop()
    tool?.teardown()
    EventBus.emit('tool', 'stack-changed', this.tool)
    return tool
  }

  public top = () => {
    return this.stack[this.stack.length - 1]
  }

  public start() {
    EventBus.on('tool', 'start', this.onStart)
    EventBus.on('tool', 'move', this.onMove)
    EventBus.on('tool', 'end', this.onEnd)
    EventBus.on('tool', 'color', this.onColor)
  }
  public stop() {
    EventBus.off('tool', 'start', this.onStart)
    EventBus.off('tool', 'move', this.onMove)
    EventBus.off('tool', 'end', this.onEnd)
    EventBus.off('tool', 'color', this.onColor)
  }

  private onStart = ({ position }: ToolPayload) => this.tool?.onStart(position)
  private onMove = ({ position }: ToolPayload) => this.tool?.onMove(position)
  private onEnd = ({ position }: ToolPayload) => this.tool?.onEnd(position)
  private onColor = (color: string) => (this.currentColor = color)

  private clearStack = () => {
    this.stack.forEach((tool) => tool.teardown())
    this.stack.length = 0
  }

  private get tool() {
    return this.top()
  }
}
