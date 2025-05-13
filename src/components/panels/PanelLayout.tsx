import React from 'react'
import AppController from '../../core/AppController'
import styled from 'styled-components'
import Toolbar from './Toolbar'
import ColorPicker from './ColorPicker'
import { LayerPanel } from './LayerPanel'

const ToolBarPlacer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`

const ColorPickerPlacer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`

const Spacer = styled.div`
  height: 10px;
`

interface PanelLayoutProps {
  controller: AppController
}

export const PanelLayout: React.FC<PanelLayoutProps> = ({ controller }) => {
  return (
    <>
      <ToolBarPlacer>
        <Toolbar controller={controller} />
      </ToolBarPlacer>
      <ColorPickerPlacer>
        <ColorPicker controller={controller} />
        <Spacer />
        <LayerPanel />
      </ColorPickerPlacer>
    </>
  )
}
