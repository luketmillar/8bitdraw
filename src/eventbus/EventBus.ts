import { Color } from '../models/Color'
import Tool from '../tools/Tool'
import Undo from '../undo/BaseUndo'
import EventEmitter from '../utils/EventEmitter'
import { Position } from '../utils/types'

type SketchEvents = { scope: 'sketch'; type: 'changed'; payload: '' }

type SelectionEvents = { scope: 'selection'; type: 'changed'; payload: '' }

type CommandEvents =
  | { scope: 'command'; type: 'undo'; payload: '' }
  | { scope: 'command'; type: 'redo'; payload: '' }

type TransactionEvents =
  | { scope: 'transaction'; type: 'start'; payload: '' }
  | { scope: 'transaction'; type: 'end'; payload: '' }
  | { scope: 'transaction'; type: 'cancel'; payload: '' }

export type ToolPayload = { position: Position; metaKey?: boolean }
type ToolInputEvents =
  | { scope: 'tool'; type: 'start'; payload: ToolPayload }
  | { scope: 'tool'; type: 'move'; payload: ToolPayload }
  | { scope: 'tool'; type: 'end'; payload: ToolPayload }
  | { scope: 'tool'; type: 'stack-changed'; payload: Tool }
  | { scope: 'tool'; type: 'color'; payload: Color }

type MousePayload = { position: Position; metaKey?: boolean }
type MouseInputEvents =
  | {
      scope: 'mouse-input'
      type: 'down'
      payload: MousePayload
    }
  | {
      scope: 'mouse-input'
      type: 'up'
      payload: MousePayload
    }
  | {
      scope: 'mouse-input'
      type: 'move'
      payload: MousePayload
    }

type UndoEvents =
  | { scope: 'undo'; type: 'stack-changed'; payload: '' }
  | { scope: 'undo'; type: 'push'; payload: Undo }

class EventBus extends EventEmitter<
  | CommandEvents
  | SelectionEvents
  | TransactionEvents
  | ToolInputEvents
  | MouseInputEvents
  | UndoEvents
  | SketchEvents
> {}

export default new EventBus()
