import {
  engine,
  Transform,
  GltfContainer,
  AudioSource,
  Animator,
  type Entity
} from '@dcl/sdk/ecs'
import { Vector3, Quaternion, Color4 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { Player } from '../player/player'
import { ITEM_TYPES } from '../inventory/playerInventoryMap'
import { LEVEL_TYPES } from '../player/LevelManager'
import Chicken from '../enemies/chicken'
import Pig from '../enemies/pig'

export class Farmer {
  public entity: Entity
  public position: Vector3
  public lastHarvestTime: number
  public isPlaced: boolean = false
  public harvestRange: number = 8
  public harvestAmount: number = 1
  public harvestInterval: number = 5000 // 5 seconds

  // Combat system (like fighters)
  public attackRange: number = 15
  public attackDamage: number = 50
  public attackInterval: number = 3000 // 3 seconds between attacks
  public lastAttackTime: number = 0

  // Movement system
  public isWalking: boolean = false
  public walkSpeed: number = 1.5 // units per second
  public lastWalkTime: number = 0
  public walkInterval: number = 50 // milliseconds between walk updates (smoother)

  // Animal targeting system
  public targetAnimal: Vector3 | null = null
  public isHunting: boolean = false
  public spawnPosition: Vector3 // Original spawn position for roaming
  public roamRadius: number = 50 // How far they roam from spawn point (increased for larger spawn area)
  public isRoaming: boolean = false
  public roamSpeed: number = 1.0 // Slower speed when roaming
  public lastRoamTime: number = 0
  public roamInterval: number = 3000 // Check for new animals every 3 seconds

  constructor(position: Vector3) {
    this.entity = engine.addEntity()
    this.position = position
    this.spawnPosition = position
    this.lastHarvestTime = Date.now()

    console.log('Creating Farmer at position:', position)
    this.setupModel()
  }

  private setupModel(): void {
    // Create the farmer model
    console.log(
      'Setting up Farmer model with src: assets/models/FarmerMale1.glb'
    )
    Transform.create(this.entity, {
      position: this.position,
      rotation: Quaternion.fromEulerDegrees(0, Math.random() * 360, 0),
      scale: Vector3.create(1, 1, 1)
    })

    GltfContainer.create(this.entity, {
      src: 'assets/models/FarmerMale1.glb'
    })

    Animator.create(this.entity, {
      states: [
        {
          clip: 'idle',
          playing: true,
          loop: true
        },
        {
          clip: 'walk',
          playing: false,
          loop: true
        }
      ]
    })

    // Add audio source for farming sound
    AudioSource.create(this.entity, {
      audioClipUrl: 'assets/sounds/buttonclick.mp3', // Placeholder - no specific farming sound yet
      loop: false,
      playing: false,
      volume: 0.3 // Low volume
    })
  }

  public place(position: Vector3): void {
    this.position = position
    this.spawnPosition = position
    Transform.getMutable(this.entity).position = position
    this.isPlaced = true
    this.lastHarvestTime = Date.now()
  }

  public update(): void {
    if (!this.isPlaced) return

    const currentTime = Date.now()

    // Find a target animal if we don't have one
    if (!this.targetAnimal) {
      this.findNearestAnimal()
    }

    // If we have a target animal, walk towards it
    if (this.targetAnimal && !this.isHunting) {
      console.log(
        'Farmer: Walking towards target animal at:',
        this.targetAnimal
      )
      this.walkTowardsAnimal()
    }

    // If we're hunting, attack animals
    if (this.isHunting) {
      this.attackAnimal()
    }

    // If no target animal, roam
    if (!this.targetAnimal && !this.isWalking) {
      this.roam()
    }

    // If we're hunting, make sure we're not walking or roaming
    if (this.isHunting && (this.isWalking || this.isRoaming)) {
      console.log('Farmer: Stopping movement animations for hunting')
      this.isWalking = false
      this.isRoaming = false
      const walkAnim = Animator.getClip(this.entity, 'walk')
      const idleAnim = Animator.getClip(this.entity, 'idle')

      if (walkAnim && walkAnim.playing) {
        walkAnim.playing = false
        console.log('Farmer: Walk animation stopped')
      }
      if (idleAnim && !idleAnim.playing) {
        idleAnim.playing = true
        console.log('Farmer: Idle animation started')
      }
    }

    // Safety check: If we're not in any movement state, ensure we're idle
    if (!this.isWalking && !this.isRoaming && !this.isHunting) {
      const walkAnim = Animator.getClip(this.entity, 'walk')
      const idleAnim = Animator.getClip(this.entity, 'idle')

      if (walkAnim && walkAnim.playing) {
        walkAnim.playing = false
        console.log('Farmer: Safety - stopped walk animation')
      }
      if (idleAnim && !idleAnim.playing) {
        idleAnim.playing = true
        console.log('Farmer: Safety - started idle animation')
      }
    }

    // Debug: Log current state every few seconds
    if (currentTime % 3000 < 50) {
      // Every 3 seconds
      console.log(
        `Farmer state: isWalking=${this.isWalking}, isHunting=${
          this.isHunting
        }, isRoaming=${this.isRoaming}, hasTarget=${!!this.targetAnimal}`
      )
    }
  }

  private attackAnimal(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    const currentTime = Date.now()
    if (currentTime - this.lastAttackTime < this.attackInterval) {
      return // Still in attack cooldown
    }

    // Find nearby animals to attack
    const currentRealm = player.gameController.realmController.currentRealm
    if (!currentRealm || currentRealm.getId() !== 'antrom') return

    // Get animals from the realm (chickens and pigs)
    const chickens = (currentRealm as any).chickens || []
    const pigs = (currentRealm as any).pigs || []
    const allAnimals = [...chickens, ...pigs]

    console.log('Animal arrays found:', {
      chickensCount: chickens.length,
      pigsCount: pigs.length,
      totalAnimals: allAnimals.length
    })

    let nearestAnimal: any = null
    let nearestDistance = Infinity

    // Find the nearest animal within attack range
    for (const animal of allAnimals) {
      console.log('Checking animal:', animal)
      console.log('Animal type:', animal.constructor?.name)
      console.log('Animal keys:', Object.keys(animal))
      console.log('Animal properties:', {
        isDead: animal?.isDead,
        health: animal?.health,
        entity: animal?.entity,
        _health: animal?._health,
        isDeadAnimation: animal?.isDeadAnimation
      })

      // Check if animal is dead using multiple possible property names
      const isDead = animal.isDead || animal.isDeadAnimation || false
      const health = animal.health || animal._health || 0

      if (!animal || isDead || health <= 0) {
        console.log(
          'Skipping dead/invalid animal - isDead:',
          isDead,
          'health:',
          health
        )
        continue
      }

      try {
        const animalTransform = Transform.get(animal.entity)
        if (!animalTransform) {
          console.log('No transform for animal')
          continue
        }

        const distance = Vector3.distance(
          this.position,
          animalTransform.position
        )
        console.log(
          'Animal distance:',
          distance,
          'Attack range:',
          this.attackRange
        )

        if (distance <= this.attackRange && distance < nearestDistance) {
          nearestAnimal = animal
          nearestDistance = distance
          console.log('Found target animal at distance:', distance)
        }
      } catch (error) {
        console.log('Error checking animal:', error)
        continue
      }
    }

    if (nearestAnimal) {
      console.log(
        `Farmer attacking animal at distance: ${nearestDistance.toFixed(2)}`
      )
      console.log('Target animal type:', {
        constructor: nearestAnimal.constructor?.name,
        isChicken: nearestAnimal instanceof Chicken,
        isPig: nearestAnimal instanceof Pig,
        health: nearestAnimal.health,
        isDead: nearestAnimal.isDead
      })

      // Face the animal
      const animalTransform = Transform.get(nearestAnimal.entity)
      const direction = Vector3.subtract(
        animalTransform.position,
        this.position
      )
      Transform.getMutable(this.entity).rotation =
        Quaternion.lookRotation(direction)

      // Play attack sound and deal damage (no attack animation available)
      AudioSource.playSound(this.entity, 'assets/sounds/attack.mp3')

      // Deal damage to the animal
      this.dealDamageToAnimal(nearestAnimal, player)

      // Show feedback
      player.gameController.uiController.displayAnnouncement(
        `Farmer attacks! -${this.attackDamage} damage`,
        Color4.Red(),
        1500
      )

      // Ensure we're in idle animation during attack
      const idleAnim = Animator.getClip(this.entity, 'idle')
      const walkAnim = Animator.getClip(this.entity, 'walk')

      if (walkAnim && walkAnim.playing) {
        walkAnim.playing = false
      }
      if (idleAnim && !idleAnim.playing) {
        idleAnim.playing = true
      }

      this.lastAttackTime = currentTime
    }
  }

  private dealDamageToAnimal(animal: any, player: Player): void {
    if (!animal) {
      console.log('No animal to damage')
      return
    }

    console.log('Animal before damage:', {
      health: animal.health,
      isDead: animal.isDead,
      entity: animal.entity
    })

    console.log(
      `Farmer dealing damage to animal. Current health: ${animal.health}, Damage: ${this.attackDamage}`
    )

    // Deal damage to the animal using the proper attack method
    try {
      // Use performAttack to properly handle death
      animal.performAttack(this.attackDamage, false) // false = not critical attack
      console.log(`Farmer dealt damage. New health: ${animal.health}`)

      // Check if animal was killed (performAttack should handle death automatically)
      if (animal.health <= 0 || animal.isDead) {
        console.log('Farmer killed animal!')
        this.handleAnimalKill(animal, player)
      } else {
        console.log('Animal still alive after damage')
      }
    } catch (error) {
      console.log('Error dealing damage to animal:', error)
      return
    }
  }

  private handleAnimalKill(animal: any, player: Player): void {
    console.log('Farmer handling animal kill')

    // Add chicken to player inventory (both chickens and pigs drop chicken meat)
    player.inventory.incrementItem(ITEM_TYPES.CHICKEN, this.harvestAmount)

    // Add XP to meat profession
    player.levels.addXp(LEVEL_TYPES.MEAT, 1)

    // Add player XP
    player.levels.addXp(LEVEL_TYPES.PLAYER, 5)

    // Show feedback
    player.gameController.uiController.displayAnnouncement(
      `+${this.harvestAmount} Chicken +1 Meat XP +5 Player XP`,
      Color4.Green(),
      2000
    )

    // Play sound from the farmer's position only if player is nearby
    const playerPos = Transform.get(engine.PlayerEntity).position
    const distance = Vector3.distance(playerPos, this.position)
    const soundRadius = 10 // Only hear sound within 10 units

    if (distance <= soundRadius) {
      AudioSource.playSound(this.entity, 'assets/sounds/buttonclick.mp3')
    }

    // Reset hunting state to find next animal
    console.log('Farmer resetting hunting state to find next animal')
    this.isHunting = false
    this.targetAnimal = null
    this.lastAttackTime = 0 // Reset attack cooldown
  }

  private findNearestAnimal(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    // Get current realm and its animals
    const currentRealm = player.gameController.realmController.currentRealm
    if (!currentRealm) return

    let nearestAnimal: Vector3 | null = null
    let nearestDistance = Infinity

    if (currentRealm.getId() === 'antrom') {
      // Get actual animals from the realm (chickens and pigs)
      const chickens = (currentRealm as any).chickens || []
      const pigs = (currentRealm as any).pigs || []
      const allAnimals = [...chickens, ...pigs]

      // Find the nearest live animal
      for (const animal of allAnimals) {
        if (!animal || animal.isDead || animal.health <= 0) continue

        try {
          const animalTransform = Transform.get(animal.entity)
          if (!animalTransform) continue

          const distance = Vector3.distance(
            this.position,
            animalTransform.position
          )
          if (distance <= this.roamRadius && distance < nearestDistance) {
            nearestAnimal = animalTransform.position
            nearestDistance = distance
          }
        } catch (error) {
          console.log('Error checking animal position:', error)
          continue
        }
      }

      // If no live animals found, use spawn area positions as fallback
      if (!nearestAnimal) {
        const animalPositions = [
          // Forest spawn area: x: -5 to 20, y: 2.76, z: 55 to 80
          Vector3.create(7, 2.76, 67),
          Vector3.create(5, 2.76, 65),
          Vector3.create(9, 2.76, 69),
          Vector3.create(3, 2.76, 63),
          Vector3.create(11, 2.76, 71),
          Vector3.create(4, 2.76, 64),
          Vector3.create(8, 2.76, 68),
          Vector3.create(6, 2.76, 66),
          Vector3.create(10, 2.76, 70),
          Vector3.create(2, 2.76, 62),
          Vector3.create(-2, 2.76, 58),
          Vector3.create(15, 2.76, 75),
          Vector3.create(18, 2.76, 78),
          Vector3.create(-3, 2.76, 57),
          Vector3.create(12, 2.76, 72),
          // New spawn area: around (-36.86, -0.09, 25.42) and (-47.29, -0.09, 12.26) with 30 radius
          Vector3.create(-42, -0.09, 19),
          Vector3.create(-40, -0.09, 22),
          Vector3.create(-45, -0.09, 15),
          Vector3.create(-38, -0.09, 25),
          Vector3.create(-44, -0.09, 18),
          Vector3.create(-41, -0.09, 20),
          Vector3.create(-43, -0.09, 16),
          Vector3.create(-39, -0.09, 23),
          Vector3.create(-46, -0.09, 14),
          Vector3.create(-37, -0.09, 26),
          // Forest2 spawn area: around (-29.49, 1.64, 75.31) with 30 radius
          Vector3.create(-35, 1.64, 70),
          Vector3.create(-30, 1.64, 75),
          Vector3.create(-25, 1.64, 80),
          Vector3.create(-40, 1.64, 65),
          Vector3.create(-20, 1.64, 85),
          Vector3.create(-38, 1.64, 68),
          Vector3.create(-32, 1.64, 72),
          Vector3.create(-28, 1.64, 78),
          Vector3.create(-42, 1.64, 62),
          Vector3.create(-22, 1.64, 82)
        ]

        for (const animalPos of animalPositions) {
          const distance = Vector3.distance(this.position, animalPos)
          if (distance < nearestDistance && distance <= this.roamRadius) {
            nearestDistance = distance
            nearestAnimal = animalPos
          }
        }
      }
    }

    if (nearestAnimal) {
      this.targetAnimal = nearestAnimal
      console.log('Farmer found target animal at:', nearestAnimal)
      console.log('Farmer will walk to this animal position')
    } else {
      console.log('Farmer found no animals in range to walk to')
    }
  }

  private walkTowardsAnimal(): void {
    if (!this.targetAnimal) return

    const currentTime = Date.now()
    if (currentTime - this.lastWalkTime < this.walkInterval) return

    this.lastWalkTime = currentTime

    const distance = Vector3.distance(this.position, this.targetAnimal)

    if (distance <= this.harvestRange) {
      // We're close enough to hunt
      console.log('Farmer: Reached animal, starting to hunt')
      this.isHunting = true
      this.isWalking = false
      this.isRoaming = false // Make sure roaming is also stopped

      // Face the animal before hunting
      const direction = Vector3.subtract(this.targetAnimal, this.position)
      const targetRotation = Math.atan2(direction.x, direction.z)
      Transform.getMutable(this.entity).rotation = Quaternion.fromEulerDegrees(
        0,
        targetRotation * (180 / Math.PI),
        0
      )

      this.targetAnimal = null

      // Stop walking animation and return to idle - using smart animation state management
      const walkAnim = Animator.getClip(this.entity, 'walk')
      const idleAnim = Animator.getClip(this.entity, 'idle')

      if (walkAnim && walkAnim.playing) {
        walkAnim.playing = false
        console.log('Farmer: Walk animation stopped at animal')
      }

      // Ensure idle animation is playing when we stop walking
      if (idleAnim && !idleAnim.playing) {
        idleAnim.playing = true
        console.log('Farmer: Idle animation started at animal')
      }

      return
    }

    // Walk towards the animal
    const direction = Vector3.subtract(this.targetAnimal, this.position)
    const normalizedDirection = Vector3.normalize(direction)
    const movement = Vector3.scale(
      normalizedDirection,
      this.walkSpeed * (this.walkInterval / 1000)
    )

    this.position = Vector3.add(this.position, movement)
    Transform.getMutable(this.entity).position = this.position

    // Face the direction we're walking
    const targetRotation = Math.atan2(
      normalizedDirection.x,
      normalizedDirection.z
    )
    Transform.getMutable(this.entity).rotation = Quaternion.fromEulerDegrees(
      0,
      targetRotation * (180 / Math.PI),
      0
    )

    // Only start walking animation if we weren't already walking
    if (!this.isWalking) {
      console.log('Farmer: Starting to walk to animal')
      this.isWalking = true
      this.isRoaming = false

      // Start walking animation
      const idleAnim = Animator.getClip(this.entity, 'idle')
      const walkAnim = Animator.getClip(this.entity, 'walk')

      if (idleAnim && idleAnim.playing) {
        idleAnim.playing = false
        console.log('Farmer: Stopped idle animation')
      }
      if (walkAnim && !walkAnim.playing) {
        walkAnim.playing = true
        console.log('Farmer: Started walk animation')
      }
    }

    this.lastWalkTime = currentTime
  }

  private roam(): void {
    const currentTime = Date.now()
    if (currentTime - this.lastRoamTime < this.roamInterval) return

    // Calculate a random point within roam radius
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * this.roamRadius
    const roamX = this.spawnPosition.x + Math.cos(angle) * distance
    const roamZ = this.spawnPosition.z + Math.sin(angle) * distance
    const roamTarget = Vector3.create(roamX, this.position.y, roamZ)

    // Walk towards the roam target
    const direction = Vector3.subtract(roamTarget, this.position)
    const normalizedDirection = Vector3.normalize(direction)
    const movement = Vector3.scale(
      normalizedDirection,
      this.roamSpeed * (this.walkInterval / 1000)
    )

    this.position = Vector3.add(this.position, movement)
    Transform.getMutable(this.entity).position = this.position

    // Face the direction we're walking
    const targetRotation = Math.atan2(
      normalizedDirection.x,
      normalizedDirection.z
    )
    Transform.getMutable(this.entity).rotation = Quaternion.fromEulerDegrees(
      0,
      targetRotation * (180 / Math.PI),
      0
    )

    // Only start walking animation if we weren't already roaming
    if (!this.isRoaming) {
      this.isRoaming = true
      this.isWalking = false

      // Start walking animation for roaming
      const idleAnim = Animator.getClip(this.entity, 'idle')
      const walkAnim = Animator.getClip(this.entity, 'walk')

      if (idleAnim && idleAnim.playing) {
        idleAnim.playing = false
      }
      if (walkAnim && !walkAnim.playing) {
        walkAnim.playing = true
      }
    }

    this.lastRoamTime = currentTime
  }
}
