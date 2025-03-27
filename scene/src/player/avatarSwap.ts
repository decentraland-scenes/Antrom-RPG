import {
  engine,
  GltfContainer,
  Transform,
  VisibilityComponent,
  type Entity,
  AvatarModifierArea,
  AvatarModifierType,
  Animator,
  type PBAnimator,
  type DeepReadonly
} from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import { Player } from './player'
import { getPlayer } from '@dcl/sdk/src/players'

// Rate limiting for error reporting
let lastErrorTime = 0
const ERROR_REPORT_INTERVAL = 5000 // 5 seconds between error reports

function reportError(error: Error): void {
  const now = Date.now()
  if (now - lastErrorTime >= ERROR_REPORT_INTERVAL) {
    console.error(error)
    lastErrorTime = now
  }
}

function needSetPlaying(
  animator: DeepReadonly<PBAnimator>,
  clip: string
): boolean {
  try {
    for (const state of animator.states) {
      if (state.playing !== (state.clip === clip)) {
        return true
      }
    }
    return false
  } catch (error) {
    reportError(error as Error)
    return false
  }
}

export class AvatarSwap {
  private static instance: AvatarSwap
  private currentAvatar: string = 'assets/models/BaseCharacter.glb'
  private avatarEntity: Entity | null = null
  private player: Player
  private isWalking: boolean = false
  private isAttacking: boolean = false
  private isImpact: boolean = false
  private lastPosition: Vector3 = Vector3.Zero()
  private readonly MOVEMENT_THRESHOLD = 0.1
  private animationSystem: Entity | null = null

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
    try {
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

      // Add animator component
      Animator.create(this.avatarEntity)

      // Add animation states
      Animator.createOrReplace(this.avatarEntity, {
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
          },
          {
            clip: 'attack',
            playing: false,
            loop: false
          },
          {
            clip: 'impact',
            playing: false,
            loop: false
          }
        ]
      })

      // Update current avatar path
      this.currentAvatar = modelPath

      // Remove existing animation system if it exists
      if (this.animationSystem) {
        engine.removeEntity(this.animationSystem)
      }

      // Create new animation system
      this.animationSystem = engine.addEntity()
      engine.addSystem((dt: number) => {
        if (this.avatarEntity) {
          const playerTransform = Transform.getOrNull(playerEntity)
          if (playerTransform) {
            try {
              // Update position and rotation
              Transform.createOrReplace(this.avatarEntity, {
                position: playerTransform.position,
                rotation: playerTransform.rotation
              })

              // Handle walking animation
              const isMoving =
                Vector3.length(
                  Vector3.subtract(playerTransform.position, this.lastPosition)
                ) > this.MOVEMENT_THRESHOLD

              if (isMoving !== this.isWalking) {
                this.isWalking = isMoving
                if (isMoving) {
                  if (needSetPlaying(Animator.get(this.avatarEntity), 'walk')) {
                    Animator.playSingleAnimation(this.avatarEntity, 'walk')
                  }
                } else {
                  if (needSetPlaying(Animator.get(this.avatarEntity), 'idle')) {
                    Animator.playSingleAnimation(this.avatarEntity, 'idle')
                  }
                }
              }

              // Store last position for movement detection
              this.lastPosition = playerTransform.position
            } catch (error) {
              reportError(error as Error)
            }
          }
        }
      })
    } catch (error) {
      reportError(error as Error)
    }
  }

  playAttackAnimation(): void {
    if (this.avatarEntity) {
      try {
        this.isAttacking = true
        // Stop all animations first
        Animator.stopAllAnimations(this.avatarEntity)
        // Play attack animation
        Animator.playSingleAnimation(this.avatarEntity, 'attack')

        // Reset to idle after attack animation
        engine.addSystem((dt: number) => {
          if (this.avatarEntity && !this.isWalking) {
            Animator.playSingleAnimation(this.avatarEntity, 'idle')
          }
          this.isAttacking = false
        })
      } catch (error) {
        reportError(error as Error)
      }
    }
  }

  playImpactAnimation(): void {
    if (this.avatarEntity) {
      try {
        this.isImpact = true
        // Stop all animations first
        Animator.stopAllAnimations(this.avatarEntity)
        // Play impact animation
        Animator.playSingleAnimation(this.avatarEntity, 'impact')

        // Reset to idle after impact animation
        engine.addSystem((dt: number) => {
          if (this.avatarEntity && !this.isWalking) {
            Animator.playSingleAnimation(this.avatarEntity, 'idle')
          }
          this.isImpact = false
        })
      } catch (error) {
        reportError(error as Error)
      }
    }
  }

  getCurrentAvatar(): string {
    return this.currentAvatar
  }

  removeAvatar(): void {
    try {
      if (this.avatarEntity) {
        engine.removeEntity(this.avatarEntity)
        this.avatarEntity = null
      }

      if (this.animationSystem) {
        engine.removeEntity(this.animationSystem)
        this.animationSystem = null
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
    } catch (error) {
      reportError(error as Error)
    }
  }
}
