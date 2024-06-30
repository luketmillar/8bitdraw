import View from '../View'

export default abstract class Model {
  public getViews(): View[] {
    return []
  }
  public onUpdate() {}
}
