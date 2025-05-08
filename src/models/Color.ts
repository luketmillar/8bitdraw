export class Color {
  private r: number
  private g: number
  private b: number
  private a: number

  private constructor(r: number, g: number, b: number, a: number) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }

  static fromHex(hex: string, opacity: number = 1): Color {
    const cleanHex = hex.replace('#', '')

    if (cleanHex.length === 3) {
      // Handle shorthand hex (e.g., #RGB)
      const r = parseInt(cleanHex[0] + cleanHex[0], 16)
      const g = parseInt(cleanHex[1] + cleanHex[1], 16)
      const b = parseInt(cleanHex[2] + cleanHex[2], 16)
      return new Color(r, g, b, opacity)
    }

    if (cleanHex.length === 6) {
      // Handle full hex (e.g., #RRGGBB)
      const r = parseInt(cleanHex.substring(0, 2), 16)
      const g = parseInt(cleanHex.substring(2, 4), 16)
      const b = parseInt(cleanHex.substring(4, 6), 16)
      return new Color(r, g, b, opacity)
    }

    throw new Error('Invalid hex color format. Expected #RGB or #RRGGBB')
  }

  static fromRGBA(r: number, g: number, b: number, a: number = 1): Color {
    return new Color(r, g, b, a)
  }

  // Convert to hex string
  toHex(): string {
    const toHex = (n: number) => {
      const hex = Math.round(n).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`
  }

  // Convert to rgba string
  toRGBA(): string {
    return `rgba(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)}, ${this.a})`
  }

  // Get individual components
  getR(): number {
    return this.r
  }
  getG(): number {
    return this.g
  }
  getB(): number {
    return this.b
  }
  getA(): number {
    return this.a
  }

  // Set individual components
  setR(r: number): void {
    this.r = r
  }
  setG(g: number): void {
    this.g = g
  }
  setB(b: number): void {
    this.b = b
  }
  setA(a: number): void {
    this.a = a
  }

  // Clone the color
  clone(): Color {
    return new Color(this.r, this.g, this.b, this.a)
  }

  // Check if two colors are equal, including opacity
  equals(other: Color): boolean {
    return this.r === other.r && this.g === other.g && this.b === other.b && this.a === other.a
  }

  // Check if two colors have the same RGB values, ignoring opacity
  equalsRGB(other: Color): boolean {
    return this.r === other.r && this.g === other.g && this.b === other.b
  }
}
