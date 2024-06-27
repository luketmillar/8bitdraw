type VerticalBounds = { top: number, middle: number, bottom: number, height: number }
type HorizontalBounds = { left: number, center: number, right: number, width: number }
type DirectionalBounds = { start: number, center: number, end: number, size: number }
export type Bounds = VerticalBounds & HorizontalBounds

type VerticalOptions = { top?: number, middle?: number, bottom?: number, height?: number }
type HorizontalOptions = { left?: number, center?: number, right?: number, width?: number }

type DirectionalOptions = { start?: number | undefined, center?: number | undefined, end?: number | undefined, size?: number | undefined }

const createDirectionalBounds = ({ start, center, end, size }: DirectionalOptions): DirectionalBounds => {
    const blankFieldsCount = [start === undefined, center === undefined, end === undefined, size === undefined].filter(Boolean).length
    if (blankFieldsCount > 2) {
        throw new Error('over constrained')
    }
    if (blankFieldsCount < 2) {
        throw new Error('under constrained')
    }
    if (start !== undefined) {
        if (center !== undefined) {
            const size = (center - start) * 2
            return {
                start,
                center,
                end: start + size,
                size
            }
        }
        if (end !== undefined) {
            const size = (end - start)
            return {
                start,
                center: start + (size / 2),
                end,
                size
            }
        }
        if (size !== undefined) {
            return {
                start,
                center: start + (size / 2),
                end: start + size,
                size
            }
        }
    }
    if (center !== undefined) {
        if (end !== undefined) {
            const size = (end - center) * 2
            return {
                start: end - size,
                center,
                end,
                size
            }
        }
        if (size !== undefined) {
            return {
                start: center - (size / 2),
                center,
                end: center + (size / 2),
                size
            }
        }
    }
    if (end !== undefined && size !== undefined) {
        return {
            start: end - size,
            center: end - (size / 2),
            end,
            size
        }
    }
    throw new Error('unexpected')
}
export const createBounds = (options: VerticalOptions & HorizontalOptions): Bounds => {
    const verticalValues = createDirectionalBounds({ start: options.top, end: options.bottom, center: options.middle, size: options.height })
    const horizontalValues = createDirectionalBounds({ start: options.left, end: options.right, center: options.center, size: options.width })
    return {
        left: horizontalValues.start,
        right: horizontalValues.end,
        center: horizontalValues.center,
        width: horizontalValues.size,
        top: verticalValues.start,
        bottom: verticalValues.end,
        middle: verticalValues.center,
        height: verticalValues.size
    }
}

