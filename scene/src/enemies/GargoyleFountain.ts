import {
  Transform,
  GltfContainer,
  AudioSource,
  Animator,
  engine,
  MeshRenderer,
  VisibilityComponent,
  type Entity
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { LEVEL_TYPES } from '../player/LevelManager'
import { Player } from '../player/player'
import { entityController } from '../realms/entityController'
import MonsterMobAuto from './monsterMobAuto'
import Executioner from './Executioner'
import * as utils from '@dcl-sdk/utils'
import { CountdownTimerManager } from '../ui/timer/countdownTimerManager'

export default class GargoyleFountain extends MonsterMobAuto {
  shapeFile = 'assets/models/gargoyle_fountain.glb'
  hoverText: string
  private initialScale: Vector3 = Vector3.create(6.25, 6.25, 6.25) // 6.25x larger (25% bigger)
  private currentScale: Vector3 = Vector3.create(6.25, 6.25, 6.25)
  private lastHealthPercent: number = 100
  private isShrinking: boolean = false
  private rotationSpeed: number = 0.5 // degrees per frame
  private currentRotation: number = 0
  private spawnInterval: any = null

  // New executioner spawning system
  private initialDelay: number = 5 * 60 * 1000 // 5 minutes initial delay
  private spawnCycleInterval: number = 3 * 60 * 1000 // 3 minutes between spawn cycles
  private spawnWindowDuration: number = 45 * 1000 // 45 seconds spawn window
  private isSpawning: boolean = false
  private spawnCycleTimer: any = null
  private spawnWindowTimer: any = null

  constructor() {
    const player = Player.getInstanceOrNull()
    const level = player?.levels.getLevel(LEVEL_TYPES.PLAYER) ?? 2
    // Set gargoyle fountain to 10k health
    super(level - 5, level * 50, level, 10000, 0.01, 7, 2.5)
    this.minLuck = 5
    this.hoverText = `Attack the Gargoyle Fountain!`

    // Set initial position in the middle of the map
    this.loadTransformation()

    // Initialize monster with correct position
    this.initMonster()

    this.dropRate = -1 // No drops
  }

  reduceHealth(attack: number): void {
    console.log('GargoyleFountain.reduceHealth called with attack:', attack)
    console.log('GargoyleFountain health before damage:', this.health)
    console.log('GargoyleFountain isDead:', this.isDead)

    // Call the base reduceHealth method first
    super.reduceHealth(attack)

    console.log('GargoyleFountain health after damage:', this.health)

    // Update the health bar to show the damage
    this.updateHealthBar()

    // Handle shrinking based on health percentage
    this.handleShrinking()

    // Check if gargoyle fountain died
    if (this.health <= 0 && !this.isDead) {
      console.log('Gargoyle Fountain destroyed!')
      this.isDead = true
      this.onDead()
    }
  }

  private handleShrinking(): void {
    if (this.isDead || this.isShrinking) return

    const healthPercent = (this.health / this.maxHealth) * 100
    const healthPercentRounded = Math.floor(healthPercent / 10) * 10 // Round to nearest 10%

    // Only shrink if we've lost a full 10% since last check
    if (healthPercentRounded < this.lastHealthPercent) {
      this.isShrinking = true

      // Calculate how many 10% chunks we've lost
      const chunksLost = (this.lastHealthPercent - healthPercentRounded) / 10
      const shrinkFactor = 1 - chunksLost * 0.1 // Shrink by 10% per chunk lost

      console.log(
        `Gargoyle Fountain shrinking! Health: ${healthPercent.toFixed(
          1
        )}%, Shrink factor: ${shrinkFactor}`
      )

      // Apply shrinking with animation
      this.currentScale = Vector3.scale(this.initialScale, shrinkFactor)

      // Animate the shrinking
      const currentTransform = Transform.get(this.entity)
      const targetScale = this.currentScale

      // Smooth shrinking animation over 1 second
      const startTime = Date.now()
      const animationDuration = 1000 // 1 second

      const shrinkAnimation = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / animationDuration, 1)

        // Ease-out animation
        const easeProgress = 1 - Math.pow(1 - progress, 3)

        const currentScale = Vector3.lerp(
          currentTransform.scale,
          targetScale,
          easeProgress
        )
        Transform.getMutable(this.entity).scale = currentScale

        if (progress < 1) {
          utils.timers.setTimeout(shrinkAnimation, 16) // ~60fps
        } else {
          this.isShrinking = false
          console.log('Gargoyle Fountain shrinking animation complete')
        }
      }

      shrinkAnimation()

      this.lastHealthPercent = healthPercentRounded
    }
  }

  initMonster(): void {
    console.log('init gargoyle fountain')
    if (!this.shape && this.shapeFile) {
      this.shape = this.shapeFile
      GltfContainer.createOrReplace(this.entity, { src: this.shape })
    }
    AudioSource.create(this.entity, {
      audioClipUrl: 'assets/sounds/attack.mp3',
      loop: false
    })
    GltfContainer.createOrReplace(this.entity, { src: this.shape })

    // Create animator with idle animation
    const animator = Animator.createOrReplace(this.entity, {
      states: [
        {
          clip: this.idleClip,
          playing: true,
          loop: true,
          speed: 1
        },
        {
          clip: this.impactClip,
          playing: false,
          loop: false,
          speed: 1
        },
        {
          clip: this.dieClip,
          playing: false,
          loop: false,
          speed: 1
        }
      ]
    })

    console.log(
      'Animator created with states:',
      animator.states.map((state) => state.clip)
    )

    // Don't create health bar - it will be shown in UI instead
    console.log('Gargoyle fountain health will be displayed in UI')

    // Don't set up attack systems since gargoyle fountain doesn't attack back
    // Just set up engagement trigger for health bar display
    this.setupEngageTriggerBox()

    // Add rotation system
    engine.addSystem(this.rotationSystem.bind(this))

    // Add game time check system
    engine.addSystem(this.gameTimeCheckSystem.bind(this))

    // Don't start spawning immediately - wait for play button
    // this.startExecutionerSpawningSystem()
  }

  loadTransformation(): void {
    // Position at the specified coordinates
    const initialPosition = Vector3.create(-15.56, 0, 7.54)
    const initialRotation = Quaternion.fromEulerDegrees(0, 0, 0)

    Transform.createOrReplace(this.entity, {
      position: initialPosition,
      rotation: initialRotation,
      scale: this.initialScale // Start at 5x size
    })

    console.log('Gargoyle Fountain positioned at:', initialPosition)
  }

  // Override the engage trigger to just track engagement (no health bar)
  setupEngageTriggerBox(): void {
    this.engageAttackTrigger = entityController.addEntity()
    Transform.create(this.engageAttackTrigger, { parent: this.entity })
    MeshRenderer.setBox(this.engageAttackTrigger)
    VisibilityComponent.create(this.engageAttackTrigger, { visible: false })
    utils.triggers.addTrigger(
      this.engageAttackTrigger,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(20, 4, 20) }], // Larger trigger area
      () => {
        if (this.isDeadAnimation) return
        // Health bar will be shown in UI instead
      },
      () => {
        if (this.isDeadAnimation) return
        this.cleanup()
      }
    )
  }

  // Override to prevent gargoyle fountain from attacking
  handleAttack(): void {
    // Gargoyle fountain doesn't attack back
    return
  }

  // Override death to play destruction animation and trigger game over
  onDead(): void {
    if (this.isDeadAnimation) return

    this.isDeadAnimation = true
    console.log('Gargoyle Fountain playing destruction animation')

    // Play destruction animation
    const dieAnim = Animator.getClip(this.entity, this.dieClip)
    const idleAnim = Animator.getClip(this.entity, this.idleClip)

    // Stop idle animation and play destruction
    if (idleAnim && idleAnim.playing) {
      idleAnim.playing = false
    }
    if (dieAnim && !dieAnim.playing) {
      dieAnim.playing = true
    }

    // Trigger game over after a short delay
    utils.timers.setTimeout(() => {
      console.log('Gargoyle Fountain destroyed - GAME OVER!')
      this.triggerGameOver()
    }, 2000) // 2 seconds for destruction animation

    // Remove the gargoyle fountain after destruction animation
    utils.timers.setTimeout(() => {
      console.log('Gargoyle Fountain destroyed, removing entity')
      engine.removeEntity(this.entity)
    }, 3000) // 3 seconds for destruction animation
  }

  private triggerGameOver(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return // Set game over state
    ;(player.gameController as any).isGameOver = true

    // Display game over announcement
    if (player.gameController.uiController) {
      player.gameController.uiController.displayAnnouncement(
        'GAME OVER! The Gargoyle Fountain has been destroyed!',
        Color4.Red(),
        5000
      )
    }

    // Stop all executioner spawning
    this.stopExecutionerSpawning()

    // Hide the countdown timer
    CountdownTimerManager.getInstance().hideTimer()

    // Show game over UI
    this.showGameOverUI()
  }

  private stopExecutionerSpawning(): void {
    // Clear all timers
    if (this.spawnCycleTimer) {
      utils.timers.clearInterval(this.spawnCycleTimer)
      this.spawnCycleTimer = null
    }
    if (this.spawnWindowTimer) {
      utils.timers.clearTimeout(this.spawnWindowTimer)
      this.spawnWindowTimer = null
    }
    if (this.spawnInterval) {
      utils.timers.clearInterval(this.spawnInterval)
      this.spawnInterval = null
    }
  }

  private showGameOverUI(): void {
    // Create game over UI component
    const gameOverEntity = entityController.addEntity()

    // Add UI components for game over screen
    // This will be handled by the UI controller
    const player = Player.getInstanceOrNull()
    if (player && player.gameController.uiController) {
      ;(player.gameController.uiController as any).showGameOverScreen()
    }
  }

  // Rotation system for the gargoyle fountain
  private rotationSystem(dt: number): void {
    if (this.isDead || this.isDeadAnimation) return

    try {
      // Update rotation
      this.currentRotation += this.rotationSpeed * dt * 60 // Convert to degrees per second
      if (this.currentRotation >= 360) {
        this.currentRotation -= 360
      }

      // Apply rotation to the entity
      const currentTransform = Transform.get(this.entity)
      if (currentTransform) {
        Transform.getMutable(this.entity).rotation =
          Quaternion.fromEulerDegrees(0, this.currentRotation, 0)
      }
    } catch (error) {
      console.log('Error in gargoyle fountain rotation:', error)
    }
  }

  // Game time check system
  private gameTimeCheckSystem(dt: number): void {
    if (this.isDead || this.isDeadAnimation) return

    // Check if game time has expired
    const timerManager = CountdownTimerManager.getInstance()
    const currentTime = timerManager.getCurrentTime()

    if (
      currentTime.minutes === '00' &&
      currentTime.seconds === '00' &&
      currentTime.isVisible === false
    ) {
      // Game time has expired, trigger game over
      console.log('Game time expired, triggering game over')
      this.triggerGameOver()
    }
  }

  private startExecutionerSpawningSystem(): void {
    console.log('Starting new executioner spawning system')

    // Initialize the countdown timer manager and reset it
    CountdownTimerManager.getInstance().resetTimer()

    // Schedule the first spawn cycle after initial delay
    this.spawnCycleTimer = utils.timers.setTimeout(() => {
      this.startSpawnCycle()
    }, this.initialDelay)
  }

  private startSpawnCycle(): void {
    if (this.isDead || this.isDeadAnimation) return

    console.log('Starting executioner spawn cycle')
    this.isSpawning = true

    // Spawn executioners continuously for 45 seconds
    this.spawnInterval = utils.timers.setInterval(() => {
      if (this.isDead || this.isDeadAnimation || !this.isSpawning) return

      console.log('Spawning executioners during spawn window')
      this.spawnExecutionersAroundFountain()
    }, 5000) // Spawn every 5 seconds during the window

    // Stop spawning after 45 seconds
    this.spawnWindowTimer = utils.timers.setTimeout(() => {
      console.log('Spawn window ended, stopping executioner spawning')
      this.isSpawning = false

      if (this.spawnInterval) {
        utils.timers.clearInterval(this.spawnInterval)
        this.spawnInterval = null
      }

      // Schedule next spawn cycle in 3 minutes
      this.spawnCycleTimer = utils.timers.setTimeout(() => {
        this.startSpawnCycle()
      }, this.spawnCycleInterval)
    }, this.spawnWindowDuration)
  }

  private spawnExecutionersAroundFountain(): void {
    // Specific spawn points for executioners
    const spawnPoints = [
      Vector3.create(-25.22, 0.91, -5.76),
      Vector3.create(-16.01, 0.91, 23.13),
      Vector3.create(-4.28, 0.91, -10.4),
      Vector3.create(-18.22, 0.91, -8.54),
      Vector3.create(-38.65, 0.92, 1.87),
      Vector3.create(-33.07, 0.91, 35.57),
      Vector3.create(5.34, 1.35, 15.28)
    ]
    const numExecutioners = 3 // Spawn 3 executioners at a time

    for (let i = 0; i < numExecutioners; i++) {
      // Use specific spawn point
      const spawnPoint = spawnPoints[i]

      const executioner = new Executioner()
      const executionerTransform = Transform.get(executioner.entity)
      if (executionerTransform) {
        Transform.getMutable(executioner.entity).position = spawnPoint
        console.log(
          `Spawned executioner at: ${spawnPoint.x}, ${spawnPoint.y}, ${spawnPoint.z}`
        )
      }

      // Force executioner to check for targets immediately
      utils.timers.setTimeout(() => {
        // Trigger target detection after a short delay to ensure entity is fully initialized
        if (executioner && !executioner.isDead) {
          console.log('Forcing executioner to check for targets')
          // The executioner should detect the fountain since it's spawned very close
        }
      }, 100)

      // Ensure executioner attack systems are properly initialized
      if (executioner.attackSystem) {
        engine.addSystem(
          executioner.attackSystem.attackSystem.bind(executioner.attackSystem)
        )
      }
      if (executioner.attackSystemRanged) {
        engine.addSystem(
          executioner.attackSystemRanged.attackSystem.bind(
            executioner.attackSystemRanged
          )
        )
      }

      // Add to the realm's executioner list
      const player = Player.getInstanceOrNull()
      if (player && player.gameController.realmController.currentRealm) {
        const currentRealm = player.gameController.realmController
          .currentRealm as any
        if (currentRealm.executioners) {
          currentRealm.executioners.push(executioner)
        }
      }
    }
  }

  // Override to prevent respawning
  create(): void {
    // Gargoyle fountain doesn't respawn
    console.log('Gargoyle Fountain destroyed permanently')
  }
}
