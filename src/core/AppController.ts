import BaseController from './BaseController'
import ToolStack from '../tools/ToolStack'
import { Position } from '../utils/types'
import DrawTool from '../tools/DrawTool'
import AppView from './AppView'
import InputHandler from '../utils/InputHandler'
import TransactionManager from '../transactions/TransactionManager'
import UndoManager from '../undo/UndoManager'
import AppWorld from './AppWorld'
import CommandManager from '../commands/CommandManager'
import Sketch from '../models/Sketch'
import { Color } from '../models/Color'

export default class AppController extends BaseController<AppWorld, AppView> {
  public readonly toolStack = new ToolStack()
  public readonly inputHandler = new InputHandler(this.view)
  public readonly undoStack = new UndoManager(this)
  public readonly transaction = new TransactionManager()
  public readonly command = new CommandManager(this)

  constructor() {
    const world = new AppWorld([30, 30])
    const view = new AppView()
    super(world, view)
  }

  public loadSketch(sketch: Sketch) {
    this.world.loadSketch(sketch)
  }

  // draw
  public getColors() {
    return this.world.sketch.getColors()
  }
  public getColor(position: Position) {
    return this.world.sketch.getColor(position)
  }
  public setColor(position: Position, color: Color | undefined | null) {
    if (color === undefined) {
      this.unsetColor(position)
    } else {
      this.world.sketch.setColor(position, color)
    }
  }
  public unsetColor(position: Position) {
    this.world.sketch.setColor(position, null)
  }

  public isInSketch(position: Position) {
    return (
      position[0] >= 0 &&
      position[0] < this.world.sketch.size[0] &&
      position[1] >= 0 &&
      position[1] < this.world.sketch.size[1]
    )
  }

  // layer management
  public getLayers() {
    return this.world.sketch.layers
  }

  public getActiveLayerId() {
    return this.world.sketch.activeLayerId
  }

  public setActiveLayer(id: string) {
    this.world.sketch.activeLayerId = id
  }

  public addLayer(title?: string) {
    this.world.sketch.newLayer(title)
  }

  public deleteLayer(id: string) {
    this.world.sketch.deleteLayer(id)
  }

  public reorderLayers(layerIds: string[]) {
    this.world.sketch.reorderLayers(layerIds)
  }

  public getCurrentSketch() {
    return this.world.sketch
  }

  public setSketchTitle(title: string) {
    this.world.sketch.title = title
  }

  public undo() {
    this.undoStack.undo()
  }

  public redo() {
    this.undoStack.redo()
  }

  public canUndo() {
    return this.undoStack.canUndo()
  }

  public canRedo() {
    return this.undoStack.canRedo()
  }

  public toggleGrid() {
    this.view.toggleGrid()
  }

  public get isGridVisible() {
    return this.view.isGridVisible
  }

  public resizeSketch(size: [number, number]) {
    const currentSketch = this.world.sketch
    const newSketch = new Sketch({
      id: currentSketch.id,
      title: currentSketch.title,
      artist: currentSketch.artist,
      size,
      layers: currentSketch.layers,
    })
    this.world.loadSketch(newSketch)
  }

  protected onStart() {
    this.inputHandler.start()
    this.toolStack.start()
    this.undoStack.start()
    this.toolStack.push(new DrawTool(this))
  }

  protected onStop() {
    this.inputHandler.stop()
    this.toolStack.stop()
    this.undoStack.stop()
  }
}
