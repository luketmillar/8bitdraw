import React from 'react'
import { Color } from '../../models/Color'
import { SwatchGrid, Swatch, TransparencyBackground } from './shared'

interface ColorSwatchesProps {
  colors: Color[]
  selectedColor: Color
  onSelect: (color: Color) => void
}

export const ColorSwatches: React.FC<ColorSwatchesProps> = ({
  colors,
  selectedColor,
  onSelect,
}) => {
  return (
    <SwatchGrid>
      {colors.map((color) => (
        <Swatch
          key={color.toHex()}
          color={color}
          selected={color.equals(selectedColor)}
          onClick={() => onSelect(color)}
          aria-label={color.toHex()}
        >
          <TransparencyBackground />
        </Swatch>
      ))}
    </SwatchGrid>
  )
}
