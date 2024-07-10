import EventEmitter from '../utils/EventEmitter'

export default class TransactionManager extends EventEmitter<
  | { scope: 'transaction'; type: 'start'; payload: void }
  | { scope: 'transaction'; type: 'end'; payload: void }
  | { scope: 'transaction'; type: 'cancel'; payload: void }
> {
  public isRunning: boolean = false

  public transact(fn: () => boolean | void) {
    this.start()
    const cancel = fn()
    if (cancel) {
      this.cancel()
    } else {
      this.commit()
    }
  }

  public start() {
    this.isRunning = true
    this.event('start')
  }
  public commit() {
    this.isRunning = false
    this.event('end')
  }
  public cancel() {
    this.isRunning = false
    this.event('cancel')
  }

  private event(type: any) {
    this.emit('transaction', type, undefined)
  }
}
