import { IWorld } from './BaseController'
import BaseObject from '../models/Base'

export default abstract class BaseWorld implements IWorld {
  protected readonly objects: BaseObject[] = []
  public start = () => {
    this.createWorld()
  }
  public update = (_delta: number) => {
    this.objects.forEach((obj) => obj.onUpdate())
    this.onUpdate()
  }
  public allViews = () => this.objects.flatMap((obj) => obj.getViews())

  protected abstract createWorld(): void

  protected onUpdate() {}

  public addObject = (obj: BaseObject) => {
    this.objects.push(obj)
  }

  public removeObject = (obj: BaseObject) => {
    const index = this.objects.indexOf(obj)
    if (index > -1) {
      this.objects.splice(index, 1)
    }
  }

  protected restart = () => {
    this.objects.length = 0
    this.createWorld()
  }
}
