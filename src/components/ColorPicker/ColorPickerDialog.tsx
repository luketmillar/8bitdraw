import React from 'react'
import styled from 'styled-components'
import { RgbaColorPicker } from 'react-colorful'
import { Color } from '../../models/Color'
import { EyedropperIcon } from '../Icons'
import { HexInputContainer, HexInput, OpacityInput, SaveButton, EyedropperButton } from './shared'

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

interface ColorPickerDialogProps {
  color: Color
  onColorChange: (color: { r: number; g: number; b: number; a: number }) => void
  onHexInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  onOpacityInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  onHexKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onOpacityKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onSave: () => void
  onEyedropperClick: () => void
}

export const ColorPickerDialogComponent: React.FC<ColorPickerDialogProps> = ({
  color,
  onColorChange,
  onHexInput,
  onOpacityInput,
  onHexKeyDown,
  onOpacityKeyDown,
  onSave,
  onEyedropperClick,
}) => {
  return (
    <ColorPickerDialog>
      <ColorPickerContent>
        <StyledRgbaColorPicker
          color={{
            r: color.getR(),
            g: color.getG(),
            b: color.getB(),
            a: color.getA(),
          }}
          onChange={onColorChange}
        />
        <HexInputContainer>
          <EyedropperButton onClick={onEyedropperClick} title='Pick color from canvas'>
            <EyedropperIcon />
          </EyedropperButton>
          <HexInput
            type='text'
            value={color.toHex().toUpperCase()}
            onChange={onHexInput}
            onKeyDown={onHexKeyDown}
            placeholder='#000000'
          />
          <OpacityInput
            type='text'
            value={`${Math.round(color.getA() * 100)}%`}
            onChange={onOpacityInput}
            onKeyDown={onOpacityKeyDown}
            placeholder='100%'
          />
          <SaveButton onClick={onSave} title='Save color'>
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
  )
}
