import AppController from '../core/AppController'
import { CommandNames } from './CommandTypes'

export default interface Command {
  name: CommandNames
  matches(e: KeyboardEvent): boolean
  canRun(appController: AppController): boolean
  run(appController: AppController): void
}
