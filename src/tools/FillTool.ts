import AppController from '../AppController'
import { Color, Position } from '../utils/types'
import Tool from './Tool'

export default class FillTool extends Tool {
  public static type = 'fill'

  public onStart = (position: Position) => {
    const logic = new FillLogic(this.controller)
    const positions = logic.getFillPositions(position)
    positions.forEach((position) => {
      this.controller.setColor(position, this.toolStack.currentColor)
    })
  }

  public onMove = () => {}

  public onEnd = () => {}
}

class FillLogic {
  private positions: Record<string, boolean> = {}
  private targetColor: Color | null = null

  private positionsToProcess: Array<Position | undefined> = []
  private positionsToColor: Position[][] = [[]]
  private contoller: AppController
  constructor(controller: AppController) {
    this.contoller = controller
  }

  public getFillPositions = (position: Position): Position[] => {
    this.targetColor = this.contoller.getColor(position)
    this.positionsToProcess.push(position)
    this.positionsToProcess.push(undefined)
    while (this.positionsToProcess.filter((c) => c !== undefined).length > 0) {
      const position = this.positionsToProcess.shift()
      if (position === undefined) {
        this.positionsToProcess.push(undefined)
        this.positionsToColor.push([])
      } else {
        this.processPosition(position)
      }
    }
    return this.positionsToColor.flat()
  }

  private processPosition = (position: Position) => {
    if (this.shouldProcess(position)) {
      return
    }
    this.positionsToColor[this.positionsToColor.length - 1].push(position)
    this.seePosition(position)
    const neighbors = this.getNeighbors(position)
    this.positionsToProcess = [...this.positionsToProcess, ...neighbors]
  }

  private shouldProcess = (position: Position) => {
    return this.wasPositionSeen(position) || this.contoller.getColor(position) !== this.targetColor
  }

  private seePosition = (position: Position) => {
    this.positions[getPositionKey(position)] = true
  }

  private wasPositionSeen = (position: Position) => {
    return !!this.positions[getPositionKey(position)]
  }

  private getNeighbors = (position: Position): Position[] => {
    const previousY = position.y - 1
    const nextY = position.y + 1
    const previousX = position.x - 1
    const nextX = position.x + 1

    const top = { y: previousY, x: position.x }
    const left = { y: position.y, x: previousX }
    const right = { y: position.y, x: nextX }
    const bottom = { y: nextY, x: position.x }

    return [top, left, right, bottom].filter((position) => this.contoller.isInSketch(position))
  }
}

const getPositionKey = (position: Position) => `${position.x},${position.y}`
