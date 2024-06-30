export type Event<T extends string, P> = { type: T; payload: P }

export type EventName<E> = E extends Event<infer T, any> ? T : never
export type EventPayload<T extends Event<any, any>, K extends EventName<T>> = T extends { type: K }
    ? T['payload']
    : never

export type Handler = (state: any) => void
