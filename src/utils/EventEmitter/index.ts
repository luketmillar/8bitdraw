import { Event, EventName, EventPayload, Handler } from './types'

export default class EventEmitter<Events extends Event<any, any>> {
    private handlersByEventName: Record<string, Handler[]> = {}
    private allHandlers: Array<(event: Events) => void> = []

    public on<T extends EventName<Events>>(eventName: T, handler: (arg: EventPayload<Events, T>) => void) {
        if (this.handlersByEventName[eventName] === undefined) {
            this.handlersByEventName[eventName] = []
        }
        this.handlersByEventName[eventName as string].push(handler)
        return () => {
            this.off(eventName, handler)
        }
    }

    public off<T extends EventName<Events>>(eventName: T, handler: (arg: EventPayload<Events, T>) => void) {
        if (this.handlersByEventName[eventName] === undefined) {
            return
        }
        this.handlersByEventName[eventName] = this.handlersByEventName[eventName as string].filter(h => h !== handler)
    }

    public onAll(handler: (event: Events) => void) {
        this.allHandlers.push(handler)

        return () => {
            this.offAll(handler)
        }
    }

    public offAll(handler: (Event: Events) => void) {
        this.allHandlers = this.allHandlers.filter(h => h !== handler)
    }

    protected emit<T extends EventName<Events>>(eventName: T, state: EventPayload<Events, T>) {
        const allHandlers = this.allHandlers
        const namedHandlers = this.handlersByEventName[eventName] ?? []

        allHandlers.forEach(allHandler => allHandler({ type: eventName, payload: state } as any))

        namedHandlers.forEach(handler => {
            handler(state)
        })
    }
    protected emitEvent(event: Events): void {
        const allHandlers = this.allHandlers
        const namedHandlers = this.handlersByEventName[event.type] ?? []

        allHandlers.forEach(allHandler => allHandler(event))
        namedHandlers.forEach(namedHandler => namedHandler(event.payload))
    }

    protected removeAllListeners() {
        this.allHandlers = []
        this.handlersByEventName = {}
    }
}
