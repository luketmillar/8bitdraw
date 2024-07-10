import AppController from '../core/AppController'

export default abstract class Command {
  public abstract matches(e: KeyboardEvent): boolean
  public abstract do(appController: AppController): void
}
