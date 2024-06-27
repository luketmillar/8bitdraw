import { Circle, Rectangle } from "."
import * as Coordinates from "../Coordinates"
import Shape from "./Shape"

export const intersect = (a: Shape, b: Shape) => {
    if (a instanceof Circle) {
        return intersectCircle(a, b)
    } else if (a instanceof Rectangle) {
        return intersectRectangle(a, b)
    }
    return false
}

const intersectCircle = (a: Circle, b: Shape) => {
    if (b instanceof Circle) {
        return circleCircle(a, b)
    } else if (b instanceof Rectangle) {
        return circleRectange(a, b)
    }
    return false
}


const intersectRectangle = (a: Rectangle, b: Shape) => {
    if (b instanceof Circle) {
        return circleRectange(b, a)
    } else if (b instanceof Rectangle) {
        return rectangleRectangle(a, b)
    }
    return false
}


const circleCircle = (a: Circle, b: Circle) => {
    const distance = Coordinates.distance(a.position, b.position)
    return distance < (a.radius + b.radius)
}

const circleRectange = (a: Circle, b: Rectangle) => {
    const tallExpanded = b.expand(0, a.radius)
    const wideExpanded = b.expand(a.radius, 0)
    if (tallExpanded.intersects(a.position) || wideExpanded.intersects(a.position)) {
        return true
    }
    const corners = Object.values(b.corners())
    for (let i = 0; i < corners.length; i++) {
        const corner = corners[i]
        if (Coordinates.distance(corner, a.position) < a.radius) {
            return true
        }
    }
    return false
}

const rectangleRectangle = (a: Rectangle, b: Rectangle) => {
    const aBounds = a.bounds()
    const bBounds = b.bounds()
    if (aBounds.right < bBounds.left) {
        return false
    }
    if (aBounds.bottom < bBounds.top) {
        return false
    }
    if (aBounds.left > bBounds.right) {
        return false
    }
    if (aBounds.top > bBounds.bottom) {
        return false
    }
    return true
}