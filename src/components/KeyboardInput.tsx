import React from 'react'
import AppController from '../core/AppController'

export const useKeyboardCommands = (appController: AppController) => {
  const onKeypress = (e: KeyboardEvent) => {
    const command = appController.command.getKeyboardMatch(e)
    if (command) {
      appController.command.runCommand(command)
      e.preventDefault()
    }
  }
  React.useEffect(() => {
    window.addEventListener('keydown', onKeypress)
    return () => window.removeEventListener('keydown', onKeypress)
  }, [])
}
