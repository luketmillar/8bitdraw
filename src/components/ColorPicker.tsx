import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import EventBus from '../eventbus/EventBus'
import AppController from '../core/AppController'
import { HexColorPicker } from 'react-colorful'
import DrawUndo from '../undo/DrawUndo'

const DEFAULT_COLORS = [
  '#000000', // Black
  '#ffffff', // White
  '#e63946', // Red
  '#2a9d8f', // Teal
  '#457b9d', // Blue
  '#f4a261', // Orange
  '#e9c46a', // Yellow
  '#8338ec', // Purple
  '#06d6a0', // Mint
  '#ff006e', // Pink
]

const PickerContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: #232325;
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.18);
  padding: 20px 20px 16px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 180px;
`

const Preview = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ color }) => color};
  border: 2px solid #fff;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`

const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 28px);
  gap: 10px;
  margin-bottom: 8px;
`

const Swatch = styled.button<{ color: string; selected: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: ${({ selected }) => (selected ? '2px solid #7c3aed' : '2px solid #232325')};
  background: ${({ color }) => color};
  cursor: pointer;
  outline: none;
  box-shadow: ${({ selected }) => (selected ? '0 0 0 2px #7c3aed44' : 'none')};
  transition:
    border 0.15s,
    box-shadow 0.15s;
`

const Label = styled.div`
  color: #bfc4cc;
  font-size: 13px;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
`

const ColorPickerDialog = styled.div`
  position: absolute;
  top: 0;
  right: 100%;
  margin-right: 8px;
  background: #232325;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-width: 300px;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.18);
  z-index: 1001;
`

const ColorPickerContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`

const HexInput = styled.input`
  background: #2d2d2f;
  border: 1px solid #414243;
  border-radius: 8px;
  padding: 8px 12px;
  color: #bfc4cc;
  font-size: 14px;
  width: 100px;
  text-align: center;
  outline: none;
  &:focus {
    border-color: #7c3aed;
  }
`

const ColorPicker = ({ controller }: { controller: AppController }) => {
  const [color, setColor] = React.useState(controller.toolStack.currentColor)
  const [showPicker, setShowPicker] = React.useState(false)
  const [recentColors, setRecentColors] = React.useState<string[]>([])
  const pickerRef = useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const colorListener = EventBus.on('tool', 'color', setColor)
    const undoListener = EventBus.on('undo', 'push', (undo) => {
      if (undo instanceof DrawUndo) {
        // Only add colors that were actually used (not erased)
        const usedColors = new Set(
          undo.changes.filter((change) => change.after !== null).map((change) => change.after)
        )

        usedColors.forEach((usedColor) => {
          if (usedColor) {
            setRecentColors((prev) => {
              const newColors = [usedColor, ...prev.filter((color) => color !== usedColor)].slice(
                0,
                5
              )
              return newColors
            })
          }
        })
      }
    })

    return () => {
      colorListener()
      undoListener()
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPicker])

  const handleSelect = (c: string) => {
    setColor(c)
    EventBus.emit('tool', 'color', c)
  }

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    EventBus.emit('tool', 'color', newColor)
  }

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 7 && /^#[0-9A-Fa-f]*$/.test(value)) {
      handleColorChange(value)
    }
  }

  const handlePreviewClick = () => {
    setShowPicker(true)
  }

  const handleClose = () => {
    setShowPicker(false)
  }

  return (
    <PickerContainer>
      <Label>Color</Label>
      <Preview color={color} onClick={handlePreviewClick} />
      {recentColors.length > 0 && (
        <>
          <Label>Recent</Label>
          <SwatchGrid>
            {recentColors.map((c) => (
              <Swatch
                key={c}
                color={c}
                selected={c === color}
                onClick={() => handleSelect(c)}
                aria-label={c}
              />
            ))}
          </SwatchGrid>
        </>
      )}
      <Label>Colors</Label>
      <SwatchGrid>
        {DEFAULT_COLORS.map((c) => (
          <Swatch
            key={c}
            color={c}
            selected={c === color}
            onClick={() => handleSelect(c)}
            aria-label={c}
          />
        ))}
      </SwatchGrid>
      {showPicker && (
        <ColorPickerDialog ref={pickerRef}>
          <ColorPickerContent>
            <HexColorPicker color={color} onChange={handleColorChange} />
            <HexInput type='text' value={color} onChange={handleHexInput} placeholder='#000000' />
          </ColorPickerContent>
        </ColorPickerDialog>
      )}
    </PickerContainer>
  )
}

export default ColorPicker
