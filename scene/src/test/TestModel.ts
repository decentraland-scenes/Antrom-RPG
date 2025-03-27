import {
  Animator,
  GltfContainer,
  InputAction,
  Transform,
  engine,
  pointerEventsSystem,
  type Entity,
  MeshRenderer,
  VisibilityComponent
} from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import { entityController } from '../realms/entityController'
import * as utils from '@dcl-sdk/utils'
import { getPlayer } from '@dcl/sdk/src/players'
import { Player } from '../player/player'

export class TestModel {
  entity: Entity
  private isPlayingImpact: boolean = false
  private isPlayingAttack: boolean = false
  private isWalking: boolean = false
  private readonly FOLLOW_DISTANCE = 5 // Distance at which it starts following
  private readonly STOP_DISTANCE = 8 // Distance at which it stops following
  private readonly MIN_DISTANCE = 2 // Minimum distance to maintain from player
  private readonly MOVE_SPEED = 1 // Speed at which it moves (reduced from 2)
  private readonly ROTATION_SPEED = 1 // Speed at which it rotates (reduced from 2)
  private triggerBox: Entity
  private isRemoved: boolean = false
  private lastDistance: number = 0 // Track last distance for hysteresis
  private readonly DISTANCE_HYSTERESIS = 0.5 // Minimum distance change required to update state

  // Battle properties
  private health: number = 100
  private maxHealth: number = 100
  private attackPower: number = 1
  private defense: number = 10
  private attackSpeed: number = 1.5 // Seconds between attacks
  private lastAttackTime: number = 0
  private isDead: boolean = false

  constructor() {
    // Create the entity
    this.entity = entityController.addEntity()

    // Set up the model
    Transform.createOrReplace(this.entity, {
      position: Vector3.create(0, 0, 0)
    })

    // Load the model
    GltfContainer.createOrReplace(this.entity, {
      src: 'assets/models/ExecutionerAxe.glb'
    })

    // Set up animations
    Animator.createOrReplace(this.entity, {
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
          clip: 'impact',
          playing: false,
          loop: false
        },
        {
          clip: 'walk',
          playing: false,
          loop: true
        }
      ]
    })

    // Create trigger box for player detection
    this.triggerBox = entityController.addEntity()
    Transform.create(this.triggerBox, { parent: this.entity })
    MeshRenderer.setBox(this.triggerBox)
    VisibilityComponent.create(this.triggerBox, { visible: false })

    // Set up trigger box
    utils.triggers.addTrigger(
      this.triggerBox,
      1,
      1,
      [
        {
          type: 'box',
          scale: Vector3.create(
            this.STOP_DISTANCE * 2,
            2,
            this.STOP_DISTANCE * 2
          )
        }
      ],
      () => {
        if (!this.isRemoved) {
          console.log('Player entered trigger box')
          this.startWalking()
        }
      },
      () => {
        if (!this.isRemoved) {
          console.log('Player left trigger box')
          this.stopWalking()
        }
      }
    )

    // Set up click handler
    this.setupClickHandler()

    // Add movement system
    engine.addSystem(this.update.bind(this))
  }

  private setupClickHandler(): void {
    console.log('Setting up click handler')
    pointerEventsSystem.onPointerDown(
      {
        entity: this.entity,
        opts: {
          button: InputAction.IA_POINTER,
          hoverText: 'Click to attack',
          maxDistance: 10
        }
      },
      () => {
        console.log('Click detected')
        if (!this.isRemoved && !this.isDead) {
          this.handleAttack()
        }
      }
    )
  }

  private handleAttack(): void {
    if (this.isPlayingAttack || this.isRemoved || this.isDead) return

    const player = Player.getInstanceOrNull()
    if (!player) return

    console.log('Handling attack')
    this.isPlayingAttack = true

    // Stop all animations first
    Animator.stopAllAnimations(this.entity)

    // Play attack animation
    Animator.playSingleAnimation(this.entity, 'attack', false)

    // Apply damage to player (fixed damage of 1)
    console.log('Dealing 1 damage to player')
    player.reduceHealth(this.attackPower)

    // Return to idle after attack animation
    utils.timers.setTimeout(() => {
      if (!this.isRemoved) {
        console.log('Returning to idle animation')
        Animator.playSingleAnimation(this.entity, 'idle', true)
        this.isPlayingAttack = false
      }
    }, 1500)
  }

  private playImpactAnimation(): void {
    if (this.isPlayingImpact || this.isRemoved || this.isDead) {
      console.log('Impact animation already playing or entity removed')
      return
    }

    console.log('Playing impact animation')
    this.isPlayingImpact = true

    // Stop all animations first
    Animator.stopAllAnimations(this.entity)

    // Get current animator state
    const animator = Animator.getOrNull(this.entity)
    if (!animator) {
      console.log('No animator found')
      this.isPlayingImpact = false
      return
    }

    // Log available states
    console.log(
      'Available animation states:',
      animator.states.map((state) => state.clip)
    )

    // Play impact animation immediately
    Animator.playSingleAnimation(this.entity, 'impact', false)

    // Return to idle after impact animation
    utils.timers.setTimeout(() => {
      if (!this.isRemoved) {
        console.log('Returning to idle animation')
        Animator.playSingleAnimation(this.entity, 'idle', true)
        this.isPlayingImpact = false
      }
    }, 1500)
  }

  private update(dt: number): void {
    if (this.isRemoved || this.isDead) return

    const player = getPlayer()
    if (!player) return

    const playerPos = player.position
    if (!playerPos) return

    // Check if entity still exists
    if (!Transform.has(this.entity)) {
      console.log('Entity no longer exists, cleaning up')
      this.remove()
      return
    }

    const entityTransform = Transform.get(this.entity)
    if (!entityTransform) return

    const entityPos = entityTransform.position
    const distance = Vector3.distance(
      Vector3.create(playerPos.x, playerPos.y, playerPos.z),
      Vector3.create(entityPos.x, entityPos.y, entityPos.z)
    )

    // Only update walking state if distance has changed significantly
    const distanceChange = Math.abs(distance - this.lastDistance)
    if (distanceChange >= this.DISTANCE_HYSTERESIS) {
      // Check if we should start/stop walking
      if (distance <= this.FOLLOW_DISTANCE && !this.isWalking) {
        this.startWalking()
      } else if (distance >= this.STOP_DISTANCE && this.isWalking) {
        this.stopWalking()
      }
      this.lastDistance = distance
    }

    // Update position and rotation if walking
    if (this.isWalking) {
      // Calculate direction to player
      const direction = Vector3.subtract(
        Vector3.create(playerPos.x, playerPos.y, playerPos.z),
        Vector3.create(entityPos.x, entityPos.y, entityPos.z)
      )
      direction.y = 0 // Keep movement on the ground plane
      Vector3.normalize(direction)

      // Calculate rotation to face player
      const targetRotation = Quaternion.lookRotation(direction)
      const currentRotation = entityTransform.rotation
      const newRotation = Quaternion.slerp(
        currentRotation,
        targetRotation,
        dt * this.ROTATION_SPEED
      )

      // Calculate new position
      const newPosition = Vector3.add(
        Vector3.create(entityPos.x, entityPos.y, entityPos.z),
        Vector3.scale(direction, dt * this.MOVE_SPEED)
      )

      // Check if we're too close to the player
      const newDistance = Vector3.distance(
        Vector3.create(playerPos.x, playerPos.y, playerPos.z),
        newPosition
      )

      // Only move if we're not too close to the player
      if (newDistance >= this.MIN_DISTANCE) {
        // Apply changes
        Transform.createOrReplace(this.entity, {
          position: newPosition,
          rotation: newRotation
        })
      } else {
        // If we're too close, stop walking
        this.stopWalking()
      }
    }

    // Handle auto-attack when in range
    if (distance <= this.FOLLOW_DISTANCE) {
      const currentTime = Date.now()
      if (currentTime - this.lastAttackTime >= this.attackSpeed * 1000) {
        this.handleAttack()
        this.lastAttackTime = currentTime
      }
    }
  }

  private startWalking(): void {
    if (this.isRemoved || this.isDead) return
    console.log('Starting to walk')
    this.isWalking = true
    Animator.stopAllAnimations(this.entity)
    Animator.playSingleAnimation(this.entity, 'walk', true)
  }

  private stopWalking(): void {
    if (this.isRemoved || this.isDead) return
    console.log('Stopping walk')
    this.isWalking = false
    Animator.stopAllAnimations(this.entity)
    Animator.playSingleAnimation(this.entity, 'idle', true)
  }

  remove(): void {
    if (this.isRemoved) return
    console.log('Removing test model')
    this.isRemoved = true
    engine.removeSystem(this.update.bind(this))
    entityController.removeEntity(this.triggerBox)
    entityController.removeEntity(this.entity)
  }
}

// Create the test model
const testModel = new TestModel()
