import { Event, EventName, EventPayload, EventScope, Handler } from './types'

class Handlers {
  private handlersByKey: Record<string, Handler[]> = {}

  public add(scope: string, name: string, handler: Handler) {
    const key = this.getKey(scope, name)
    if (this.handlersByKey[key] === undefined) {
      this.handlersByKey[key] = []
    }
    this.handlersByKey[key].push(handler)
  }

  public get(scope: string, name: string) {
    const key = this.getKey(scope, name)
    return this.handlersByKey[key] ?? []
  }

  public remove(scope: string, name: string, handler: Handler) {
    const key = this.getKey(scope, name)
    this.handlersByKey[key] = this.handlersByKey[key].filter((h) => h !== handler)
  }

  public clear() {
    this.handlersByKey = {}
  }

  private getKey(scope: string, name: string) {
    return `${scope}:${name}`
  }
}

export default class EventEmitter<Events extends Event<any, any, any>> {
  private handlers = new Handlers()
  private allHandlers: Handler[] = []

  public on<S extends EventScope<Events>, T extends EventName<Events>>(
    scope: S,
    eventName: T,
    handler: (arg: EventPayload<Events, S, T>) => void
  ) {
    this.handlers.add(scope, eventName, handler)
    return () => {
      this.off(scope, eventName, handler)
    }
  }

  public off<S extends EventScope<Events>, T extends EventName<Events>>(
    scope: S,
    eventName: T,
    handler: (arg: EventPayload<Events, S, T>) => void
  ) {
    this.handlers.remove(scope, eventName, handler)
  }

  public onAll(handler: Handler) {
    this.allHandlers.push(handler)

    return () => {
      this.offAll(handler)
    }
  }

  public offAll(handler: Handler) {
    this.allHandlers = this.allHandlers.filter((h) => h !== handler)
  }

  protected emit<S extends EventScope<Events>, T extends EventName<Events>>(
    scope: S,
    eventName: T,
    state: EventPayload<Events, S, T>
  ) {
    const allHandlers = this.allHandlers
    const namedHandlers = this.handlers.get(scope, eventName)

    allHandlers.forEach((allHandler) => allHandler({ type: eventName, payload: state } as any))

    namedHandlers.forEach((handler) => {
      handler(state)
    })
  }
  protected emitEvent(event: Events): void {
    const allHandlers = this.allHandlers
    const namedHandlers = this.handlers.get(event.scope, event.type)

    allHandlers.forEach((allHandler) => allHandler(event))
    namedHandlers.forEach((namedHandler) => namedHandler(event.payload))
  }

  protected removeAllListeners() {
    this.allHandlers = []
    this.handlers.clear()
  }
}
