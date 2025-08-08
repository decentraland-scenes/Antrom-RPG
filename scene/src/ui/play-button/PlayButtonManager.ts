import { Player } from '../../player/player'
import { CountdownTimerManager } from '../timer/countdownTimerManager'
import { Color4 } from '@dcl/sdk/math'

export class PlayButtonManager {
  private static instance: PlayButtonManager | null = null
  private isGameStarted: boolean = false
  private isVisible: boolean = true

  private constructor() {}

  public static getInstance(): PlayButtonManager {
    if (!PlayButtonManager.instance) {
      PlayButtonManager.instance = new PlayButtonManager()
    }
    return PlayButtonManager.instance
  }

  public getIsVisible(): boolean {
    return this.isVisible
  }

  public getIsGameStarted(): boolean {
    return this.isGameStarted
  }

  public dismissRules(): void {
    console.log('Dismissing rules screen')
    this.isVisible = false
    // Don't start the game when dismissing rules
  }

  public startGame(): void {
    if (this.isGameStarted) {
      console.log('Game already started, ignoring start request')
      return
    }

    console.log('Starting tower defense game!')
    this.isGameStarted = true

    const player = Player.getInstanceOrNull()
    if (!player) {
      console.error('Player not found when starting game')
      this.isGameStarted = false // Reset if player not found
      return
    }

    try {
      // Start the countdown timer
      const timerManager = CountdownTimerManager.getInstance()
      timerManager.resetTimer()
      timerManager.showTimer()
      timerManager.initializeTimerSystem()

      // Start the gargoyle fountain spawning system (5-minute delay built in)
      const currentRealm = player.gameController.realmController.currentRealm
      if (currentRealm && currentRealm.getId() === 'antrom') {
        const gargoyleFountain = (currentRealm as any).gargoyleFountain
        if (gargoyleFountain) {
          console.log('Starting gargoyle fountain spawning system')
          gargoyleFountain.startExecutionerSpawningSystem()
        } else {
          console.error('Gargoyle fountain not found in current realm')
        }
      } else {
        console.error('Current realm is not antrom or is null')
      }

      console.log('Tower defense game started successfully')
    } catch (error) {
      console.error('Error starting game:', error)
      this.isGameStarted = false // Reset on error
    }
  }

  public resetGame(): void {
    this.isGameStarted = false
    this.isVisible = true
    console.log('Game reset - play button visible again')
  }
}
