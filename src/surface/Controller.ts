import Controller from '../canvasScene/Controller'
import { Position } from '../canvasScene/types'
import SurfaceWorld from './model/World'

export default class SurfaceController extends Controller<SurfaceWorld> {
  public onClick = (position: Position) => {
    const { x, y } = this.world.getSurfacePosition(position)
    const currentColor = this.world.getActiveLayer().getPixel(x, y).color
    if (currentColor == null) {
      this.world.setColor(x, y, 'black')
    } else {
      this.world.unsetColor(x, y)
    }
    this.render()
  }

  public onMouseMove = () => {}

  public drop = () => {}
}
