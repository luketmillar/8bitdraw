import AppController from '../core/AppController'
import FillTool from '../tools/FillTool'
import DrawTool from '../tools/DrawTool'
import EraseTool from '../tools/EraseTool'
import LineTool from '../tools/LineTool'
import RectangleTool from '../tools/RectangleTool'
import styled from 'styled-components'
import React from 'react'
import { EraseIcon, FillIcon, LineIcon, PencilIcon, RectangleIcon } from './Icons'
import EventBus from '../eventbus/EventBus'

const ColorPickerContainer = styled.div`
  position: absolute;
  top: 38px;
  padding-top: 15px;
  width: 100%;
  border-radius: 0 0 10px 10px;
  z-index: -1;
  transition:
    height 0.3s ease,
    background-color 0.1s ease;
  box-shadow:
    -9px 9px 9px -0.5px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(0, 0, 0, 0.1);
`
const ColorPicker = ({ controller }: { controller: AppController }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [color, setColor] = React.useState(controller.toolStack.currentColor)
  React.useEffect(() => {
    return EventBus.on('tool', 'color', setColor)
  })
  return (
    <ColorPickerContainer
      onClick={() => setIsOpen((v) => !v)}
      style={{ backgroundColor: isOpen ? '#fff' : color, height: isOpen ? 300 : 25 }}
    ></ColorPickerContainer>
  )
}

const Container = styled.div`
  position: relative;
  border-radius: 10px;
  background-color: #444;
  color: #333;
  display: flex;
  align-items: center;
  padding: 5px;
  :last-child {
    margin-right: 0;
  }
  box-shadow:
    0px 0px 2px 2px rgba(70, 70, 70, 0.1),
    -9px 9px 9px -0.5px rgba(0, 0, 0, 0.1);
  .selected {
    background-color: #595959;
  }
`

const useCurrentTool = (controller: AppController) => {
  const [tool, setTool] = React.useState(controller.toolStack.top)
  React.useEffect(() => {
    return EventBus.on('tool', 'stack-changed', (tool) => setTool(tool))
  })
  return tool
}

const Toolbar = ({ controller }: { controller: AppController }) => {
  const tool = useCurrentTool(controller)
  return (
    <div style={{ position: 'relative' }}>
      <Container>
        <ToolItem
          onClick={() => controller.toolStack.replace(new DrawTool(controller))}
          selected={tool instanceof DrawTool}
        >
          <PencilIcon />
        </ToolItem>
        <ToolItem
          onClick={() => controller.toolStack.replace(new RectangleTool(controller))}
          selected={tool instanceof RectangleTool}
        >
          <RectangleIcon />
        </ToolItem>
        <ToolItem
          onClick={() => controller.toolStack.replace(new LineTool(controller))}
          selected={tool instanceof LineTool}
        >
          <LineIcon />
        </ToolItem>
        <ToolItem
          onClick={() => controller.toolStack.replace(new FillTool(controller))}
          selected={tool instanceof FillTool}
        >
          <FillIcon />
        </ToolItem>
        <ToolItem
          onClick={() => controller.toolStack.replace(new EraseTool(controller))}
          selected={tool instanceof EraseTool}
        >
          <EraseIcon />
        </ToolItem>
      </Container>
      <ColorPicker controller={controller} />
    </div>
  )
}

const ItemContainer = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  outline: none;
  margin-right: 5px;
  width: 38px;
  height: 38px;
  padding: 4px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
`

const ToolItem = ({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode
  selected?: boolean
  onClick: React.MouseEventHandler
}) => {
  return (
    <ItemContainer onClick={onClick} className={selected ? 'selected' : ''}>
      {children}
    </ItemContainer>
  )
}

export default Toolbar
