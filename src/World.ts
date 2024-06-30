import BaseWorld from './mvc/BaseWorld'

export default class World extends BaseWorld {
  constructor() {
    super({ width: 1920, height: 1080 })
  }
  protected createWorld(): void {
    // Create the world
  }
  protected onUpdate = () => {}
}
