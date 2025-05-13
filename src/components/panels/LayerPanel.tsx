import React, { useState } from 'react'
import styled from 'styled-components'
import { PanelContainer } from './Panel'
import AppController from '../../core/AppController'
import EventBus from '../../eventbus/EventBus'

const LayerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  width: 100%;
`

const LayerItem = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  background: ${({ isActive }) => (isActive ? '#7c3aed' : 'transparent')};
  cursor: pointer;
  position: relative;
  transition: background 0.15s;
  &:hover {
    background: ${({ isActive }) => (isActive ? '#7c3aed' : '#28282f')};
  }
`

const LayerName = styled.span`
  flex: 1;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const DropdownButton = styled.button`
  background: none;
  border: none;
  color: #bfc4cc;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  transition: background 0.15s;
  &:hover {
    background: #2a2a2f;
  }
`

const DropdownMenu = styled.div`
  position: absolute;
  right: 12px;
  top: 36px;
  background: #232326;
  border-radius: 8px;
  box-shadow: 0 2px 8px #000a;
  min-width: 120px;
  z-index: 10;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
`

const DropdownItem = styled.button`
  background: none;
  border: none;
  color: #bfc4cc;
  font-size: 15px;
  text-align: left;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #31313a;
    color: #fff;
  }
`

const AddLayerIconButton = styled.button`
  background: transparent;
  border: none;
  color: #bfc4cc;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
  &:hover {
    background: #7c3aed;
    color: #fff;
  }
`

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 8px 0 16px;
  margin-bottom: 2px;
`

const PanelTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.01em;
`

export interface LayerPanelProps {
  controller: AppController
}

export const LayerPanel: React.FC<LayerPanelProps> = ({ controller }) => {
  const [layers, setLayers] = React.useState(controller.getLayers())
  const [activeLayerId, setActiveLayerId] = React.useState(controller.getActiveLayerId())
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

  React.useEffect(() => {
    const updateLayers = () => {
      setLayers(controller.getLayers())
      setActiveLayerId(controller.getActiveLayerId())
    }
    const listener = EventBus.on('undo', 'stack-changed', updateLayers)
    return () => listener()
  }, [])

  const handleLayerClick = (layerId: string) => {
    controller.setActiveLayer(layerId)
    setActiveLayerId(layerId)
  }

  const handleDeleteLayer = (layerId: string) => {
    controller.deleteLayer(layerId)
    setLayers(controller.getLayers())
    setActiveLayerId(controller.getActiveLayerId())
    setDropdownOpen(null)
  }

  const handleDuplicateLayer = (layerId: string) => {
    // TODO: Implement real duplication logic
    const layer = layers.find((l) => l.id === layerId)
    if (layer) {
      controller.addLayer(layer.metadata.title + ' Copy')
      setLayers(controller.getLayers())
      setActiveLayerId(controller.getActiveLayerId())
    }
    setDropdownOpen(null)
  }

  const handleRenameLayer = (layerId: string) => {
    // TODO: Implement rename logic (show prompt/modal)
    const newTitle = prompt('Rename layer:', layers.find((l) => l.id === layerId)?.metadata.title)
    if (newTitle && newTitle.trim()) {
      const layer = layers.find((l) => l.id === layerId)
      if (layer) {
        layer.metadata.title = newTitle.trim()
        setLayers([...layers])
      }
    }
    setDropdownOpen(null)
  }

  // Show layers from top to bottom (last is topmost)
  const orderedLayers = [...layers].reverse()

  return (
    <PanelContainer style={{ width: 198, padding: 0, gap: 0 }}>
      <PanelHeader>
        <PanelTitle>Layers</PanelTitle>
        <AddLayerIconButton
          title='Add Layer'
          onClick={() => {
            controller.addLayer()
            setLayers(controller.getLayers())
            setActiveLayerId(controller.getActiveLayerId())
          }}
        >
          +
        </AddLayerIconButton>
      </PanelHeader>
      <LayerList>
        {orderedLayers.map((layer) => (
          <LayerItem
            key={layer.id}
            isActive={layer.id === activeLayerId}
            onClick={() => handleLayerClick(layer.id)}
          >
            <LayerName>{layer.metadata.title}</LayerName>
            <DropdownButton
              onClick={(e) => {
                e.stopPropagation()
                setDropdownOpen(dropdownOpen === layer.id ? null : layer.id)
              }}
              aria-label='Layer options'
            >
              ⋮
            </DropdownButton>
            {dropdownOpen === layer.id && (
              <DropdownMenu onClick={(e) => e.stopPropagation()}>
                <DropdownItem onClick={() => handleRenameLayer(layer.id)}>Rename</DropdownItem>
                <DropdownItem onClick={() => handleDuplicateLayer(layer.id)}>
                  Duplicate
                </DropdownItem>
                {layers.length > 1 && (
                  <DropdownItem
                    onClick={() => handleDeleteLayer(layer.id)}
                    style={{ color: '#ff4444' }}
                  >
                    Delete
                  </DropdownItem>
                )}
              </DropdownMenu>
            )}
          </LayerItem>
        ))}
      </LayerList>
    </PanelContainer>
  )
}
