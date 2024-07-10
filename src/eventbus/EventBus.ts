import EventEmitter from '../utils/EventEmitter'
import { Position } from '../utils/types'

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

class EventBus extends EventEmitter<
  CommandEvents | TransactionEvents | ToolInputEvents | MouseInputEvents
> {}

export default new EventBus()
