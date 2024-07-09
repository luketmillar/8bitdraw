export default class Overrideable<V> {
  public values: Record<string, V> = {}
  public overrides: Record<string, V> = {}

  public isOverriding = false

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

  public start() {
    this.isOverriding = true
  }

  public commit() {
    this.values = { ...this.values, ...this.overrides }
    this.overrides = {}
    this.isOverriding = false
  }

  public clearOverride() {
    this.overrides = {}
  }

  public cancel() {
    this.clearOverride()
    this.isOverriding = false
  }
}
