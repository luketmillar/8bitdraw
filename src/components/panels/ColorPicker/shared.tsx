import styled from 'styled-components'
import { Color } from '../../../models/Color'

export const TransparencyBackground = styled.div`
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

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #363738;
  margin: 4px 0;
`

export const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 28px);
  gap: 10px;
`

export const Swatch = styled.button<{ color: Color; selected: boolean }>`
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

export const HexInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`

export const HexInput = styled.input`
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

export const OpacityInput = styled.input`
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

export const SaveButton = styled.button`
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

export const EyedropperButton = styled.button`
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
