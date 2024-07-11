import AppController from '../core/AppController'
import Command from './Command'
import { redo } from './RedoCommand'
import { undo } from './UndoCommand'

const commands: Command[] = [undo, redo]

export default class CommandManager {
  private readonly appController: AppController
  constructor(appController: AppController) {
    this.appController = appController
  }

  public run(name: string) {
    const command = commands.find((command) => command.name === name)
    if (command) this.runCommand(command)
  }

  public runCommand(command: Command) {
    if (!command.canRun(this.appController)) return
    command.run(this.appController)
  }

  public getKeyboardMatch(e: KeyboardEvent) {
    return commands.find((command) => command.matches(e))
  }
}
