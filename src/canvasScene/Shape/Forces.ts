import type { Vector } from '../types'
import Shape from './Shape'

export abstract class Force {
    private running: boolean = false
    private startTime: number = 0
    public start(time: number) {
        if (this.running) {
            return
        }
        this.startTime = time
        this.running = true
    }
    public stop() {
        this.running = false
    }
    public update(time: number, delta: number, shape: Shape) {
        if (!this.running) {
            return
        }
        const timeSinceStart = time - this.startTime
        this._update(timeSinceStart, delta, shape)
    }
    public abstract _update(time: number, delta: number, shape: Shape): void
}

export class Velocity extends Force {
    public velocity: Vector
    public gravity: Vector
    constructor(value: Vector, gravity: Vector = { x: 0, y: 0 }) {
        super()
        this.velocity = value
        this.gravity = gravity
    }
    public _update(time: number, delta: number, shape: Shape) {
        const deltaInSeconds = delta / 1000
        this.velocity.x = this.velocity.x + (this.gravity.x * deltaInSeconds)
        this.velocity.y = this.velocity.y + (this.gravity.y * deltaInSeconds)
        shape.position.x += this.velocity.x * deltaInSeconds
        shape.position.y += this.velocity.y * deltaInSeconds
    }
}

// class Friction extends Force {
//     public update(time: number, delta: number, shape: Shape) {

//     }
// }

// export class Gravity extends Force {
//     private readonly value: Vector
//     public velocity?: Velocity
//     constructor(value: Vector) {
//         super()
//         this.value = value
//     }
//     public start(time: number) {
//         super.start(time)
//         if (this.velocity) {
//             this.velocity.value.x = 0
//             this.velocity.value.y = 0
//             this.velocity.start(time)
//         }
//     }
//     public stop() {
//         super.stop()
//         if (this.velocity) {
//             this.velocity.stop()
//         }
//     }
//     public reset(time: number) {
//         this.start(time)
//     }
//     public _update(time: number, delta: number, shape: Shape) {
//         if (this.velocity) {
//             this.velocity.value.x += this.value.x * delta
//             this.velocity.value.y += this.value.y * delta
//         }
//     }
// }