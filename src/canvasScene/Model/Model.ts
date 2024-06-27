import { Shape } from '../Shape'
import { v4 as uuid } from 'uuid'
import { Position } from '../types'

export default abstract class Model {
  public readonly id = uuid()
  public abstract getShapes(): Shape[]
  public intersects(position: Position) {
    return this.getShapes().some((shape) => shape.intersects(position))
  }
}
