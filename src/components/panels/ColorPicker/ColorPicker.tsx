import React, { useRef, useEffect } from 'react'
import EventBus from '../../../eventbus/EventBus'
import AppController from '../../../core/AppController'
import EyedropperTool from '../../../tools/EyedropperTool'
import { Color } from '../../../models/Color'
import { ColorPreview } from './ColorPreview'
import { ColorSwatches } from './ColorSwatches'
import { ColorPickerDialogComponent } from './ColorPickerDialog'
import { Divider } from './shared'
import { PanelContainer } from '../Panel'

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

interface ColorPickerProps {
  controller: AppController
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ controller }) => {
  const [color, setColor] = React.useState(controller.toolStack.currentColor)
  const [showPicker, setShowPicker] = React.useState(false)
  const [imageColors, setImageColors] = React.useState<Color[]>([])
  const pickerRef = useRef<HTMLDivElement>(null)
  const previousColorRef = useRef<Color>(color)

  const updateImageColors = () => {
    setImageColors(controller.getColors())
  }

  React.useEffect(() => {
    const colorListener = EventBus.on('tool', 'color', setColor)
    const undoListener = EventBus.on('undo', 'stack-changed', () => updateImageColors())

    // Initial update of image colors
    updateImageColors()

    return () => {
      colorListener()
      undoListener()
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
    setShowPicker(false)
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
    setShowPicker((v) => !v)
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
    <PanelContainer ref={pickerRef}>
      <ColorPreview color={color} onClick={handlePreviewClick} />
      {imageColors.length > 0 && (
        <>
          <Divider />
          <ColorSwatches colors={imageColors} selectedColor={color} onSelect={handleSelect} />
        </>
      )}
      <Divider />
      <ColorSwatches colors={DEFAULT_COLORS} selectedColor={color} onSelect={handleSelect} />
      {showPicker && (
        <ColorPickerDialogComponent
          color={color}
          onColorChange={handleColorChange}
          onHexInput={handleHexInput}
          onOpacityInput={handleOpacityInput}
          onHexKeyDown={handleHexKeyDown}
          onOpacityKeyDown={handleOpacityKeyDown}
          onSave={handleHexSave}
          onEyedropperClick={handleEyedropperClick}
        />
      )}
    </PanelContainer>
  )
}

export default ColorPicker
