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
import WaveEnemy from './WaveEnemy'
import * as utils from '@dcl-sdk/utils'

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

  // Wave system properties
  private currentWave: number = 1
  private enemiesPerWave: number = 3
  private waveInterval: number = 10000 // 10 seconds between waves
  private modelList: string[] = [
    'assets/models/SkeletonSword.glb',
    'assets/models/SkeletonwBow.glb',
    'assets/models/SkeletonSwordEnemy.glb',
    'assets/models/SkeletonPvP.glb',
    'assets/models/Sceleton.glb',
    'assets/models/RockMonster.glb',
    'assets/models/TreeMonster.glb',
    'assets/models/Turkey.glb',
    'assets/models/zombie.glb',
    'assets/models/UndeadKing.glb',
    'assets/models/Ghost.glb',
    'assets/models/KnightSword.glb',
    'assets/models/Chicken.glb',
    'assets/models/Pig.glb'
  ]

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

    // Start fountain attack system
    this.startFountainAttackSystem()
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

    // Show game over UI
    this.showGameOverUI()
  }

  private stopExecutionerSpawning(): void {
    // Clear any existing intervals
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

  private startFountainAttackSystem(): void {
    console.log('Starting fountain attack system - Wave 1')

    // Spawn first wave immediately
    console.log('Spawning first wave immediately')
    this.spawnWaveEnemies()

    // Spawn wave enemies around the fountain every 10 seconds
    this.spawnInterval = utils.timers.setInterval(() => {
      if (this.isDead || this.isDeadAnimation) return

      console.log(`Spawning wave ${this.currentWave} enemies around fountain`)
      this.spawnWaveEnemies()
    }, this.waveInterval)
  }

  private spawnWaveEnemies(): void {
    // Specific spawn points for enemies - moved closer to fountain
    const spawnPoints = [
      Vector3.create(-20.22, 0.91, 2.24), // Closer to fountain
      Vector3.create(-10.01, 0.91, 15.13), // Closer to fountain
      Vector3.create(-8.28, 0.91, 0.6) // Closer to fountain
    ]

    // Calculate wave difficulty
    const enemiesThisWave =
      this.enemiesPerWave + Math.floor(this.currentWave / 3) // +1 enemy every 3 waves
    const modelIndex =
      Math.floor((this.currentWave - 1) / 5) % this.modelList.length // Change model every 5 waves
    const modelPath = this.modelList[modelIndex]

    console.log(
      `Wave ${this.currentWave}: Spawning ${enemiesThisWave} enemies with model: ${modelPath} (index: ${modelIndex}/${this.modelList.length})`
    )
    console.log('Available models:', this.modelList)

    for (let i = 0; i < enemiesThisWave; i++) {
      // Use specific spawn point (cycle through them)
      const spawnPoint = spawnPoints[i % spawnPoints.length]

      const waveEnemy = new WaveEnemy(modelPath, this.currentWave)

      // Set position first before initializing
      Transform.getMutable(waveEnemy.entity).position = spawnPoint
      console.log(
        `Spawned wave enemy at: ${spawnPoint.x}, ${spawnPoint.y}, ${spawnPoint.z}`
      )

      // Initialize the enemy properly after setting position
      waveEnemy.initMonster()

      // Initialize roaming system for the enemy
      waveEnemy.initRoamingSystem()

      // Force enemy to check for targets immediately
      utils.timers.setTimeout(() => {
        if (waveEnemy && !waveEnemy.isDead) {
          console.log('Forcing wave enemy to check for targets')
        }
      }, 100)

      // Add to the realm's enemies list
      const player = Player.getInstanceOrNull()
      if (player && player.gameController.realmController.currentRealm) {
        const currentRealm = player.gameController.realmController
          .currentRealm as any
        if (currentRealm.waveEnemies) {
          currentRealm.waveEnemies.push(waveEnemy)
        } else {
          currentRealm.waveEnemies = [waveEnemy]
        }
      }
    }

    // Increment wave counter
    this.currentWave++

    // Increase difficulty over time
    if (this.currentWave % 5 === 0) {
      // Every 5 waves, increase spawn rate slightly
      this.waveInterval = Math.max(5000, this.waveInterval - 500) // Minimum 5 seconds
      console.log(
        `Wave ${this.currentWave}: Increased difficulty, new interval: ${this.waveInterval}ms`
      )
    }
  }

  // Override to prevent respawning
  create(): void {
    // Gargoyle fountain doesn't respawn
    console.log('Gargoyle Fountain destroyed permanently')
  }
}
