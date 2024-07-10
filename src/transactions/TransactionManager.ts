import EventBus from '../eventbus/EventBus'

export default class TransactionManager {
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
    EventBus.emit('transaction', 'start', '')
  }
  public commit() {
    EventBus.emit('transaction', 'end', '')
  }
  public cancel() {
    EventBus.emit('transaction', 'cancel', '')
  }
}
