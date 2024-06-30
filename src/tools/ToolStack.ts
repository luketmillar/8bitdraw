import Tool from './Tool'

export default class ToolStack {
  public readonly stack: Tool[] = []

  public push = (tool: Tool) => {
    this.stack.push(tool)
    tool.initialize()
  }

  public pop = () => {
    const tool = this.stack.pop()
    tool?.teardown()
    return tool
  }

  public top = () => {
    return this.stack[this.stack.length - 1]
  }
}
