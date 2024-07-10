import TransactionManager from '../transactions/TransactionManager'

export default class Overrideable<V> {
  public readonly transaction: TransactionManager
  public values: Record<string, V> = {}
  public overrides: Record<string, V> = {}

  private get isOverriding() {
    return this.transaction.isRunning
  }

  constructor(transaction: TransactionManager) {
    this.transaction = transaction
    this.transaction.on('start', this.start)
    this.transaction.on('end', this.commit)
    this.transaction.on('cancel', this.cancel)
  }

  public set(key: string, value: V) {
    if (this.isOverriding) {
      this.overrides[key] = value
    } else {
      this.values[key] = value
    }
  }

  public get(key: string): V | undefined {
    return this.overrides[key] ?? this.values[key]
  }

  public getAll() {
    return Object.values({ ...this.values, ...this.overrides })
  }

  public clear() {
    this.values = {}
    this.overrides = {}
  }

  public start = () => {
    this.overrides = {}
  }

  public commit = () => {
    this.values = { ...this.values, ...this.overrides }
    this.overrides = {}
  }

  public cancel = () => {
    this.overrides = {}
  }
}
