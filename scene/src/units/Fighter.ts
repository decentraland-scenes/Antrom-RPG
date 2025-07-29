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
  public attackRange: number = 6 // Increased range to ensure combat entry
  public attackDamage: number = 35
  public attackInterval: number = 4000 // 4 seconds between attacks (faster since turn-based)
  public targetExecutioner: Entity | null = null
  public isAttacking: boolean = false
  public isWalking: boolean = false
  public walkSpeed: number = 8.0 // units per second (increased for faster movement)
  public lastWalkTime: number = 0
  public walkInterval: number = 100 // milliseconds between walk updates

  // Roaming system
  public isRoaming: boolean = false
  public roamRadius: number = 100 // Much larger search radius
  public roamSpeed: number = 1.5 // Slower speed when roaming
  public lastRoamTime: number = 0
  public roamInterval: number = 2000 // Check for new targets every 2 seconds
  public spawnPosition: Vector3 // Original spawn position for roaming

  // Systematic search system
  public searchDirection: Vector3 = Vector3.create(1, 0, 0) // Current search direction
  public searchDistance: number = 0 // How far we've walked in current direction
  public maxSearchDistance: number = 50 // Maximum distance to walk in one direction
  public searchAngle: number = 0 // Current search angle (0-360 degrees)
  public searchAngleIncrement: number = 45 // Degrees to turn between search directions

  // Fighter health and combat stats
  public health: number = 200
  public maxHealth: number = 200
  public isDead: boolean = false
  public lastDamagedTime: number = 0
  public damageCooldown: number = 1000 // 1 second between taking damage
  public lastHitByExecutioner: number = 0 // Track when last hit by executioner
  public executionerHitCooldown: number = 3000 // 3 seconds before fighter can attack after being hit

  // Combat initiative system
  public combatState: 'idle' | 'approaching' | 'engaged' | 'disengaging' =
    'idle'
  public combatTarget: Entity | null = null
  public lastCombatAction: number = 0
  public combatActionInterval: number = 1500 // 1.5 seconds between combat actions (faster since only one attacks)
  public hasInitiative: boolean = false // Whether fighter has initiative in current combat
  public hasBeenInCombat: boolean = false // Track if fighter has ever been in combat

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
    if (!this.isPlaced) {
      console.log('Fighter not placed yet')
      return
    }

    // If fighter is dead, don't do normal updates but allow cleanup
    if (this.isDead) {
      console.log('Fighter is dead')
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
      console.log(
        `Fighter target after findNearestExecutioner: ${
          this.targetExecutioner ? 'FOUND' : 'NOT FOUND'
        }`
      )
    }

    // Only roam if we've been in combat before and have no current target
    // This prevents immediate roaming when first placed
    if (
      !this.targetExecutioner &&
      this.hasBeenInCombat &&
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

    // Combat system with initiative
    if (this.targetExecutioner) {
      console.log(`Fighter has target: ${this.targetExecutioner}`)
      const distance = Vector3.distance(
        this.position,
        Transform.get(this.targetExecutioner).position
      )

      // Debug: Log distance to target
      console.log(
        `Fighter distance to executioner: ${distance.toFixed(
          2
        )} units (attack range: ${this.attackRange})`
      )

      // If we're in combat range, handle combat
      console.log(
        `Fighter distance check: ${distance} <= ${this.attackRange} = ${
          distance <= this.attackRange
        }`
      )
      // Add small buffer for floating-point precision
      if (distance <= this.attackRange + 0.01) {
        if (this.combatState === 'idle' || this.combatState === 'approaching') {
          // Starting combat - determine initiative
          this.combatState = 'engaged'
          this.combatTarget = this.targetExecutioner
          this.hasInitiative = this.determineInitiative()
          this.hasBeenInCombat = true // Mark that we've been in combat
          this.lastCombatAction = currentTime

          console.log(
            `Fighter entering combat with initiative: ${this.hasInitiative}`
          )
        }

        // Debug: Log current combat state
        console.log(
          `Fighter combat state: ${this.combatState}, hasInitiative: ${
            this.hasInitiative
          }, timeSinceLastAction: ${currentTime - this.lastCombatAction}`
        )

        // Handle combat actions based on initiative
        if (
          this.combatState === 'engaged' &&
          currentTime - this.lastCombatAction >= this.combatActionInterval &&
          currentTime - this.lastHitByExecutioner >= this.executionerHitCooldown
        ) {
          if (this.hasInitiative) {
            // Fighter has initiative - attack first
            console.log('Fighter has initiative - ATTACKING!')
            this.attackExecutioner()
            this.hasInitiative = false // Give initiative to executioner
            console.log('Fighter attacked, giving initiative to executioner')
          } else {
            // Fighter doesn't have initiative - check if executioner has attacked recently
            // If executioner hasn't attacked in a while, fighter can regain initiative
            const timeSinceExecutionerAttack =
              currentTime - this.lastHitByExecutioner
            console.log(
              `Fighter no initiative. Time since executioner attack: ${timeSinceExecutionerAttack}ms`
            )
            if (timeSinceExecutionerAttack > this.combatActionInterval * 2) {
              // Executioner hasn't attacked recently, fighter can take initiative
              this.hasInitiative = true
              console.log(
                'Fighter regaining initiative after executioner delay'
              )
            } else {
              console.log('Fighter waiting for executioner to attack first')
            }
          }
          this.lastCombatAction = currentTime
        }
      } else {
        // Out of range - approach target
        if (this.combatState !== 'approaching') {
          this.combatState = 'approaching'
          console.log('Fighter approaching target')
        }

        // Walk towards target
        if (currentTime - this.lastWalkTime >= this.walkInterval) {
          console.log('Fighter calling walkTowardsTarget()')
          this.walkTowardsTarget()
          this.lastWalkTime = currentTime
        } else {
          console.log(
            `Fighter walk cooldown: ${
              currentTime - this.lastWalkTime
            }ms remaining`
          )
        }
      }
    } else {
      // No target - roam or idle
      console.log('Fighter has NO target')
      if (this.combatState !== 'idle') {
        this.combatState = 'idle'
        this.combatTarget = null
        this.hasInitiative = false
        console.log('Fighter returning to idle state')
      }
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

      // Debug: Log each executioner's status
      for (let i = 0; i < executioners.length; i++) {
        const executioner = executioners[i]
        if (executioner) {
          const distance = Vector3.distance(
            this.position,
            Transform.get(executioner.entity).position
          )
          console.log(
            `Executioner ${i}: alive=${!executioner.isDead}, distance=${distance.toFixed(
              2
            )}, inRange=${distance <= this.roamRadius}`
          )
        } else {
          console.log(`Executioner ${i}: null/undefined`)
        }
      }

      // Count how many fighters are targeting each executioner
      const targetCounts = new Map<Entity, number>()
      const fighters = player.fighters || []

      for (const fighter of fighters) {
        if (fighter && fighter !== this && fighter.targetExecutioner) {
          const count = targetCounts.get(fighter.targetExecutioner) || 0
          targetCounts.set(fighter.targetExecutioner, count + 1)
        }
      }

      for (const executioner of executioners) {
        if (!executioner || executioner.isDead) {
          console.log('Skipping dead executioner:', executioner?.isDead)
          continue
        }

        const executionerPos = Transform.get(executioner.entity).position
        const distance = Vector3.distance(this.position, executionerPos)

        // Use the much larger search range to find executioners
        const searchRange = this.roamRadius // Use roam radius for searching (now 100 units)
        if (distance <= searchRange) {
          // Prefer executioners with fewer fighters targeting them
          const currentTargets = targetCounts.get(executioner.entity) || 0
          const currentTargetsForNearest =
            targetCounts.get(nearestExecutioner!) || 0

          // Choose this executioner if it has fewer targets, or if same targets but closer
          if (
            currentTargets < currentTargetsForNearest ||
            (currentTargets === currentTargetsForNearest &&
              distance < nearestDistance)
          ) {
            nearestDistance = distance
            nearestExecutioner = executioner.entity
            console.log(
              `Fighter found executioner at distance: ${distance.toFixed(
                2
              )} with ${currentTargets} current targets`
            )
          }
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

    // Check if we need to change direction (reached max distance or need to turn)
    if (this.searchDistance >= this.maxSearchDistance) {
      // Change to next search direction
      this.searchAngle += this.searchAngleIncrement
      if (this.searchAngle >= 360) {
        // Completed full circle, expand search area
        this.maxSearchDistance += 25
        this.searchAngle = 0
        console.log(
          `Fighter expanding search area to ${this.maxSearchDistance} units`
        )
      }

      // Calculate new direction
      const angleRad = (this.searchAngle * Math.PI) / 180
      this.searchDirection = Vector3.create(
        Math.cos(angleRad),
        0,
        Math.sin(angleRad)
      )
      this.searchDistance = 0

      console.log(
        `Fighter changing search direction to ${this.searchAngle} degrees`
      )
    }

    // Move in current search direction
    const roamDistance = this.roamSpeed * (this.roamInterval / 1000)
    const newPosition = Vector3.add(
      this.position,
      Vector3.scale(this.searchDirection, roamDistance)
    )

    // Update fighter position
    Transform.getMutable(this.entity).position = newPosition
    this.position = newPosition
    this.searchDistance += roamDistance

    // Face the direction we're searching
    Transform.getMutable(this.entity).rotation = Quaternion.lookRotation(
      this.searchDirection
    )

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
    console.log(
      `Fighter searching in direction ${
        this.searchAngle
      }°, distance: ${this.searchDistance.toFixed(1)}/${this.maxSearchDistance}`
    )
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
      const oldPosition = this.position
      Transform.getMutable(this.entity).position = newPosition
      this.position = newPosition

      // Debug: Log movement
      const movementDistance = Vector3.distance(oldPosition, newPosition)
      console.log(
        `Fighter movement: moved ${movementDistance.toFixed(
          3
        )} units toward target`
      )

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

        // Get closer to the executioner for dramatic effect, with offset to avoid stacking
        if (distance > 2) {
          const direction = Vector3.subtract(
            executionerTransform.position,
            this.position
          )
          const normalizedDirection = Vector3.normalize(direction)

          // Add a small offset based on fighter entity ID to prevent stacking
          const offsetAngle = (this.entity * 137.5) % 360 // Golden angle for good distribution
          const offsetRadius = 0.5 // Small radius around executioner
          const offsetX = Math.cos((offsetAngle * Math.PI) / 180) * offsetRadius
          const offsetZ = Math.sin((offsetAngle * Math.PI) / 180) * offsetRadius

          const targetDistance = 2 + (this.entity % 3) * 0.5 // Vary distance slightly (2-3 units)
          const moveDistance = Math.min(distance - targetDistance, 0.5)

          const newPosition = Vector3.add(
            this.position,
            Vector3.scale(normalizedDirection, moveDistance)
          )

          // Apply offset to prevent stacking
          newPosition.x += offsetX
          newPosition.z += offsetZ

          Transform.getMutable(this.entity).position = newPosition
          this.position = newPosition
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

        // Show feedback - removed to reduce spam

        // Return to idle after attack (longer timeout for dramatic effect)
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
        }, 2000) // 2 seconds for attack animation
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

      // Announcement removed to reduce spam
    } else {
      // Announcement removed to reduce spam
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
    this.lastHitByExecutioner = Date.now() // Track when hit by executioner
    console.log(
      `Fighter took ${damage} damage. Health: ${this.health}/${this.maxHealth}`
    )

    // Check if fighter died first
    if (this.health <= 0) {
      this.die()
      return // Don't play impact animation if dead
    }

    // Play impact animation with smart animation state management
    const impactAnim = Animator.getClip(this.entity, 'impact')
    const idleAnim = Animator.getClip(this.entity, 'idle')
    const walkAnim = Animator.getClip(this.entity, 'walk')
    const attackAnim = Animator.getClip(this.entity, 'attack')

    console.log('Fighter impact animation states:', {
      idlePlaying: idleAnim?.playing,
      walkPlaying: walkAnim?.playing,
      attackPlaying: attackAnim?.playing,
      impactPlaying: impactAnim?.playing
    })

    // Stop other animations and start impact - using smart animation state management
    if (idleAnim && idleAnim.playing) {
      idleAnim.playing = false
      console.log('Fighter: Stopped idle animation for impact')
    }
    if (walkAnim && walkAnim.playing) {
      walkAnim.playing = false
      console.log('Fighter: Stopped walk animation for impact')
    }
    if (attackAnim && attackAnim.playing) {
      attackAnim.playing = false
      console.log('Fighter: Stopped attack animation for impact')
    }
    if (impactAnim && !impactAnim.playing) {
      impactAnim.playing = true
      console.log('Fighter: Started impact animation')
    }

    // Return to idle after impact animation (1.5 seconds) - using smart animation state management
    utils.timers.setTimeout(() => {
      console.log('Fighter: Impact animation timeout, returning to idle')
      if (impactAnim && impactAnim.playing) {
        impactAnim.playing = false
        console.log('Fighter: Stopped impact animation')
      }
      if (idleAnim && !idleAnim.playing) {
        idleAnim.playing = true
        console.log('Fighter: Started idle animation after impact')
      }
    }, 1500)

    // Show damage feedback - removed to reduce spam
  }

  private determineInitiative(): boolean {
    const player = Player.getInstanceOrNull()
    if (!player) return false

    // Get player's luck percentage (0-100)
    const playerLuck = player.getLuckRange()
    const luckPercentage = playerLuck / 100 // Convert to 0-1 range

    // Fighter gets 60% base chance + half of player's luck
    // Example: 8% luck = 60% + 4% = 64% chance
    const fighterChance = 0.6 + luckPercentage / 2

    const randomRoll = Math.random()
    const hasInitiative = randomRoll < fighterChance

    console.log(
      `Fighter initiative roll: ${randomRoll.toFixed(
        3
      )} < ${fighterChance.toFixed(3)} = ${hasInitiative}`
    )
    console.log(
      `Player luck: ${playerLuck}%, Fighter chance: ${(
        fighterChance * 100
      ).toFixed(1)}%`
    )
    console.log(
      `Fighter initiative result: ${hasInitiative ? 'WON' : 'LOST'} initiative`
    )

    return hasInitiative
  }

  private die(): void {
    this.isDead = true
    this.targetExecutioner = null
    this.isWalking = false
    this.isAttacking = false

    // Play death animation with smart animation state management
    const dieAnim = Animator.getClip(this.entity, 'die')
    const idleAnim = Animator.getClip(this.entity, 'idle')
    const walkAnim = Animator.getClip(this.entity, 'walk')
    const attackAnim = Animator.getClip(this.entity, 'attack')
    const impactAnim = Animator.getClip(this.entity, 'impact')

    console.log('Fighter death animation states:', {
      idlePlaying: idleAnim?.playing,
      walkPlaying: walkAnim?.playing,
      attackPlaying: attackAnim?.playing,
      impactPlaying: impactAnim?.playing,
      diePlaying: dieAnim?.playing
    })

    // Stop all other animations and start death - using smart animation state management
    if (idleAnim && idleAnim.playing) {
      idleAnim.playing = false
      console.log('Fighter: Stopped idle animation for death')
    }
    if (walkAnim && walkAnim.playing) {
      walkAnim.playing = false
      console.log('Fighter: Stopped walk animation for death')
    }
    if (attackAnim && attackAnim.playing) {
      attackAnim.playing = false
      console.log('Fighter: Stopped attack animation for death')
    }
    if (impactAnim && impactAnim.playing) {
      impactAnim.playing = false
      console.log('Fighter: Stopped impact animation for death')
    }
    if (dieAnim && !dieAnim.playing) {
      dieAnim.playing = true
      console.log('Fighter: Started death animation')
    }

    // Show death feedback - removed to reduce spam

    // Remove entity after death animation
    utils.timers.setTimeout(() => {
      console.log('Removing fighter entity:', this.entity)
      this.remove()
    }, 3000) // 3 seconds for death animation
  }
}
