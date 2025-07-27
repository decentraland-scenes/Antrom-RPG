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

  constructor(position: Vector3) {
    this.entity = entityController.addEntity()
    this.position = position
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
          clip: 'chop',
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
    if (currentTime - this.lastHarvestTime >= this.harvestInterval) {
      this.harvest()
      this.lastHarvestTime = currentTime
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

    // Play chopping animation and sound from the lumberjack's position only if player is nearby
    Animator.playSingleAnimation(this.entity, 'chop')

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

    // Return to idle after a short delay
    utils.timers.setTimeout(() => {
      Animator.playSingleAnimation(this.entity, 'idle')
    }, 1000)
  }

  // Removed remove() method - lumberjacks cannot be removed
}
