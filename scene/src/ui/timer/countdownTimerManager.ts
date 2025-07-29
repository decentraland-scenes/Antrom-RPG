import { engine, AudioSource, Transform } from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils'
import { Vector3 } from '@dcl/sdk/math'

export class CountdownTimerManager {
  private static instance: CountdownTimerManager | null = null
  private gameStartTime: number = Date.now()
  private totalGameTime: number = 60 * 60 * 1000 // 60 minutes in milliseconds
  private currentMinutes: string = '60'
  private currentSeconds: string = '00'
  private isVisible: boolean = true
  private shouldFlash: boolean = false
  private wasFlashing: boolean = false // Track if we were flashing in previous frame
  private timerSystem: any = null
  private warningSoundEntity: any = null

  private constructor() {
    this.startTimerSystem()
  }

  public static getInstance(): CountdownTimerManager {
    if (!CountdownTimerManager.instance) {
      CountdownTimerManager.instance = new CountdownTimerManager()
    }
    return CountdownTimerManager.instance
  }

  private startTimerSystem(): void {
    console.log('Starting countdown timer system')

    this.timerSystem = utils.timers.setInterval(() => {
      this.updateTimer()
    }, 1000) // Update every second
  }

  private updateTimer(): void {
    const elapsed = Date.now() - this.gameStartTime
    const remaining = this.totalGameTime - elapsed

    if (remaining <= 0) {
      // Game time is up
      console.log('60-minute game time expired!')
      this.currentMinutes = '00'
      this.currentSeconds = '00'
      this.isVisible = false
      this.shouldFlash = false
      this.stopTimerSystem()
      return
    }

    const minutes = Math.floor(remaining / (1000 * 60))
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

    this.currentMinutes = minutes.toString().padStart(2, '0')
    this.currentSeconds = seconds.toString().padStart(2, '0')

    // Check if we should flash (5 seconds before executioners spawn)
    this.checkFlashCondition()

    // Play warning sound when flashing starts
    this.handleWarningSound()

    console.log(
      `Game Time Remaining: ${this.currentMinutes}:${this.currentSeconds}`
    )
  }

  private checkFlashCondition(): void {
    // Calculate time until next spawn cycle
    const elapsed = Date.now() - this.gameStartTime
    const initialDelay = 5 * 60 * 1000 // 5 minutes initial delay
    const spawnCycleInterval = 3 * 60 * 1000 // 3 minutes between spawn cycles

    // If we're past the initial delay
    if (elapsed >= initialDelay) {
      const timeSinceFirstSpawn = elapsed - initialDelay
      const cyclesCompleted = Math.floor(
        timeSinceFirstSpawn / spawnCycleInterval
      )
      const timeInCurrentCycle = timeSinceFirstSpawn % spawnCycleInterval

      // Check if we're within 5 seconds of the next spawn cycle
      const timeUntilNextSpawn = spawnCycleInterval - timeInCurrentCycle
      this.shouldFlash = timeUntilNextSpawn <= 5000 && timeUntilNextSpawn > 0
    } else {
      // Check if we're within 5 seconds of the first spawn
      const timeUntilFirstSpawn = initialDelay - elapsed
      this.shouldFlash = timeUntilFirstSpawn <= 5000 && timeUntilFirstSpawn > 0
    }
  }

  private handleWarningSound(): void {
    // Check if we just started flashing (transition from not flashing to flashing)
    if (this.shouldFlash && !this.wasFlashing) {
      console.log('Playing enemy incoming warning sound')
      this.playWarningSound()
    }

    // Update the previous state
    this.wasFlashing = this.shouldFlash
  }

  private playWarningSound(): void {
    // Create a temporary entity for the warning sound
    this.warningSoundEntity = engine.addEntity()

    // Position the sound entity at the player's position
    Transform.create(this.warningSoundEntity, {
      position: Vector3.create(0, 0, 0)
    })

    // Create the audio source with the warning sound
    AudioSource.create(this.warningSoundEntity, {
      audioClipUrl: 'assets/sounds/enemyIncoming.mp3',
      loop: false,
      playing: true,
      volume: 0.8
    })

    // Remove the entity after the sound finishes playing
    utils.timers.setTimeout(() => {
      if (this.warningSoundEntity) {
        engine.removeEntity(this.warningSoundEntity)
        this.warningSoundEntity = null
      }
    }, 3000) // Remove after 3 seconds (assuming sound is shorter than this)
  }

  private stopTimerSystem(): void {
    if (this.timerSystem) {
      utils.timers.clearInterval(this.timerSystem)
      this.timerSystem = null
    }
  }

  public getCurrentTime(): {
    minutes: string
    seconds: string
    isVisible: boolean
    shouldFlash: boolean
  } {
    return {
      minutes: this.currentMinutes,
      seconds: this.currentSeconds,
      isVisible: this.isVisible,
      shouldFlash: this.shouldFlash
    }
  }

  public hideTimer(): void {
    this.isVisible = false
  }

  public showTimer(): void {
    this.isVisible = true
  }

  public resetTimer(): void {
    this.gameStartTime = Date.now()
    this.currentMinutes = '60'
    this.currentSeconds = '00'
    this.isVisible = true
    this.shouldFlash = false
    this.wasFlashing = false
  }

  public destroy(): void {
    this.stopTimerSystem()

    // Clean up warning sound entity if it exists
    if (this.warningSoundEntity) {
      engine.removeEntity(this.warningSoundEntity)
      this.warningSoundEntity = null
    }

    CountdownTimerManager.instance = null
  }
}
