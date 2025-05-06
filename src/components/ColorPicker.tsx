import React from 'react'
import styled from 'styled-components'
import EventBus from '../eventbus/EventBus'
import AppController from '../core/AppController'

const COLORS = [
  '#000000',
  '#22223b',
  '#4a4e69',
  '#9a8c98',
  '#c9ada7',
  '#f2e9e4',
  '#f72585',
  '#b5179e',
  '#7209b7',
  '#560bad',
  '#480ca8',
  '#3a0ca3',
  '#4361ee',
  '#4895ef',
  '#4cc9f0',
  '#38b000',
  '#70e000',
  '#ffd60a',
  '#ff8800',
  '#ff4800',
  '#ffffff',
  '#bfc4cc',
  '#bdb2ff',
  '#a3c4f3',
  '#90dbf4',
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

const ColorPicker = ({ controller }: { controller: AppController }) => {
  const [color, setColor] = React.useState(controller.toolStack.currentColor)
  React.useEffect(() => {
    return EventBus.on('tool', 'color', setColor)
  }, [])
  const handleSelect = (c: string) => {
    setColor(c)
    EventBus.emit('tool', 'color', c)
  }
  return (
    <PickerContainer>
      <Label>Color</Label>
      <Preview color={color} />
      <SwatchGrid>
        {COLORS.map((c) => (
          <Swatch
            key={c}
            color={c}
            selected={c === color}
            onClick={() => handleSelect(c)}
            aria-label={c}
          />
        ))}
      </SwatchGrid>
    </PickerContainer>
  )
}

export default ColorPicker
