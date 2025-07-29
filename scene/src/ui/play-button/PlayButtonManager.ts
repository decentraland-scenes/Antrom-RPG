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
  }

  public startGame(): void {
    if (this.isGameStarted) return

    console.log('Starting tower defense game!')
    this.isGameStarted = true

    const player = Player.getInstanceOrNull()
    if (!player) {
      console.error('Player not found when starting game')
      return
    }

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
      }
    }

    // Game starts silently - no announcement needed

    console.log('Tower defense game started successfully')
  }

  public resetGame(): void {
    this.isGameStarted = false
    this.isVisible = true
    console.log('Game reset - play button visible again')
  }
}
