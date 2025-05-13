import React from 'react'
import styled from 'styled-components'
import { Color } from '../../../models/Color'
import { TransparencyBackground } from './shared'

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
    z-index: 2;
  }

  > span {
    position: relative;
    z-index: 3;
  }
`

interface ColorPreviewProps {
  color: Color
  onClick: (e: React.MouseEvent) => void
}

export const ColorPreview: React.FC<ColorPreviewProps> = ({ color, onClick }) => {
  return (
    <Preview color={color} onClick={onClick}>
      <TransparencyBackground />
      <span>{color.toHex().toUpperCase()}</span>
    </Preview>
  )
}
