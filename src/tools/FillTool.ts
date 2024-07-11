import { vec2 } from 'gl-matrix'
import AppController from '../core/AppController'
import { Color, Position } from '../utils/types'
import Tool from './Tool'

export default class FillTool extends Tool {
  public static type = 'fill'

  public onStart = (position: Position) => {
    const logic = new FillLogic(this.controller)
    const positions = logic.getFillPositions(position)
    this.controller.transaction.transact(() => {
      positions.forEach((position) => {
        this.controller.setColor(position, this.toolStack.currentColor)
      })
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
    const previousY = position[1] - 1
    const nextY = position[1] + 1
    const previousX = position[0] - 1
    const nextX = position[0] + 1

    const top = vec2.fromValues(position[0], previousY)
    const left = vec2.fromValues(previousX, position[1])
    const right = vec2.fromValues(nextX, position[1])
    const bottom = vec2.fromValues(position[0], nextY)

    return [top, left, right, bottom].filter((position) => this.contoller.isInSketch(position))
  }
}

const getPositionKey = (position: Position) => `${position[0]},${position[1]}`
