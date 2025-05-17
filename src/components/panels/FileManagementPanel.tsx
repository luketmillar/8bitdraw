import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { PanelContainer } from './Panel'
import AppController from '../../core/AppController'
import { publishSketch } from '../../api/SketchAPI'

const Container = styled(PanelContainer)`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
`

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

const TitleInput = styled.input`
  background: none;
  border: 1px solid transparent;
  color: #fff;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  min-width: 150px;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }

  &:focus {
    border-color: rgba(255, 255, 255, 0.4);
    outline: none;
  }
`

const Menu = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 72px; /* 20px (container top) + 32px (container height) */
  left: 20px;
  background: #313233;
  border: 1px solid #414243;
  border-radius: 8px;
  padding: 8px 0;
  margin-top: 4px;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  min-width: 150px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(0, 0, 0, 0.1);
  z-index: 2000;
`

const MenuItem = styled.button`
  width: 100%;
  padding: 8px 16px;
  background: none;
  border: none;
  color: #fff;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

const LogoIcon = styled.div`
  width: 24px;
  height: 24px;
  background: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #313233;
`

const MenuSeparator = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 4px 0;
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
`

const ModalContent = styled.div`
  background: #313233;
  border: 1px solid #414243;
  border-radius: 8px;
  padding: 20px;
  min-width: 300px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(0, 0, 0, 0.1);
`

const ModalTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #fff;
  font-size: 18px;
`

const InputGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`

const InputWrapper = styled.div`
  flex: 1;
`

const InputLabel = styled.label`
  display: block;
  color: #fff;
  margin-bottom: 8px;
  font-size: 14px;
`

const Input = styled.input`
  width: 100%;
  background: #1e1e1e;
  border: 1px solid #414243;
  border-radius: 4px;
  color: #fff;
  padding: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #666;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

const Button = styled.button<{ primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  background: ${(props) => (props.primary ? '#4a9eff' : '#414243')};
  color: #fff;

  &:hover {
    background: ${(props) => (props.primary ? '#5babff' : '#4f4f4f')};
  }
`

interface FileManagementPanelProps {
  controller: AppController
}

export const FileManagementPanel = ({ controller }: FileManagementPanelProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [editedTitle, setEditedTitle] = useState(
    controller.getCurrentSketch()?.title || 'Untitled Sketch'
  )
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false)
  const [width, setWidth] = useState(controller.getCurrentSketch()?.size[0] || 30)
  const [height, setHeight] = useState(controller.getCurrentSketch()?.size[1] || 30)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handleTitleClick = () => {
    setIsEditing(true)
    setEditedTitle(controller.getCurrentSketch()?.title || 'Untitled Sketch')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value)
  }

  const handleTitleBlur = () => {
    setIsEditing(false)
    if (editedTitle !== controller.getCurrentSketch()?.title) {
      controller.setSketchTitle(editedTitle)
    }
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
      if (editedTitle !== controller.getCurrentSketch()?.title) {
        controller.setSketchTitle(editedTitle)
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditedTitle(controller.getCurrentSketch()?.title || 'Untitled Sketch')
    }
  }

  const handleUndo = () => {
    controller.undo()
  }

  const handleRedo = () => {
    controller.redo()
  }

  const handleSizeChange = () => {
    setWidth(controller.getCurrentSketch()?.size[0] || 30)
    setHeight(controller.getCurrentSketch()?.size[1] || 30)
    setIsSizeModalOpen(true)
  }

  const handleSizeSubmit = () => {
    const newWidth = Math.max(1, Math.min(256, width))
    const newHeight = Math.max(1, Math.min(256, height))
    controller.resizeSketch([newWidth, newHeight])
    setIsSizeModalOpen(false)
  }

  const handleSizeCancel = () => {
    setIsSizeModalOpen(false)
  }

  const handlePublish = () => {
    publishSketch(controller.getCurrentSketch())
  }

  const handleToggleGrid = () => {
    controller.toggleGrid()
  }

  return (
    <>
      <Container ref={containerRef}>
        <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <LogoIcon>8</LogoIcon>
        </MenuButton>

        {isEditing ? (
          <TitleInput
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            autoFocus
          />
        ) : (
          <TitleInput
            value={controller.getCurrentSketch()?.title || 'Untitled Sketch'}
            onClick={handleTitleClick}
            readOnly
          />
        )}

        <Menu isOpen={isMenuOpen}>
          <MenuItem
            onClick={() => {
              setIsMenuOpen(false)
              handlePublish()
            }}
          >
            Publish
          </MenuItem>
          <MenuItem
            onClick={() => {
              setIsMenuOpen(false)
              handleSizeChange()
            }}
          >
            Sketch Size
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            onClick={() => {
              setIsMenuOpen(false)
              handleToggleGrid()
            }}
          >
            {controller.isGridVisible ? 'Hide Grid' : 'Show Grid'}
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            onClick={() => {
              setIsMenuOpen(false)
              handleUndo()
            }}
            disabled={!controller.canUndo()}
          >
            Undo
          </MenuItem>
          <MenuItem
            onClick={() => {
              setIsMenuOpen(false)
              handleRedo()
            }}
            disabled={!controller.canRedo()}
          >
            Redo
          </MenuItem>
        </Menu>
      </Container>

      {isSizeModalOpen && (
        <ModalOverlay onClick={handleSizeCancel}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Change Sketch Size</ModalTitle>
            <InputGroup>
              <InputWrapper>
                <InputLabel>Width</InputLabel>
                <Input
                  type='number'
                  min='0'
                  max='256'
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value) || 1)}
                  autoFocus
                />
              </InputWrapper>
              <InputWrapper>
                <InputLabel>Height</InputLabel>
                <Input
                  type='number'
                  min='0'
                  max='256'
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 1)}
                />
              </InputWrapper>
            </InputGroup>
            <ButtonGroup>
              <Button onClick={handleSizeCancel}>Cancel</Button>
              <Button primary onClick={handleSizeSubmit}>
                Apply
              </Button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  )
}
