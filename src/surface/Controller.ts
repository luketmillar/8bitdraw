import Controller from '../canvasScene/Controller'
import { Position } from '../canvasScene/types'
import SurfaceWorld from './model/World'

export default class SurfaceController extends Controller<SurfaceWorld> {
  public onClick = (position: Position) => {}

  public onMouseMove = (position: Position) => {}

  public drop = () => {}
}
