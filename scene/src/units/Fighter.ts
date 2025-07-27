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
import { ITEM_TYPES } from '../inventory/playerInventoryMap'
import Executioner from '../enemies/Executioner'

export class Fighter {
  public entity: Entity
  public position: Vector3
  public lastAttackTime: number
  public isPlaced: boolean = false
  public attackRange: number = 7 // Increased range for better combat effectiveness
  public attackDamage: number = 1000
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

    console.log('Creating Fighter entity:', this.entity)
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
    if (!this.isPlaced) return

    // If fighter is dead, don't do normal updates but allow cleanup
    if (this.isDead) {
      return
    }

    const currentTime = Date.now()

    // Find nearest executioner if we don't have a target
    if (
      !this.targetExecutioner ||
      !this.isExecutionerValid(this.targetExecutioner)
    ) {
      if (this.targetExecutioner) {
        console.log('Fighter clearing invalid target')
        this.targetExecutioner = null
      }
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

    // Safety check: Ensure proper animation states
    if (!this.isDead) {
      const idleAnim = Animator.getClip(this.entity, 'idle')
      const walkAnim = Animator.getClip(this.entity, 'walk')
      const attackAnim = Animator.getClip(this.entity, 'attack')

      // If we're not walking and not attacking, ensure we're idle
      if (!this.isWalking && !this.isAttacking) {
        if (walkAnim && walkAnim.playing) {
          walkAnim.playing = false
        }
        if (attackAnim && attackAnim.playing) {
          attackAnim.playing = false
        }
        if (idleAnim && !idleAnim.playing) {
          idleAnim.playing = true
        }
      }

      // If we're walking, ensure walk animation is playing
      if (this.isWalking) {
        if (idleAnim && idleAnim.playing) {
          idleAnim.playing = false
        }
        if (attackAnim && attackAnim.playing) {
          attackAnim.playing = false
        }
        if (walkAnim && !walkAnim.playing) {
          walkAnim.playing = true
        }
      }

      // If we're attacking, ensure attack animation is playing
      if (this.isAttacking) {
        if (idleAnim && idleAnim.playing) {
          idleAnim.playing = false
        }
        if (walkAnim && walkAnim.playing) {
          walkAnim.playing = false
        }
        if (attackAnim && !attackAnim.playing) {
          attackAnim.playing = true
        }
      }
    }
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

      console.log(
        `Fighter searching for executioners. Found ${executioners.length} executioners. Roaming: ${this.isRoaming}`
      )

      for (const executioner of executioners) {
        if (!executioner || executioner.isDead) {
          console.log('Skipping dead executioner:', executioner?.isDead)
          continue
        }

        const executionerPos = Transform.get(executioner.entity).position
        const distance = Vector3.distance(this.position, executionerPos)

        // Always use a large search range to find executioners
        const searchRange = this.roamRadius // Always use roam radius for searching
        if (distance < nearestDistance && distance <= searchRange) {
          nearestDistance = distance
          nearestExecutioner = executioner.entity
          console.log(
            `Fighter found executioner at distance: ${distance.toFixed(2)}`
          )
        }
      }
    }

    this.targetExecutioner = nearestExecutioner
    if (this.targetExecutioner) {
      console.log(
        `Fighter targeting executioner at distance: ${nearestDistance.toFixed(
          2
        )}`
      )
    } else {
      console.log('Fighter found no executioners in range')
    }
  }

  private roam(): void {
    if (this.isWalking) {
      this.isWalking = false
      // Use smart animation state management
      const walkAnim = Animator.getClip(this.entity, 'walk')
      const idleAnim = Animator.getClip(this.entity, 'idle')

      if (walkAnim && walkAnim.playing) {
        walkAnim.playing = false
      }
      if (idleAnim && !idleAnim.playing) {
        idleAnim.playing = true
      }
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

    // Play walk animation while roaming - using smart animation state management
    if (!this.isWalking) {
      this.isWalking = true
      const idleAnim = Animator.getClip(this.entity, 'idle')
      const walkAnim = Animator.getClip(this.entity, 'walk')

      if (idleAnim && idleAnim.playing) {
        idleAnim.playing = false
      }
      if (walkAnim && !walkAnim.playing) {
        walkAnim.playing = true
      }
    }

    this.isRoaming = true
    console.log('Fighter roaming to find executioners')
  }

  private isExecutionerValid(executionerEntity: Entity): boolean {
    try {
      const transform = Transform.get(executionerEntity)
      if (!transform) return false

      // Check if executioner is still alive by finding it in the executioners array
      const player = Player.getInstanceOrNull()
      if (!player) return false

      const currentRealm = player.gameController.realmController.currentRealm
      if (currentRealm && currentRealm.getId() === 'antrom') {
        const executioners = (currentRealm as any).executioners || []

        for (const executioner of executioners) {
          if (executioner.entity === executionerEntity) {
            // Check if executioner is dead
            if (executioner.isDead || executioner.health <= 0) {
              console.log('Fighter found dead executioner, clearing target')
              return false
            }
            return true
          }
        }
      }

      return false
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
          // Use smart animation state management
          const walkAnim = Animator.getClip(this.entity, 'walk')
          const idleAnim = Animator.getClip(this.entity, 'idle')

          if (walkAnim && walkAnim.playing) {
            walkAnim.playing = false
          }
          if (idleAnim && !idleAnim.playing) {
            idleAnim.playing = true
          }
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

      // Play walk animation if not already walking - using smart animation state management
      if (!this.isWalking) {
        this.isWalking = true
        const idleAnim = Animator.getClip(this.entity, 'idle')
        const walkAnim = Animator.getClip(this.entity, 'walk')

        if (idleAnim && idleAnim.playing) {
          idleAnim.playing = false
        }
        if (walkAnim && !walkAnim.playing) {
          walkAnim.playing = true
        }
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

      console.log(
        `Fighter attempting attack. Distance: ${distance.toFixed(
          2
        )}, Attack Range: ${this.attackRange}`
      )

      if (distance <= this.attackRange) {
        console.log('Fighter in attack range, attacking executioner')

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

        // Play attack animation and sound - using smart animation state management
        const idleAnim = Animator.getClip(this.entity, 'idle')
        const walkAnim = Animator.getClip(this.entity, 'walk')
        const attackAnim = Animator.getClip(this.entity, 'attack')

        console.log('Fighter attack animation states:', {
          idlePlaying: idleAnim?.playing,
          walkPlaying: walkAnim?.playing,
          attackPlaying: attackAnim?.playing
        })

        // Stop other animations and start attack
        if (idleAnim && idleAnim.playing) {
          idleAnim.playing = false
          console.log('Fighter: Stopped idle animation')
        }
        if (walkAnim && walkAnim.playing) {
          walkAnim.playing = false
          console.log('Fighter: Stopped walk animation')
        }
        if (attackAnim && !attackAnim.playing) {
          attackAnim.playing = true
          console.log('Fighter: Started attack animation')
        }

        // Set attacking flag to prevent safety check from interfering
        this.isAttacking = true

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
          console.log('Fighter: Attack animation timeout, returning to idle')
          if (attackAnim && attackAnim.playing) {
            attackAnim.playing = false
            console.log('Fighter: Stopped attack animation')
          }
          if (idleAnim && !idleAnim.playing) {
            idleAnim.playing = true
            console.log('Fighter: Started idle animation')
          }
          this.isAttacking = false
        }, 1000)
      } else {
        console.log(
          `Fighter too far to attack. Distance: ${distance.toFixed(
            2
          )}, Attack Range: ${this.attackRange}`
        )
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

      console.log(
        `Fighter dealing damage. Looking for executioner entity: ${this.targetExecutioner}`
      )

      for (const executioner of executioners) {
        if (executioner.entity === this.targetExecutioner) {
          console.log(
            `Fighter found executioner to damage. Current health: ${executioner.health}, Damage: ${this.attackDamage}`
          )

          // Deal damage to the executioner
          console.log(
            'Fighter calling executioner.reduceHealth with damage:',
            this.attackDamage
          )
          executioner.reduceHealth(this.attackDamage)
          console.log('Fighter finished calling executioner.reduceHealth')

          console.log(`Fighter dealt damage. New health: ${executioner.health}`)

          // Check if executioner was killed
          if (executioner.health <= 0) {
            console.log('Fighter killed executioner!')
            this.handleExecutionerKill(player)
          }
          break
        }
      }
    }
  }

  private handleExecutionerKill(player: Player): void {
    // Add assassin XP (ENEMY level type is actually assassin)
    player.levels.addXp(LEVEL_TYPES.ENEMY, 1)

    // Add player XP
    player.levels.addXp(LEVEL_TYPES.PLAYER, 2)

    // 50% chance to drop coins
    if (Math.random() < 0.5) {
      const coinAmount = Math.floor(Math.random() * 5) + 1 // 1-5 coins
      player.inventory.incrementItem(ITEM_TYPES.COIN, coinAmount)

      player.gameController.uiController.displayAnnouncement(
        `Fighter killed executioner! +1 Assassin XP +2 Player XP +${coinAmount} Coins`,
        Color4.Green(),
        3000
      )
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Fighter killed executioner! +1 Assassin XP +2 Player XP',
        Color4.Green(),
        3000
      )
    }
  }

  public remove(): void {
    console.log('Fighter.remove() called for entity:', this.entity)
    entityController.removeEntity(this.entity)
    console.log('Fighter entity removed successfully')
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

    // Remove entity after death animation
    utils.timers.setTimeout(() => {
      console.log('Removing fighter entity:', this.entity)
      this.remove()
    }, 3000) // 3 seconds for death animation
  }
}
