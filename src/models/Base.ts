import { View } from '../views/Views'

export default abstract class Model {
  public getViews(): View[] {
    return []
  }
  public onUpdate() {}
}
