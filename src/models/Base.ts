import * as Shapes from './Shapes'

export default abstract class BaseObject {
  public getShapes(): Shapes.Shape[] {
    return []
  }
  public onUpdate() {}
}
