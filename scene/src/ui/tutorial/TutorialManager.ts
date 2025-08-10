import { Player } from '../../player/player'
import { Color4 } from '@dcl/sdk/math'
import { GameController } from '../../controllers/game.controller'
import { ITEM_TYPES } from '../../inventory/playerInventoryMap'
import { CountdownTimerManager } from '../timer/countdownTimerManager'
import * as utils from '@dcl-sdk/utils'

export interface TutorialStep {
  id: string
  title: string
  description: string
  instructions: string
  highlightElement?: string // UI element to highlight
  requiredAction?: string // Action player needs to complete
  onStart?: () => void
  onComplete?: () => void
  checkCompletion?: () => boolean
}

export class TutorialManager {
  private static instance: TutorialManager
  private isActive: boolean = false
  private currentStepIndex: number = 0
  private steps: TutorialStep[] = []
  private gameController: GameController | null = null

  constructor() {
    this.initializeSteps()
  }

  static getInstance(): TutorialManager {
    if (!TutorialManager.instance) {
      TutorialManager.instance = new TutorialManager()
    }
    return TutorialManager.instance
  }

  setGameController(gameController: GameController): void {
    this.gameController = gameController
  }

  private initializeSteps(): void {
    this.steps = [
      {
        id: 'welcome',
        title: 'Welcome to Antrom!',
        description: 'Learn how to gather resources and deploy units',
        instructions:
          'Welcome to Antrom! This tutorial will teach you the basics of resource gathering and unit deployment. You\'ll learn how to deploy lumberjacks to gather wood and fighters for combat. Click "Next" to begin your journey!',
        onStart: () => {
          // Welcome message handled by TutorialUI
        }
      },
      {
        id: 'resource_gathering_intro',
        title: 'Resource Gathering',
        description: 'Learn how to deploy lumberjacks to gather wood',
        instructions:
          "First, let's learn how to gather resources. You'll need wood to build fighters later.",
        onStart: () => {
          // Resource gathering intro handled by TutorialUI
        }
      },
      {
        id: 'deploy_lumberjack',
        title: 'Deploy a Lumberjack',
        description: 'Click the "Units" button to open the unit menu',
        instructions:
          'Click the "Units" button on the right side of your screen to open the unit deployment menu.',
        highlightElement: 'units-button',
        requiredAction: 'open_units_menu',
        onStart: () => {
          // Units button instruction handled by TutorialUI
        },
        checkCompletion: () => {
          const player = Player.getInstanceOrNull()
          return (
            player?.gameController?.uiController?.purchaseMenu?.isVisible ||
            false
          )
        }
      },
      {
        id: 'select_lumberjack',
        title: 'Select Lumberjack',
        description: 'Choose lumberjack from the unit menu',
        instructions:
          'In the unit menu, click on the lumberjack option to start deployment.',
        highlightElement: 'lumberjack-option',
        requiredAction: 'select_lumberjack',
        onStart: () => {
          // Lumberjack selection instruction handled by TutorialUI
        },
        checkCompletion: () => {
          const player = Player.getInstanceOrNull()
          return (
            player?.gameController?.uiController?.purchaseMenu
              ?.placingUnitType === 'lumberjack'
          )
        }
      },
      {
        id: 'place_lumberjack',
        title: 'Place Lumberjack',
        description: 'Click on a tree to assign the lumberjack',
        instructions:
          'Now click on any tree near you to assign the lumberjack. The lumberjack will automatically harvest wood from that tree.',
        requiredAction: 'place_lumberjack',
        onStart: () => {
          // Tree placement instruction handled by TutorialUI
        },
        checkCompletion: () => {
          const player = Player.getInstanceOrNull()
          return (player?.lumberjacks?.length || 0) > 0
        },
        onComplete: () => {
          // Success message handled by TutorialUI
        }
      },
      {
        id: 'check_resources',
        title: 'Check Resources',
        description: 'View your gathered resources',
        instructions:
          'Look at the top of your screen to see your wood count. The lumberjack will continue harvesting automatically.',
        onStart: () => {
          // Resource check instruction handled by TutorialUI
        }
      },
      {
        id: 'fighter_intro',
        title: 'Combat Units',
        description: 'Learn how to deploy fighters',
        instructions:
          "Now let's learn about combat units. Fighters can attack enemies and protect your realm.",
        onStart: () => {
          // Fighter intro handled by TutorialUI
        }
      },
      {
        id: 'deploy_fighter',
        title: 'Deploy a Fighter',
        description: 'Deploy a fighter using wood and rock',
        instructions:
          'Fighters cost wood and rock. Make sure you have enough resources, then select fighter from the units menu.',
        requiredAction: 'deploy_fighter',
        onStart: () => {
          // Fighter deployment instruction handled by TutorialUI
        },
        checkCompletion: () => {
          const player = Player.getInstanceOrNull()
          return (player?.fighters?.length || 0) > 0
        },
        onComplete: () => {
          // Success message handled by TutorialUI
        }
      },
      {
        id: 'tutorial_complete',
        title: 'Tutorial Complete!',
        description: "You've learned the basics",
        instructions:
          'Congratulations! You now know how to gather resources and deploy units. You can restart the tutorial anytime.',
        onStart: () => {
          // Tutorial completion handled by TutorialUI
        }
      }
    ]
  }

  startTutorial(): void {
    console.log('Starting tutorial...')
    this.isActive = true
    this.currentStepIndex = 0

    // Hide the timer during tutorial
    const timerManager = CountdownTimerManager.getInstance()
    timerManager.hideTimer()

    this.showCurrentStep()
  }

  private showCurrentStep(): void {
    if (!this.isActive || this.currentStepIndex >= this.steps.length) {
      this.completeTutorial()
      return
    }

    const step = this.steps[this.currentStepIndex]
    console.log(`Tutorial step: ${step.title}`)

    if (step.onStart) {
      step.onStart()
    }

    // Show step instructions
    this.showStepInstructions(step)
  }

  private showStepInstructions(step: TutorialStep): void {
    // No longer needed since we have a proper tutorial UI
    // The instructions are now displayed in the TutorialUI component
  }

  private showAnnouncement(message: string, color: Color4): void {
    // No longer needed since we have a proper tutorial UI
    // Announcements are now handled by the TutorialUI component
  }

  checkStepCompletion(): void {
    if (!this.isActive) return

    const currentStep = this.steps[this.currentStepIndex]
    if (!currentStep) return

    if (currentStep.checkCompletion && currentStep.checkCompletion()) {
      this.completeCurrentStep()
    }
  }

  private completeCurrentStep(): void {
    const currentStep = this.steps[this.currentStepIndex]

    if (currentStep.onComplete) {
      currentStep.onComplete()
    }

    this.currentStepIndex++

    // Add a small delay before showing the next step
    utils.timers.setTimeout(() => {
      this.showCurrentStep()
    }, 2000)
  }

  private completeTutorial(): void {
    console.log('Tutorial completed!')
    this.isActive = false
    this.currentStepIndex = 0

    // Show the timer again when tutorial ends
    const timerManager = CountdownTimerManager.getInstance()
    timerManager.showTimer()

    // No announcement needed since we have a proper tutorial UI
  }

  isTutorialActive(): boolean {
    return this.isActive
  }

  getCurrentStep(): TutorialStep | null {
    if (!this.isActive || this.currentStepIndex >= this.steps.length) {
      return null
    }
    return this.steps[this.currentStepIndex]
  }

  skipTutorial(): void {
    console.log('Tutorial skipped')
    this.isActive = false
    this.currentStepIndex = 0

    // Show the timer again when tutorial is skipped
    const timerManager = CountdownTimerManager.getInstance()
    timerManager.showTimer()

    // No announcement needed since we have a proper tutorial UI
  }

  restartTutorial(): void {
    console.log('Restarting tutorial...')
    this.startTutorial()
  }

  nextStep(): void {
    console.log('Advancing to next tutorial step...')
    this.completeCurrentStep()
  }

  getCurrentStepIndex(): number {
    return this.currentStepIndex
  }

  getTotalSteps(): number {
    return this.steps.length
  }
}
