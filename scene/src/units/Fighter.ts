import {
  Animator,
  AudioSource,
  GltfContainer,
  Transform,
  engine,
  type Entity
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3, Color4 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { Player } from '../player/player'
import { entityController } from '../realms/entityController'
import { LEVEL_TYPES } from '../player/LevelManager'
import Executioner from '../enemies/Executioner'

export class Fighter {
  public entity: Entity
  public position: Vector3
  public lastAttackTime: number
  public isPlaced: boolean = false
  public attackRange: number = 7 // Increased range for better combat effectiveness
  public attackDamage: number = 15
  public attackInterval: number = 2000 // 2 seconds between attacks
  public targetExecutioner: Entity | null = null
  public isAttacking: boolean = false
  public isWalking: boolean = false
  public walkSpeed: number = 2.0 // units per second
  public lastWalkTime: number = 0
  public walkInterval: number = 100 // milliseconds between walk updates

  // Roaming system
  public isRoaming: boolean = false
  public roamRadius: number = 20 // How far they roam from spawn point
  public roamSpeed: number = 1.5 // Slower speed when roaming
  public lastRoamTime: number = 0
  public roamInterval: number = 2000 // Check for new targets every 2 seconds
  public spawnPosition: Vector3 // Original spawn position for roaming

  // Fighter health and combat stats
  public health: number = 200
  public maxHealth: number = 200
  public isDead: boolean = false
  public lastDamagedTime: number = 0
  public damageCooldown: number = 1000 // 1 second between taking damage

  constructor(position: Vector3) {
    this.entity = entityController.addEntity()
    this.position = position
    this.spawnPosition = position
    this.lastAttackTime = Date.now()

    this.setupModel()
  }

  private setupModel(): void {
    // Create the fighter model
    Transform.create(this.entity, {
      position: this.position,
      rotation: Quaternion.fromEulerDegrees(0, Math.random() * 360, 0),
      scale: Vector3.create(1, 1, 1)
    })

    GltfContainer.create(this.entity, {
      src: 'assets/models/KnightSword.glb'
    })

    Animator.create(this.entity, {
      states: [
        {
          clip: 'idle',
          playing: true,
          loop: true
        },
        {
          clip: 'attack',
          playing: false,
          loop: false
        },
        {
          clip: 'walk',
          playing: false,
          loop: true
        },
        {
          clip: 'impact',
          playing: false,
          loop: false
        },
        {
          clip: 'die',
          playing: false,
          loop: false
        }
      ]
    })

    // Add audio source for attack sound
    AudioSource.create(this.entity, {
      audioClipUrl: 'assets/sounds/attack.mp3',
      loop: false,
      playing: false
    })
  }

  public place(position: Vector3): void {
    this.position = position
    Transform.getMutable(this.entity).position = position
    this.isPlaced = true
    this.lastAttackTime = Date.now()
  }

  public update(): void {
    if (!this.isPlaced || this.isDead) return

    const currentTime = Date.now()

    // Find nearest executioner if we don't have a target
    if (
      !this.targetExecutioner ||
      !this.isExecutionerValid(this.targetExecutioner)
    ) {
      this.findNearestExecutioner()
    }

    // If no target found, roam around
    if (
      !this.targetExecutioner &&
      currentTime - this.lastRoamTime >= this.roamInterval
    ) {
      this.roam()
      this.lastRoamTime = currentTime
    }

    // Walk towards target if we have one and are not in attack range
    if (
      this.targetExecutioner &&
      currentTime - this.lastWalkTime >= this.walkInterval
    ) {
      this.walkTowardsTarget()
      this.lastWalkTime = currentTime
    }

    // Attack if we have a target, are in range, and enough time has passed
    if (
      this.targetExecutioner &&
      currentTime - this.lastAttackTime >= this.attackInterval
    ) {
      this.attackExecutioner()
      this.lastAttackTime = currentTime
    }

    // Check if we should take damage from nearby executioners
    this.checkForDamage()
  }

  private findNearestExecutioner(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    let nearestExecutioner: Entity | null = null
    let nearestDistance = Infinity

    // Get all executioners from the current realm
    const currentRealm = player.gameController.realmController.currentRealm
    if (currentRealm && currentRealm.getId() === 'antrom') {
      const executioners = (currentRealm as any).executioners || []

      for (const executioner of executioners) {
        if (!executioner || executioner.isDead) continue

        const executionerPos = Transform.get(executioner.entity).position
        const distance = Vector3.distance(this.position, executionerPos)

        // Look for executioners within a larger range when roaming
        const searchRange = this.isRoaming ? this.roamRadius : this.attackRange
        if (distance < nearestDistance && distance <= searchRange) {
          nearestDistance = distance
          nearestExecutioner = executioner.entity
        }
      }
    }

    this.targetExecutioner = nearestExecutioner
  }

  private roam(): void {
    if (this.isWalking) {
      this.isWalking = false
      Animator.playSingleAnimation(this.entity, 'idle')
    }

    // Calculate a random point within roam radius
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * this.roamRadius
    const offsetX = Math.cos(angle) * distance
    const offsetZ = Math.sin(angle) * distance

    const roamTarget = Vector3.create(
      this.spawnPosition.x + offsetX,
      this.spawnPosition.y,
      this.spawnPosition.z + offsetZ
    )

    // Move towards roam target
    const direction = Vector3.subtract(roamTarget, this.position)
    const normalizedDirection = Vector3.normalize(direction)
    const roamDistance = this.roamSpeed * (this.roamInterval / 1000)
    const newPosition = Vector3.add(
      this.position,
      Vector3.scale(normalizedDirection, roamDistance)
    )

    // Update fighter position
    Transform.getMutable(this.entity).position = newPosition
    this.position = newPosition

    // Face the direction we're roaming
    Transform.getMutable(this.entity).rotation =
      Quaternion.lookRotation(direction)

    // Play walk animation while roaming
    if (!this.isWalking) {
      this.isWalking = true
      Animator.playSingleAnimation(this.entity, 'walk')
    }

    this.isRoaming = true
    console.log('Fighter roaming to find executioners')
  }

  private isExecutionerValid(executionerEntity: Entity): boolean {
    try {
      const transform = Transform.get(executionerEntity)
      if (!transform) return false

      // Check if executioner is still alive (you might need to adjust this based on your executioner implementation)
      return true
    } catch {
      return false
    }
  }

  private walkTowardsTarget(): void {
    if (!this.targetExecutioner) return

    try {
      const executionerTransform = Transform.get(this.targetExecutioner)
      const distance = Vector3.distance(
        this.position,
        executionerTransform.position
      )

      // If we're already in attack range, stop walking
      if (distance <= this.attackRange) {
        if (this.isWalking) {
          this.isWalking = false
          Animator.playSingleAnimation(this.entity, 'idle')
        }
        // Reset roaming state when we have a target
        this.isRoaming = false
        return
      }

      // Calculate direction to target
      const direction = Vector3.subtract(
        executionerTransform.position,
        this.position
      )
      const normalizedDirection = Vector3.normalize(direction)

      // Calculate new position (walk towards target)
      const walkDistance = this.walkSpeed * (this.walkInterval / 1000) // Convert to units per frame
      const newPosition = Vector3.add(
        this.position,
        Vector3.scale(normalizedDirection, walkDistance)
      )

      // Update fighter position
      Transform.getMutable(this.entity).position = newPosition
      this.position = newPosition

      // Face the direction we're walking
      Transform.getMutable(this.entity).rotation =
        Quaternion.lookRotation(direction)

      // Play walk animation if not already walking
      if (!this.isWalking) {
        this.isWalking = true
        Animator.playSingleAnimation(this.entity, 'walk')
      }

      // Reset roaming state when we have a target
      this.isRoaming = false

      console.log(
        `Fighter walking towards executioner. Distance: ${distance.toFixed(2)}`
      )
    } catch (error) {
      console.log('Error walking towards target:', error)
      this.targetExecutioner = null
      this.isWalking = false
    }
  }

  private attackExecutioner(): void {
    if (!this.targetExecutioner) return

    const player = Player.getInstanceOrNull()
    if (!player) return

    try {
      const executionerTransform = Transform.get(this.targetExecutioner)
      const distance = Vector3.distance(
        this.position,
        executionerTransform.position
      )

      if (distance <= this.attackRange) {
        // Stop walking if we were walking
        if (this.isWalking) {
          this.isWalking = false
        }

        // Face the executioner
        const direction = Vector3.subtract(
          executionerTransform.position,
          this.position
        )
        Transform.getMutable(this.entity).rotation =
          Quaternion.lookRotation(direction)

        // Play attack animation and sound
        Animator.playSingleAnimation(this.entity, 'attack')
        AudioSource.playSound(this.entity, 'assets/sounds/attack.mp3')

        // Deal damage to executioner
        this.dealDamageToExecutioner()

        // Show feedback
        player.gameController.uiController.displayAnnouncement(
          `Fighter attacks! -${this.attackDamage} damage`,
          Color4.Red(),
          1500
        )

        // Return to idle after attack
        utils.timers.setTimeout(() => {
          Animator.playSingleAnimation(this.entity, 'idle')
        }, 1000)
      }
    } catch (error) {
      console.log('Error attacking executioner:', error)
      this.targetExecutioner = null
    }
  }

  private dealDamageToExecutioner(): void {
    if (!this.targetExecutioner) return

    const player = Player.getInstanceOrNull()
    if (!player) return

    // Find the executioner instance and deal damage
    const currentRealm = player.gameController.realmController.currentRealm
    if (currentRealm && currentRealm.getId() === 'antrom') {
      const executioners = (currentRealm as any).executioners || []

      for (const executioner of executioners) {
        if (executioner.entity === this.targetExecutioner) {
          // Deal damage to the executioner
          executioner.reduceHealth(this.attackDamage)

          // Add XP to player for fighter kills
          if (executioner.health <= 0) {
            player.levels.addXp(LEVEL_TYPES.ENEMY, 1)
            player.gameController.uiController.displayAnnouncement(
              'Fighter defeated executioner! +1 XP',
              Color4.Green(),
              2000
            )
          }
          break
        }
      }
    }
  }

  public remove(): void {
    entityController.removeEntity(this.entity)
  }

  private checkForDamage(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    const currentTime = Date.now()
    if (currentTime - this.lastDamagedTime < this.damageCooldown) return

    // Get all executioners from the current realm
    const currentRealm = player.gameController.realmController.currentRealm
    if (currentRealm && currentRealm.getId() === 'antrom') {
      const executioners = (currentRealm as any).executioners || []

      for (const executioner of executioners) {
        if (!executioner || executioner.isDead) continue

        const executionerPos = Transform.get(executioner.entity).position
        const distance = Vector3.distance(this.position, executionerPos)

        // Take damage if executioner is very close (melee range)
        if (distance <= 2) {
          this.takeDamage(executioner.attack || 10)
          this.lastDamagedTime = currentTime
          break // Only take damage from one executioner at a time
        }
      }
    }
  }

  private takeDamage(damage: number): void {
    if (this.isDead) return

    this.health -= damage
    console.log(
      `Fighter took ${damage} damage. Health: ${this.health}/${this.maxHealth}`
    )

    // Check if fighter died first
    if (this.health <= 0) {
      this.die()
      return // Don't play impact animation if dead
    }

    // Play damage animation only if not dead
    Animator.playSingleAnimation(this.entity, 'impact')

    // Show damage feedback
    const player = Player.getInstanceOrNull()
    if (player) {
      player.gameController.uiController.displayAnnouncement(
        `Fighter took ${damage} damage!`,
        Color4.Red(),
        1500
      )
    }
  }

  private die(): void {
    this.isDead = true
    this.targetExecutioner = null
    this.isWalking = false
    this.isAttacking = false

    // Play death animation
    Animator.playSingleAnimation(this.entity, 'die')

    // Show death feedback
    const player = Player.getInstanceOrNull()
    if (player) {
      player.gameController.uiController.displayAnnouncement(
        'Fighter has fallen!',
        Color4.Red(),
        3000
      )
    }

    // Remove fighter from player's fighter list
    if (player) {
      const fighterIndex = player.fighters.indexOf(this)
      if (fighterIndex !== -1) {
        player.fighters.splice(fighterIndex, 1)
        console.log('Fighter removed from player list')
      }
    }

    // Remove entity after death animation
    utils.timers.setTimeout(() => {
      this.remove()
    }, 3000) // 3 seconds for death animation
  }
}
