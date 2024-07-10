import AppController from '../core/AppController'
import Command from './Command'

export default class CommandManager {
  private readonly appController: AppController
  constructor(appController: AppController) {
    this.appController = appController
  }

  public execute(command: Command) {
    command.do(this.appController)
  }
}
