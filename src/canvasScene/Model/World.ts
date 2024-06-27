import { Position } from '../types'
import Model from './Model'

export default abstract class World {
  public models: Model[] = []
  constructor(models: Model[]) {
    this.models = models
  }

  public getModelAtPosition(position: Position) {
    return this.models
      .slice()
      .reverse()
      .find((model) => model.intersects(position))
  }

  public addModel(m: Model) {
    this.models.push(m)
  }

  public removeModel(id: string) {
    this.models = this.models.filter((m) => m.id !== id)
  }

  protected afterUpdate() {}
}
