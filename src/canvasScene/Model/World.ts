import { Position } from '../types'
import Model from './Model'

export default abstract class World<T extends Model = Model> {
  public models: T[] = []
  constructor(models: T[]) {
    this.models = models
  }

  public getModelAtPosition(position: Position) {
    return this.models
      .slice()
      .reverse()
      .find((model) => model.intersects(position))
  }

  public addChild(m: T) {
    this.models.push(m)
  }

  public removeChild(id: string) {
    this.models = this.models.filter((m) => m.id !== id)
  }

  protected afterUpdate() {}
}
