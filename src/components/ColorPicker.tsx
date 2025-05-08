import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import EventBus from '../eventbus/EventBus'
import AppController from '../core/AppController'
import { RgbaColorPicker } from 'react-colorful'
import DrawUndo from '../undo/DrawUndo'
import EyedropperTool from '../tools/EyedropperTool'
import { EyedropperIcon } from './Icons'
import { Color } from '../models/Color'

const DEFAULT_COLORS = [
  Color.fromHex('#000000'), // Black
  Color.fromHex('#ffffff'), // White
  Color.fromHex('#e63946'), // Red
  Color.fromHex('#2a9d8f'), // Teal
  Color.fromHex('#457b9d'), // Blue
  Color.fromHex('#f4a261'), // Orange
  Color.fromHex('#e9c46a'), // Yellow
  Color.fromHex('#8338ec'), // Purple
  Color.fromHex('#06d6a0'), // Mint
  Color.fromHex('#ff006e'), // Pink
]

const PickerContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: #2a2b2c;
  border: 1px solid #363738;
  border-radius: 10px;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.18);
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 180px;
  gap: 12px;
`

const TransparencyBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: repeating-linear-gradient(
    45deg,
    #bbbbbb 0px,
    #bbbbbb 1px,
    #f0f0f0 1px,
    #f0f0f0 3px
  );
  z-index: 1;
`

const Preview = styled.div<{ color: Color }>`
  width: 100%;
  height: 48px;
  border-radius: 8px;
  border: 1px solid #363738;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-size: 14px;
  color: ${({ color }) => {
    // Calculate if the color is dark enough to need white text
    const brightness = (color.getR() * 299 + color.getG() * 587 + color.getB() * 114) / 1000
    return brightness < 128 ? '#ffffff' : '#000000'
  }};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.02);
    border-color: #7c3aed;
  }

  &:active {
    transform: scale(0.98);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ color }) => {
      const transparentColor = color.clone()
      transparentColor.setA(100)
      return transparentColor.toRGBA()
    }};
    clip-path: polygon(0 0, 100% 0, 75% 100%, 0 100%, 0 0);
    z-index: 2;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ color }) => color.toRGBA()};
    // clip-path: polygon(100% 0, 100% 100%, 75% 100%, 100% 0);
    z-index: 2;
  }

  > span {
    position: relative;
    z-index: 3;
  }
`

const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 28px);
  gap: 10px;
`

const Swatch = styled.button<{ color: Color; selected: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: ${({ selected }) => (selected ? '2px solid #7c3aed' : '2px solid #232325')};
  padding: 0;
  cursor: pointer;
  outline: none;
  box-shadow: ${({ selected }) =>
    selected ? '0 0 0 2px #7c3aed44, inset 0 0 0 1px #000000' : 'none'};
  transition:
    border 0.15s,
    box-shadow 0.15s;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ color }) => color.toRGBA()};
    z-index: 2;
  }
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #363738;
  margin: 4px 0;
`

const ColorPickerDialog = styled.div`
  position: absolute;
  top: 0;
  right: 100%;
  margin-right: 8px;
  background: #2a2b2c;
  border: 1px solid #363738;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-width: 250px;
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

const StyledRgbaColorPicker = styled(RgbaColorPicker)`
  width: 240px !important;
  height: 260px !important;

  .react-colorful__saturation {
    height: 200px !important;
    border-radius: 10px;
  }

  .react-colorful__hue {
    margin-top: 10px;
    height: 20px !important;
    border-radius: 10px;
  }

  .react-colorful__alpha {
    margin-top: 10px;
    height: 20px !important;
    border-radius: 10px;
  }

  .react-colorful__pointer {
    width: 20px;
    height: 20px;
  }
`

const HexInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`

const HexInput = styled.input`
  background: #2d2d2f;
  border: 1px solid #414243;
  border-radius: 8px 0 0 8px;
  padding: 7px 12px;
  color: #bfc4cc;
  font-size: 14px;
  width: 100px;
  text-align: center;
  outline: none;
  font-family: monospace;
  text-transform: uppercase;
  height: 32px;
  box-sizing: border-box;
  &:focus {
    border-color: #7c3aed;
  }
`

const OpacityInput = styled.input`
  background: #2d2d2f;
  border: 1px solid #414243;
  border-left: none;
  border-right: none;
  padding: 7px 12px;
  color: #bfc4cc;
  font-size: 14px;
  width: 60px;
  text-align: center;
  outline: none;
  font-family: monospace;
  height: 32px;
  box-sizing: border-box;
  &:focus {
    border-color: #7c3aed;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const SaveButton = styled.button`
  background: #2d2d2f;
  border: 1px solid #414243;
  border-radius: 0 8px 8px 0;
  padding: 8px 12px;
  color: #bfc4cc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  height: 32px;
  box-sizing: border-box;

  &:hover {
    background: #363738;
    border-color: #7c3aed;
  }

  &:active {
    background: #2d2d2f;
  }
`

const EyedropperButton = styled.button`
  background: #2d2d2f;
  border: 1px solid #414243;
  border-radius: 8px;
  padding: 8px;
  color: #bfc4cc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  margin-right: 8px;
  height: 32px;
  width: 32px;
  box-sizing: border-box;

  &:hover {
    background: #363738;
    border-color: #7c3aed;
  }

  &:active {
    background: #2d2d2f;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const ColorPicker = ({ controller }: { controller: AppController }) => {
  const [color, setColor] = React.useState(controller.toolStack.currentColor)
  const [showPicker, setShowPicker] = React.useState(false)
  const [recentColors, setRecentColors] = React.useState<Color[]>([])
  const pickerRef = useRef<HTMLDivElement>(null)
  const clickTimeoutRef = useRef<number>()
  const previousColorRef = useRef<Color>(color)

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
              return [usedColor, ...prev.filter((color) => !color.equals(usedColor))].slice(0, 5)
            })
          }
        })
      }
    })

    return () => {
      colorListener()
      undoListener()
      if (clickTimeoutRef.current) {
        window.clearTimeout(clickTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        // Prevent the click from reaching the canvas
        event.preventDefault()
        event.stopPropagation()
        handleClose()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancel()
      }
    }

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside, { capture: true })
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, { capture: true })
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showPicker])

  const handleSelect = (c: Color) => {
    setColor(c)
    EventBus.emit('tool', 'color', c)
  }

  const handleColorChange = (newColor: { r: number; g: number; b: number; a: number }) => {
    const newColorObj = Color.fromRGBA(newColor.r, newColor.g, newColor.b, newColor.a)
    setColor(newColorObj)
    EventBus.emit('tool', 'color', newColorObj)
  }

  const handleOpacityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace('%', '')
    if (value === '' || /^\d*$/.test(value)) {
      const opacity = value === '' ? 0 : Math.max(0, Math.min(100, parseInt(value))) / 100
      const newColor = color.clone()
      newColor.setA(opacity)
      setColor(newColor)
      EventBus.emit('tool', 'color', newColor)
    }
  }

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 7 && /^#[0-9A-Fa-f]*$/.test(value)) {
      const newColor = Color.fromHex(value)
      newColor.setA(color.getA())
      setColor(newColor)
      EventBus.emit('tool', 'color', newColor)
    }
  }

  const handleHexKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleHexSave()
    }
  }

  const handleOpacityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleHexSave()
    }
  }

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    previousColorRef.current = color
    setShowPicker(true)
  }

  const handleClose = () => {
    setShowPicker(false)
  }

  const handleCancel = () => {
    setShowPicker(false)
    setColor(previousColorRef.current)
    EventBus.emit('tool', 'color', previousColorRef.current)
  }

  const handleHexSave = () => {
    handleClose()
  }

  const handleEyedropperClick = () => {
    controller.toolStack.push(new EyedropperTool(controller, true))
    setShowPicker(false)
  }

  return (
    <PickerContainer>
      <Preview color={color} onClick={handlePreviewClick}>
        <TransparencyBackground />
        <span>{color.toHex().toUpperCase()}</span>
      </Preview>
      {recentColors.length > 0 && (
        <>
          <Divider />
          <SwatchGrid>
            {recentColors.map((c) => (
              <Swatch
                key={c.toHex()}
                color={c}
                selected={c.equals(color)}
                onClick={() => handleSelect(c)}
                aria-label={c.toHex()}
              >
                <TransparencyBackground />
              </Swatch>
            ))}
          </SwatchGrid>
        </>
      )}
      <Divider />
      <SwatchGrid>
        {DEFAULT_COLORS.map((c) => (
          <Swatch
            key={c.toHex()}
            color={c}
            selected={c.equals(color)}
            onClick={() => handleSelect(c)}
          >
            <TransparencyBackground />
          </Swatch>
        ))}
      </SwatchGrid>
      {showPicker && (
        <ColorPickerDialog ref={pickerRef}>
          <ColorPickerContent>
            <StyledRgbaColorPicker
              color={{
                r: color.getR(),
                g: color.getG(),
                b: color.getB(),
                a: color.getA(),
              }}
              onChange={handleColorChange}
            />
            <HexInputContainer>
              <EyedropperButton onClick={handleEyedropperClick} title='Pick color from canvas'>
                <EyedropperIcon />
              </EyedropperButton>
              <HexInput
                type='text'
                value={color.toHex().toUpperCase()}
                onChange={handleHexInput}
                onKeyDown={handleHexKeyDown}
                placeholder='#000000'
              />
              <OpacityInput
                type='text'
                value={`${Math.round(color.getA() * 100)}%`}
                onChange={handleOpacityInput}
                onKeyDown={handleOpacityKeyDown}
                placeholder='100%'
              />
              <SaveButton onClick={handleHexSave} title='Save color'>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z'></path>
                  <polyline points='17 21 17 13 7 13 7 21'></polyline>
                  <polyline points='7 3 7 8 15 8'></polyline>
                </svg>
              </SaveButton>
            </HexInputContainer>
          </ColorPickerContent>
        </ColorPickerDialog>
      )}
    </PickerContainer>
  )
}

export default ColorPicker
