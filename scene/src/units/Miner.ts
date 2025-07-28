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

export class Miner {
  public entity: Entity
  public position: Vector3
  public lastHarvestTime: number
  public isPlaced: boolean = false
  public harvestRange: number = 5
  public harvestAmount: number = 2
  public harvestInterval: number = 4000 // 4 seconds

  // Movement system
  public isWalking: boolean = false
  public walkSpeed: number = 1.5 // units per second
  public lastWalkTime: number = 0
  public walkInterval: number = 50 // milliseconds between walk updates (smoother)

  // Rock targeting system
  public targetRock: Vector3 | null = null
  public assignedRock: Vector3 | null = null // The rock this miner was assigned to
  public isMining: boolean = false
  public spawnPosition: Vector3 // Original spawn position for roaming
  public roamRadius: number = 30 // How far they roam from spawn point
  public isRoaming: boolean = false
  public roamSpeed: number = 1.0 // Slower speed when roaming
  public lastRoamTime: number = 0
  public roamInterval: number = 3000 // Check for new rocks every 3 seconds

  constructor(position: Vector3) {
    this.entity = engine.addEntity()
    this.position = position
    this.spawnPosition = position
    this.lastHarvestTime = Date.now()

    console.log('Creating Miner at position:', position)
    this.setupModel()
  }

  private setupModel(): void {
    // Create the miner model
    console.log('Setting up Miner model with src: assets/models/miner.glb')
    Transform.create(this.entity, {
      position: this.position,
      rotation: Quaternion.fromEulerDegrees(0, Math.random() * 360, 0),
      scale: Vector3.create(1, 1, 1)
    })

    GltfContainer.create(this.entity, {
      src: 'assets/models/miner.glb'
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

    // Add audio source for mining sound
    AudioSource.create(this.entity, {
      audioClipUrl: 'assets/sounds/rock.mp3',
      loop: false,
      playing: false,
      volume: 0.3 // Low volume
    })
  }

  public place(position: Vector3, assignedRock?: Vector3): void {
    // Move miner up +0.5 on Y axis
    const elevatedPosition = Vector3.create(
      position.x,
      position.y + 0.5,
      position.z
    )
    this.position = elevatedPosition
    this.spawnPosition = elevatedPosition
    Transform.getMutable(this.entity).position = elevatedPosition
    this.isPlaced = true
    this.lastHarvestTime = Date.now()

    // Set the assigned rock if provided
    if (assignedRock) {
      this.assignedRock = assignedRock
      this.targetRock = assignedRock
      console.log('Miner assigned to rock at:', assignedRock)
    }
  }

  public update(): void {
    if (!this.isPlaced) return

    const currentTime = Date.now()

    // Use assigned rock if we have one, otherwise find a target rock
    if (!this.targetRock) {
      if (this.assignedRock) {
        this.targetRock = this.assignedRock
        console.log('Miner using assigned rock at:', this.assignedRock)
      } else {
        this.findNearestAvailableRock()
      }
    }

    // If we have a target rock, walk towards it
    if (this.targetRock && !this.isMining) {
      this.walkTowardsRock()
    }

    // If we're mining, harvest
    if (
      this.isMining &&
      currentTime - this.lastHarvestTime >= this.harvestInterval
    ) {
      this.harvest()
      this.lastHarvestTime = currentTime
    }

    // If no target rock, roam
    if (!this.targetRock && !this.isWalking) {
      this.roam()
    }

    // If we're mining, make sure we're not walking or roaming
    if (this.isMining && (this.isWalking || this.isRoaming)) {
      console.log('Miner: Stopping movement animations for mining')
      this.isWalking = false
      this.isRoaming = false
      const walkAnim = Animator.getClip(this.entity, 'walk')
      const idleAnim = Animator.getClip(this.entity, 'idle')

      if (walkAnim && walkAnim.playing) {
        walkAnim.playing = false
        console.log('Miner: Walk animation stopped')
      }
      if (idleAnim && !idleAnim.playing) {
        idleAnim.playing = true
        console.log('Miner: Idle animation started')
      }
    }

    // If we're not walking or roaming, make sure we're idle
    if (!this.isWalking && !this.isRoaming && !this.isMining) {
      const walkAnim = Animator.getClip(this.entity, 'walk')
      const idleAnim = Animator.getClip(this.entity, 'idle')

      if (walkAnim && walkAnim.playing) {
        walkAnim.playing = false
      }
      if (idleAnim && !idleAnim.playing) {
        idleAnim.playing = true
      }
    }

    // Debug: Log current state every few seconds
    if (currentTime % 3000 < 50) {
      // Every 3 seconds
      console.log(
        `Miner state: isWalking=${this.isWalking}, isMining=${
          this.isMining
        }, isRoaming=${this.isRoaming}, hasTarget=${!!this.targetRock}`
      )
    }
  }

  private harvest(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    // Add rock to player inventory
    player.inventory.incrementItem(ITEM_TYPES.ROCK, this.harvestAmount)

    // Add 1 XP to mining profession
    player.levels.addXp(LEVEL_TYPES.ROCK, 1)

    // Face the rock we're mining (if we have a target rock position)
    if (this.targetRock) {
      const direction = Vector3.subtract(this.targetRock, this.position)
      const targetRotation = Math.atan2(direction.x, direction.z)
      Transform.getMutable(this.entity).rotation = Quaternion.fromEulerDegrees(
        0,
        targetRotation * (180 / Math.PI),
        0
      )
    }

    // Play sound from the miner's position only if player is nearby
    const playerPos = Transform.get(engine.PlayerEntity).position
    const distance = Vector3.distance(playerPos, this.position)
    const soundRadius = 10 // Only hear sound within 10 units

    if (distance <= soundRadius) {
      AudioSource.playSound(this.entity, 'assets/sounds/rock.mp3')
    }

    // Resource counter will show the updated counts automatically
  }

  private triggerRockMining(rockPosition: Vector3): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    console.log('triggerRockMining called with rockPosition:', rockPosition)

    // Get current realm and find the rock entity
    const currentRealm = player.gameController.realmController.currentRealm
    if (!currentRealm || currentRealm.getId() !== 'antrom') return

    console.log('Current realm is antrom, looking for rocks...')

    // Find the rock in the realm's rocks array
    const antromRealm = currentRealm as any
    if (antromRealm.rocks) {
      console.log('Found rocks array with', antromRealm.rocks.length, 'rocks')
      for (const rock of antromRealm.rocks) {
        const rockTransform = Transform.getOrNull(rock.getEntity())
        if (rockTransform) {
          const distance = Vector3.distance(
            rockTransform.position,
            rockPosition
          )
          console.log('Rock at', rockTransform.position, 'distance:', distance)
          if (distance < 2) {
            // Within 2 units of the target rock position
            console.log(
              'Miner triggering rock mining animation for rock at:',
              rockPosition
            )
            rock.triggerMining()
            break
          }
        }
      }
    } else {
      console.log('No rocks array found in antrom realm')
    }
  }

  private findNearestAvailableRock(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    // Get current realm and its rocks
    const currentRealm = player.gameController.realmController.currentRealm
    if (!currentRealm) return

    let nearestRock: Vector3 | null = null
    let nearestDistance = Infinity

    if (currentRealm.getId() === 'antrom') {
      // Use actual rock positions from Antrom realm
      const rockPositions = [
        Vector3.create(58.79, 1.26, -50.96),
        Vector3.create(50.85, 1.26, -45.08),
        Vector3.create(49.09, 1.26, -54.18),
        Vector3.create(52.56, 1.26, -23.76),
        Vector3.create(83.12, 1.26, -28.51),
        Vector3.create(85.94, 1.26, -15.38),
        Vector3.create(74.72, 1.26, -12.42),
        Vector3.create(55.71, 1.26, -38.81),
        Vector3.create(81.29, 1.26, -54.54),
        Vector3.create(84.09, 1.26, -39.22),
        Vector3.create(90.35, 1.26, -49.22),
        Vector3.create(70.79, 1.26, -61.73),
        Vector3.create(37.59, 4.64, -32.27),
        Vector3.create(28.28, 4.34, -28.64)
      ]

      for (const rockPos of rockPositions) {
        // Check if rock is already occupied by another miner
        if (player.isRockOccupied(rockPos)) {
          continue
        }

        const distance = Vector3.distance(this.position, rockPos)
        if (distance < nearestDistance && distance <= this.roamRadius) {
          nearestDistance = distance
          nearestRock = rockPos
        }
      }
    }

    if (nearestRock) {
      this.targetRock = nearestRock
      console.log('Miner found target rock at:', nearestRock)
    }
  }

  private walkTowardsRock(): void {
    if (!this.targetRock) return

    const currentTime = Date.now()
    if (currentTime - this.lastWalkTime < this.walkInterval) return

    this.lastWalkTime = currentTime

    const distance = Vector3.distance(this.position, this.targetRock)

    if (distance <= this.harvestRange) {
      // We're close enough to mine
      console.log('Miner: Reached rock, starting to mine')
      this.isMining = true
      this.isWalking = false
      this.isRoaming = false // Make sure roaming is also stopped

      // Store the rock position before clearing it
      const rockPosition = this.targetRock

      // Face the rock before mining
      const direction = Vector3.subtract(this.targetRock, this.position)
      const targetRotation = Math.atan2(direction.x, direction.z)
      Transform.getMutable(this.entity).rotation = Quaternion.fromEulerDegrees(
        0,
        targetRotation * (180 / Math.PI),
        0
      )

      this.targetRock = null

      // Stop walking animation and return to idle
      const walkAnim = Animator.getClip(this.entity, 'walk')
      const idleAnim = Animator.getClip(this.entity, 'idle')

      if (walkAnim && walkAnim.playing) {
        walkAnim.playing = false
        console.log('Miner: Walk animation stopped at rock')
      }
      if (idleAnim && !idleAnim.playing) {
        idleAnim.playing = true
        console.log('Miner: Idle animation started at rock')
      }

      // Trigger rock mining animation
      if (rockPosition) {
        console.log(
          'Miner: About to trigger rock mining animation for rock at:',
          rockPosition
        )
        this.triggerRockMining(rockPosition)
      }
      return
    }

    // Walk towards the rock
    const direction = Vector3.subtract(this.targetRock, this.position)
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
      console.log('Miner: Starting to walk to rock')
      this.isWalking = true
      this.isRoaming = false

      // Start walking animation
      const idleAnim = Animator.getClip(this.entity, 'idle')
      const walkAnim = Animator.getClip(this.entity, 'walk')

      if (idleAnim && idleAnim.playing) {
        idleAnim.playing = false
        console.log('Miner: Stopped idle animation')
      }
      if (walkAnim && !walkAnim.playing) {
        walkAnim.playing = true
        console.log('Miner: Started walk animation')
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
