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

const Container = styled.div`
  border-radius: 10px;
  background-color: #263340;
  color: #333;
  display: flex;
  align-items: center;
  padding: 5px;
  :last-child {
    margin-right: 0;
  }
  .selected {
    background-color: #48627c;
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
