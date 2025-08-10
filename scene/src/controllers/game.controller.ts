import { NPCs } from '../NPCs'
import { Dialogs } from '../dialog'
import { SendWearable } from '../menu/wearableMenu'
import { RealmController } from './realm.controller'
import { UIController } from './ui.controller'
import { Player } from '../player/player'
import { setPlayerPosition } from '../utils/engine'
import { CountdownTimerManager } from '../ui/timer/countdownTimerManager'
import { PlayButtonManager } from '../ui/play-button/PlayButtonManager'
import { TutorialManager } from '../ui/tutorial/TutorialManager'
import * as utils from '@dcl-sdk/utils'
import { engine, Transform, VisibilityComponent } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { entityController } from '../realms/entityController' // Added for entityController.clean()

// Global flag to disable trigger system during restart
let isRestarting = false

// Store original console.error and Transform.get
let originalConsoleError: any = null
let originalTransformGet: any = null

// Function to suppress trigger system errors during restart
function suppressTriggerErrors(): void {
  console.log('Suppressing trigger system errors during restart...')

  // Store original console.error
  if (!originalConsoleError) {
    originalConsoleError = console.error
  }

  // Store original Transform.get
  if (!originalTransformGet) {
    originalTransformGet = Transform.get
  }

  // Override console.error to suppress trigger system errors
  console.error = function (...args: any[]) {
    const errorMessage = args.join(' ')

    // Suppress specific trigger system errors during restart
    if (
      isRestarting &&
      (errorMessage.includes(
        '[getFrom] Component core::Transform for entity'
      ) ||
        errorMessage.includes('Component core::Transform for entity') ||
        errorMessage.includes('not found'))
    ) {
      // Don't log these errors during restart
      return
    }

    // Log all other errors normally
    originalConsoleError.apply(console, args)
  }

  // Override Transform.get to return a safe default during restart
  Transform.get = function (entity: any) {
    try {
      return originalTransformGet(entity)
    } catch (error) {
      // During restart, return a safe default instead of throwing
      if (isRestarting) {
        console.log('Suppressed Transform.get error for entity during restart')
        return {
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          scale: { x: 1, y: 1, z: 1 }
        }
      }
      throw error
    }
  }
}

// Function to restore normal error logging
function restoreErrorLogging(): void {
  console.log('Restoring normal error logging...')

  if (originalConsoleError) {
    console.error = originalConsoleError
  }

  if (originalTransformGet) {
    Transform.get = originalTransformGet
  }
}

// Function to safely execute trigger operations
function safeTriggerOperation(operation: () => void): void {
  if (isRestarting) {
    try {
      operation()
    } catch (error) {
      // Silently ignore trigger errors during restart
      console.log('Suppressed trigger error during restart:', error)
    }
  } else {
    operation()
  }
}

// Function to reset entities in place instead of removing them
function resetEntitiesInPlace(): void {
  console.log('Resetting entities in place to avoid trigger conflicts...')

  try {
    // Instead of removing entities, reset them to a safe state
    const entitiesToReset = engine.getEntitiesWith(Transform)
    for (const [entity] of entitiesToReset) {
      // Skip critical entities
      if (
        entity === engine.CameraEntity ||
        entity === engine.RootEntity ||
        entity === 1
      ) {
        continue
      }

      // Only reset user-created entities (higher IDs)
      if (entity > 10) {
        try {
          // Reset entity position to a safe location instead of removing it
          const transform = Transform.get(entity)
          if (transform) {
            // Move entity to a safe location far away
            Transform.getMutable(entity).position = Vector3.create(
              1000,
              1000,
              1000
            )

            // Make entity invisible to prevent any interactions
            try {
              const visibility = VisibilityComponent.get(entity)
              if (visibility) {
                VisibilityComponent.getMutable(entity).visible = false
              }
            } catch (error) {
              // Entity might not have visibility component, that's okay
            }
          }
        } catch (error) {
          console.log('Entity already processed or removed:', error)
        }
      }
    }

    console.log('Entities reset in place successfully')
  } catch (error) {
    console.log('Error resetting entities in place:', error)
  }
}

export class GameController {
  uiController: UIController
  realmController: RealmController
  dialogs: Dialogs
  npcs: NPCs
  sendWearable: SendWearable
  tutorialManager: TutorialManager
  isGameOver: boolean = false

  constructor() {
    this.uiController = new UIController(this)
    this.realmController = new RealmController(this)
    this.dialogs = new Dialogs(this)
    this.npcs = new NPCs(this)
    this.sendWearable = new SendWearable(this)

    // Initialize tutorial manager
    this.tutorialManager = TutorialManager.getInstance()
    this.tutorialManager.setGameController(this)

    // Add tutorial checking system
    engine.addSystem(this.checkTutorialProgress.bind(this))
  }

  restartGame(): void {
    console.log('Resetting game state in place (no entity removal)...')

    // Show a message to the player
    const player = Player.getInstanceOrNull()
    if (player) {
      player.gameController.uiController.displayAnnouncement(
        'Resetting game...',
        Color4.Green(),
        2000
      )
    }

    // Simple reset without entity removal
    this.performSimpleReset()
  }

  private performSimpleReset(): void {
    console.log('Performing simple game state reset...')

    try {
      // Reset game over state
      this.isGameOver = false

      // Reset play button manager
      const playButtonManager = PlayButtonManager.getInstance()
      playButtonManager.resetGame()

      // Reset timer manager
      const timerManager = CountdownTimerManager.getInstance()
      timerManager.hideTimer()
      timerManager.resetTimer()

      // Reset player position and health
      const player = Player.getInstanceOrNull()
      if (player) {
        player.refillHealthBar(1, false)
        setPlayerPosition(-22.21, 5.43, -26.53)

        // Clear all deployed units (lumberjacks, fighters, miners)
        player.clearAllDeployedUnits()

        // Reset inventory to initial state
        player.resetInventory()
      }

      // Clear executioners by moving them far away (instead of removing them)
      this.clearExecutioners()

      // Reset gargoyle fountain health
      const currentRealm = this.realmController.currentRealm
      if (currentRealm && currentRealm.getId() === 'antrom') {
        const gargoyleFountain = (currentRealm as any).gargoyleFountain
        if (gargoyleFountain) {
          gargoyleFountain.health = gargoyleFountain.maxHealth
          gargoyleFountain.isDead = false
          gargoyleFountain.isDeadAnimation = false
          gargoyleFountain.currentScale = gargoyleFountain.initialScale
          gargoyleFountain.lastHealthPercent = 100
          console.log(
            'Gargoyle fountain reset - Health:',
            gargoyleFountain.health
          )
        }
      }

      // Don't start the game automatically - let player click OK button
      console.log('Game reset completed - waiting for player to click OK')

      console.log('Simple reset completed successfully')
    } catch (error) {
      console.error('Error during simple reset:', error)
    }
  }

  private clearExecutioners(): void {
    console.log('Clearing executioners by moving them far away...')

    const currentRealm = this.realmController.currentRealm
    if (currentRealm && currentRealm.getId() === 'antrom') {
      const executioners = (currentRealm as any).executioners || []

      for (const executioner of executioners) {
        try {
          // Move executioner far away instead of removing it
          const transform = Transform.get(executioner.entity)
          if (transform) {
            Transform.getMutable(executioner.entity).position = Vector3.create(
              1000,
              1000,
              1000
            )

            // Make executioner invisible
            try {
              const visibility = VisibilityComponent.get(executioner.entity)
              if (visibility) {
                VisibilityComponent.getMutable(executioner.entity).visible =
                  false
              }
            } catch (error) {
              // Entity might not have visibility component, that's okay
            }
          }
        } catch (error) {
          console.log('Error moving executioner:', error)
        }
      }

      // Clear the executioners array
      executioners.length = 0
      console.log('All executioners moved far away')
    }
  }

  private checkTutorialProgress(): void {
    // Check tutorial progress every frame
    this.tutorialManager.checkStepCompletion()
  }
}

// Export the restart flag so other systems can check it
export { isRestarting }

// Utility function to safely add triggers
export function safeAddTrigger(
  entity: any,
  layer: number,
  layerMask: number,
  triggerShape: any[],
  onEnter: () => void,
  onExit?: () => void
): void {
  safeTriggerOperation(() => {
    utils.triggers.addTrigger(
      entity,
      layer,
      layerMask,
      triggerShape,
      onEnter,
      onExit
    )
  })
}

let currentGameController: GameController
export function getCurrentGameController(): GameController {
  return currentGameController
}

export function setCurrentGameController(controller: GameController): void {
  currentGameController = controller
}
