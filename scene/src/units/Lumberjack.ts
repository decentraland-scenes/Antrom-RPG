import {
  Animator,
  AudioSource,
  GltfContainer,
  InputAction,
  PointerEventType,
  PointerEvents,
  Transform,
  engine,
  inputSystem,
  type Entity
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3, Color4 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { Player } from '../player/player'
import { ITEM_TYPES } from '../inventory/playerInventoryMap'
import { INVENTORY_ACTION_REASONS } from '../inventory/reducer'
import { entityController } from '../realms/entityController'
import { LEVEL_TYPES } from '../player/LevelManager'

export class Lumberjack {
  public entity: Entity
  public position: Vector3
  public lastHarvestTime: number
  public isPlaced: boolean = false
  public harvestRange: number = 5
  public harvestAmount: number = 3
  public harvestInterval: number = 3000 // 3 seconds

  // Movement system
  public isWalking: boolean = false
  public walkSpeed: number = 1.5 // units per second
  public lastWalkTime: number = 0
  public walkInterval: number = 50 // milliseconds between walk updates (smoother)

  // Tree targeting system
  public targetTree: Vector3 | null = null
  public isChopping: boolean = false
  public spawnPosition: Vector3 // Original spawn position for roaming
  public roamRadius: number = 30 // How far they roam from spawn point
  public isRoaming: boolean = false
  public roamSpeed: number = 1.0 // Slower speed when roaming
  public lastRoamTime: number = 0
  public roamInterval: number = 3000 // Check for new trees every 3 seconds

  constructor(position: Vector3) {
    this.entity = entityController.addEntity()
    this.position = position
    this.spawnPosition = position
    this.lastHarvestTime = Date.now()

    console.log('Creating Lumberjack entity:', this.entity)
    this.setupModel()
    this.setupClickHandler()
  }

  private setupModel(): void {
    // Create the lumberjack model
    console.log(
      'Setting up Lumberjack model with src: assets/models/Lumberjack.glb'
    )
    Transform.create(this.entity, {
      position: this.position,
      rotation: Quaternion.fromEulerDegrees(0, Math.random() * 360, 0),
      scale: Vector3.create(1, 1, 1)
    })

    GltfContainer.create(this.entity, {
      src: 'assets/models/Lumberjack.glb'
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

    // Add audio source for chopping sound
    AudioSource.create(this.entity, {
      audioClipUrl: 'assets/sounds/tree.mp3',
      loop: false,
      playing: false,
      volume: 0.3 // Low volume
    })
  }

  private setupClickHandler(): void {
    // Removed click handler - lumberjacks cannot be removed
  }

  public place(position: Vector3): void {
    this.position = position
    Transform.getMutable(this.entity).position = position
    this.isPlaced = true
    this.lastHarvestTime = Date.now()
  }

  public update(): void {
    if (!this.isPlaced) return

    const currentTime = Date.now()

    // Find a target tree if we don't have one
    if (!this.targetTree) {
      this.findNearestAvailableTree()
    }

    // If we have a target tree, walk towards it
    if (this.targetTree && !this.isChopping) {
      this.walkTowardsTree()
    }

    // Debug: Log current state every few seconds
    if (currentTime % 3000 < 50) {
      // Every 3 seconds
      console.log(
        `Lumberjack state: isWalking=${this.isWalking}, isChopping=${
          this.isChopping
        }, isRoaming=${this.isRoaming}, hasTarget=${!!this.targetTree}`
      )
    }

    // If we're chopping, harvest
    if (
      this.isChopping &&
      currentTime - this.lastHarvestTime >= this.harvestInterval
    ) {
      this.harvest()
      this.lastHarvestTime = currentTime
    }

    // If we're chopping, make sure we're not walking or roaming
    if (this.isChopping && (this.isWalking || this.isRoaming)) {
      console.log('Lumberjack: Stopping movement animations for chopping')
      this.isWalking = false
      this.isRoaming = false
      const walkAnim = Animator.getClip(this.entity, 'walk')
      const idleAnim = Animator.getClip(this.entity, 'idle')

      if (walkAnim && walkAnim.playing) {
        walkAnim.playing = false
        console.log('Lumberjack: Walk animation stopped')
      }
      if (idleAnim && !idleAnim.playing) {
        idleAnim.playing = true
        console.log('Lumberjack: Idle animation started')
      }
    }

    // If no target tree, roam
    if (!this.targetTree && !this.isWalking) {
      this.roam()
    }

    // If we're not walking or roaming, make sure we're idle
    if (!this.isWalking && !this.isRoaming && !this.isChopping) {
      const walkAnim = Animator.getClip(this.entity, 'walk')
      const idleAnim = Animator.getClip(this.entity, 'idle')

      if (walkAnim && walkAnim.playing) {
        walkAnim.playing = false
      }
      if (idleAnim && !idleAnim.playing) {
        idleAnim.playing = true
      }
    }
  }

  private harvest(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    // Add wood to player inventory
    player.inventory.incrementItem(
      ITEM_TYPES.TREE,
      this.harvestAmount,
      INVENTORY_ACTION_REASONS.MINED_RESOURCE
    )

    // Add 1 XP to lumberjack profession
    player.levels.addXp(LEVEL_TYPES.TREE, 1)

    // Face the tree we're chopping (if we have a target tree position)
    if (this.targetTree) {
      const direction = Vector3.subtract(this.targetTree, this.position)
      const targetRotation = Math.atan2(direction.x, direction.z)
      Transform.getMutable(this.entity).rotation = Quaternion.fromEulerDegrees(
        0,
        targetRotation * (180 / Math.PI),
        0
      )
    }

    // Play sound from the lumberjack's position only if player is nearby
    const playerPos = Transform.get(engine.PlayerEntity).position
    const distance = Vector3.distance(playerPos, this.position)
    const soundRadius = 10 // Only hear sound within 10 units

    if (distance <= soundRadius) {
      AudioSource.playSound(this.entity, 'assets/sounds/tree.mp3')
    }

    // Show feedback
    player.gameController.uiController.displayAnnouncement(
      `+${this.harvestAmount} Wood +1 XP`,
      Color4.Yellow(),
      2000
    )
  }

  private findNearestAvailableTree(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    // Get current realm and its trees
    const currentRealm = player.gameController.realmController.currentRealm
    if (!currentRealm) return

    let nearestTree: Vector3 | null = null
    let nearestDistance = Infinity

    if (currentRealm.getId() === 'antrom') {
      // Use actual tree positions from Antrom realm
      const treePositions = [
        Vector3.create(68.22, 4.23, 37.68),
        Vector3.create(73.37, 4.23, 37.98),
        Vector3.create(80.37, 4.64, 36.38),
        Vector3.create(89.51, 4.77, 35.48),
        Vector3.create(90.65, 5.23, 30.45),
        Vector3.create(90.55, 4.62, 36.34),
        Vector3.create(90.49, 5.25, 30.19),
        Vector3.create(91.11, 5.73, 22.33),
        Vector3.create(89.4, 6.24, 18.29),
        Vector3.create(83.85, 6.3, 14.67),
        Vector3.create(78.96, 6.43, 10.42),
        Vector3.create(73.12, 6.14, 9.67),
        Vector3.create(71.09, 5.95, 14.23),
        Vector3.create(66.51, 5.83, 18.53),
        Vector3.create(65.46, 5.51, 22.22),
        Vector3.create(71.52, 5.42, 21.97),
        Vector3.create(79.16, 5.0, 34.28),
        Vector3.create(68.49, 3.64, 42.92),
        Vector3.create(64.66, 4.09, 41.6),
        Vector3.create(69.33, 4.19, 37.98),
        Vector3.create(32.38, 3.31, 30.82),
        Vector3.create(39.0, 3.73, 34.3),
        Vector3.create(44.22, 4.36, 36.58),
        Vector3.create(50.6, 4.22, 39.34),
        Vector3.create(58.23, 4.3, 41.14),
        Vector3.create(52.7, 4.54, 37.22),
        Vector3.create(47.38, 4.98, 34.14),
        Vector3.create(40.76, 4.4, 31.16),
        Vector3.create(32.67, 4.07, 27.09),
        Vector3.create(26.12, 4.33, 21.41),
        Vector3.create(91.26, 6.91, 12.97),
        Vector3.create(86.65, 6.9, 10.55),
        Vector3.create(81.3, 7.06, 5.46),
        Vector3.create(87.76, 7.7, 5.06),
        Vector3.create(88.3, 5.32, 32.47),
        Vector3.create(55.47, 5.75, 28.67)
      ]

      for (const treePos of treePositions) {
        // Check if tree is already occupied by another lumberjack
        if (player.isTreeOccupied(treePos)) {
          continue
        }

        const distance = Vector3.distance(this.position, treePos)
        if (distance < nearestDistance && distance <= this.roamRadius) {
          nearestDistance = distance
          nearestTree = treePos
        }
      }
    }

    if (nearestTree) {
      this.targetTree = nearestTree
      console.log('Lumberjack found target tree at:', nearestTree)
    }
  }

  private walkTowardsTree(): void {
    if (!this.targetTree) return

    const currentTime = Date.now()
    if (currentTime - this.lastWalkTime < this.walkInterval) return

    const distance = Vector3.distance(this.position, this.targetTree)

    if (distance <= this.harvestRange) {
      // We're close enough to chop
      console.log('Lumberjack: Reached tree, starting to chop')
      this.isChopping = true
      this.isWalking = false
      this.isRoaming = false // Make sure roaming is also stopped

      // Face the tree before chopping
      const direction = Vector3.subtract(this.targetTree, this.position)
      const targetRotation = Math.atan2(direction.x, direction.z)
      Transform.getMutable(this.entity).rotation = Quaternion.fromEulerDegrees(
        0,
        targetRotation * (180 / Math.PI),
        0
      )

      this.targetTree = null

      // Stop walking animation and return to idle
      const walkAnim = Animator.getClip(this.entity, 'walk')
      const idleAnim = Animator.getClip(this.entity, 'idle')

      if (walkAnim && walkAnim.playing) {
        walkAnim.playing = false
        console.log('Lumberjack: Walk animation stopped at tree')
      }
      if (idleAnim && !idleAnim.playing) {
        idleAnim.playing = true
        console.log('Lumberjack: Idle animation started at tree')
      }
      return
    }

    // Walk towards the tree
    const direction = Vector3.subtract(this.targetTree, this.position)
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
      console.log('Lumberjack: Starting to walk to tree')
      this.isWalking = true
      this.isRoaming = false

      // Start walking animation
      const idleAnim = Animator.getClip(this.entity, 'idle')
      const walkAnim = Animator.getClip(this.entity, 'walk')

      if (idleAnim && idleAnim.playing) {
        idleAnim.playing = false
        console.log('Lumberjack: Stopped idle animation')
      }
      if (walkAnim && !walkAnim.playing) {
        walkAnim.playing = true
        console.log('Lumberjack: Started walk animation')
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

  // Removed remove() method - lumberjacks cannot be removed
}
