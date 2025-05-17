import AppController from '../../core/AppController'
import FillTool from '../../tools/FillTool'
import DrawTool from '../../tools/DrawTool'
import EraseTool from '../../tools/EraseTool'
import LineTool from '../../tools/LineTool'
import RectangleTool from '../../tools/RectangleTool'
import styled from 'styled-components'
import React from 'react'
import { EraseIcon, FillIcon, LineIcon, PencilIcon, RectangleIcon, EyedropperIcon } from './Icons'
import EventBus from '../../eventbus/EventBus'
import EyedropperTool from '../../tools/EyedropperTool'
import { PanelContainer } from './Panel'

const ToolButton = styled.button<{ selected?: boolean }>`
  background: ${({ selected }) => (selected ? '#7c3aed' : 'transparent')};
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  cursor: pointer;
  outline: none;
  transition:
    background 0.15s,
    box-shadow 0.15s;
  box-shadow: ${({ selected }) => (selected ? '0 0 0 2px #7c3aed44' : 'none')};

  svg {
    color: ${({ selected }) => (selected ? '#fff' : '#bfc4cc')};
    width: 24px;
    height: 24px;
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
    <PanelContainer>
      <ToolButton
        onClick={() => controller.toolStack.replace(new DrawTool(controller))}
        selected={tool instanceof DrawTool}
      >
        <PencilIcon />
      </ToolButton>
      <ToolButton
        onClick={() => controller.toolStack.replace(new RectangleTool(controller))}
        selected={tool instanceof RectangleTool}
      >
        <RectangleIcon />
      </ToolButton>
      <ToolButton
        onClick={() => controller.toolStack.replace(new LineTool(controller))}
        selected={tool instanceof LineTool}
      >
        <LineIcon />
      </ToolButton>
      <ToolButton
        onClick={() => controller.toolStack.replace(new FillTool(controller))}
        selected={tool instanceof FillTool}
      >
        <FillIcon />
      </ToolButton>
      <ToolButton
        onClick={() => controller.toolStack.replace(new EraseTool(controller))}
        selected={tool instanceof EraseTool}
      >
        <EraseIcon />
      </ToolButton>
      <ToolButton
        onClick={() => controller.toolStack.replace(new EyedropperTool(controller))}
        selected={tool instanceof EyedropperTool}
      >
        <EyedropperIcon />
      </ToolButton>
    </PanelContainer>
  )
}

export default Toolbar
