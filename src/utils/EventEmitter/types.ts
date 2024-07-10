export type Event<S extends string, T extends string, P> = { scope: S; type: T; payload: P }

export type EventScope<E> = E extends Event<infer S, any, any> ? S : never
export type EventName<E> = E extends Event<any, infer T, any> ? T : never
export type EventPayload<
  T extends Event<any, any, any>,
  S extends EventScope<T>,
  K extends EventName<T>,
> = T extends { scope: S; type: K } ? T['payload'] : never

export type Handler = (state: any) => void
