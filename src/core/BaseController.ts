import { View } from '../views/Views'

export interface IWorld {
  start: () => void
  update: (delta: number) => void
  allViews: () => View[]
}

export interface IView<W extends IWorld> {
  render: (world: W) => void
}

export default class BaseController<W extends IWorld, V extends IView<W>> {
  protected readonly world: W
  public readonly view: V
  private running: boolean = false
  private startTime: number = 0
  private lastFrameTime: number = 0
  constructor(world: W, view: V) {
    this.world = world
    this.view = view
  }

  public start() {
    this.onStart()
    this.world.start()
    this.running = true
    this.startTime = this.now
    this.lastFrameTime = this.startTime
    this.queueFrame()
  }

  public stop() {
    this.running = false
  }

  private loop = (frameTime: number) => {
    if (!this.running) {
      return
    }
    this.queueFrame()
    const delta = frameTime - this.lastFrameTime
    if (delta > 500) {
      // we missed some frames, instead of skipping them we wait slow down
      this.startTime += delta
      this.lastFrameTime = frameTime
      return
    }
    this.world.update(delta)
    this.view.render(this.world)
    this.lastFrameTime = frameTime
  }

  private queueFrame() {
    requestAnimationFrame(this.loop)
  }

  protected get runTime() {
    return this.now - this.startTime
  }

  protected get now() {
    return performance.now()
  }

  protected onStart() {}
}
