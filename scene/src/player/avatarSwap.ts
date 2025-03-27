import {
  engine,
  GltfContainer,
  Transform,
  VisibilityComponent,
  type Entity,
  AvatarModifierArea,
  AvatarModifierType
} from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import { Player } from './player'
import { getPlayer } from '@dcl/sdk/src/players'

export class AvatarSwap {
  private static instance: AvatarSwap
  private currentAvatar: string = 'assets/models/BaseCharacter.glb'
  private avatarEntity: Entity | null = null
  private player: Player

  private constructor(player: Player) {
    this.player = player
  }

  static getInstance(player: Player): AvatarSwap {
    if (!AvatarSwap.instance) {
      AvatarSwap.instance = new AvatarSwap(player)
    }
    return AvatarSwap.instance
  }

  async swapAvatar(modelPath: string): Promise<void> {
    // Get the player's current position and rotation
    const playerData = getPlayer()
    if (!playerData) return

    const playerEntity = engine.PlayerEntity
    if (!playerEntity) return

    const playerTransform = Transform.getOrNull(playerEntity)
    if (!playerTransform) return

    // Hide the player's default avatar
    AvatarModifierArea.createOrReplace(playerEntity, {
      area: Vector3.create(1, 1, 1),
      modifiers: [AvatarModifierType.AMT_HIDE_AVATARS],
      excludeIds: []
    })

    // Remove existing avatar if it exists
    if (this.avatarEntity) {
      engine.removeEntity(this.avatarEntity)
      this.avatarEntity = null
    }

    // Create new avatar entity
    this.avatarEntity = engine.addEntity()

    // Set up transform at player's position
    Transform.create(this.avatarEntity, {
      position: playerTransform.position,
      rotation: playerTransform.rotation,
      scale: Vector3.create(1, 1, 1)
    })

    // Add GLTF model
    GltfContainer.create(this.avatarEntity, {
      src: modelPath
    })

    // Make avatar visible
    VisibilityComponent.create(this.avatarEntity, {
      visible: true
    })

    // Update current avatar path
    this.currentAvatar = modelPath

    // Add a system to make the avatar follow the player
    engine.addSystem(() => {
      if (this.avatarEntity) {
        const playerTransform = Transform.getOrNull(playerEntity)
        if (playerTransform) {
          Transform.createOrReplace(this.avatarEntity, {
            position: playerTransform.position,
            rotation: playerTransform.rotation
          })
        }
      }
    })
  }

  getCurrentAvatar(): string {
    return this.currentAvatar
  }

  removeAvatar(): void {
    if (this.avatarEntity) {
      engine.removeEntity(this.avatarEntity)
      this.avatarEntity = null
    }

    // Show the player's default avatar again
    const playerEntity = engine.PlayerEntity
    if (playerEntity) {
      AvatarModifierArea.createOrReplace(playerEntity, {
        area: Vector3.create(1, 1, 1),
        modifiers: [],
        excludeIds: []
      })
    }
  }
}
