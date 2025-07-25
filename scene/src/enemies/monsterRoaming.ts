import { Vector3, Quaternion } from '@dcl/sdk/math'
import { Transform, engine, Animator } from '@dcl/sdk/ecs'
import { type Entity } from '@dcl/sdk/ecs'
import { getRandomInt } from '../utils/getRandomInt'

export interface RoamingConfig {
  roamRadius: number
  roamSpeed: number
  idleTime: number
  maxRoamDistance: number
  roamPattern?: 'random' | 'patrol' | 'circle'
  patrolPoints?: Vector3[]
}

// Helper functions for creating patrol routes
export function createPatrolRoute(
  center: Vector3,
  radius: number,
  points: number
): Vector3[] {
  const patrolPoints: Vector3[] = []
  const angleStep = (2 * Math.PI) / points

  for (let i = 0; i < points; i++) {
    const angle = i * angleStep
    const x = center.x + Math.cos(angle) * radius
    const z = center.z + Math.sin(angle) * radius
    patrolPoints.push(Vector3.create(x, center.y, z))
  }

  return patrolPoints
}

export function createSquarePatrol(center: Vector3, size: number): Vector3[] {
  const halfSize = size / 2
  return [
    Vector3.create(center.x - halfSize, center.y, center.z - halfSize),
    Vector3.create(center.x + halfSize, center.y, center.z - halfSize),
    Vector3.create(center.x + halfSize, center.y, center.z + halfSize),
    Vector3.create(center.x - halfSize, center.y, center.z + halfSize)
  ]
}

// Predefined roaming configurations for different monster types
export const ROAMING_CONFIGS = {
  // Aggressive monsters that chase players
  aggressive: {
    roamRadius: 15,
    roamSpeed: 1.5,
    idleTime: 2,
    maxRoamDistance: 20,
    roamPattern: 'random' as const
  },

  // Defensive monsters that patrol in circles
  defensive: {
    roamRadius: 8,
    roamSpeed: 0.8,
    idleTime: 4,
    maxRoamDistance: 12,
    roamPattern: 'circle' as const
  },

  // Guard monsters that follow patrol routes
  guard: {
    roamRadius: 10,
    roamSpeed: 1,
    idleTime: 3,
    maxRoamDistance: 15,
    roamPattern: 'patrol' as const
  },

  // Lazy monsters that move slowly and idle longer
  lazy: {
    roamRadius: 5,
    roamSpeed: 0.5,
    idleTime: 6,
    maxRoamDistance: 8,
    roamPattern: 'random' as const
  }
}

export class MonsterRoaming {
  private entity: Entity
  private initialPosition: Vector3
  private currentTarget: Vector3 | null = null
  private roamTimer: number = 0
  private idleTimer: number = 0
  private isIdle: boolean = false
  private config: RoamingConfig
  private walkClip: string
  private idleClip: string
  private currentPatrolIndex: number = 0
  private circleAngle: number = 0
  private currentAnimation: string = ''

  constructor(
    entity: Entity,
    initialPosition: Vector3,
    config: RoamingConfig,
    walkClip: string = 'walk',
    idleClip: string = 'idle'
  ) {
    this.entity = entity
    this.initialPosition = initialPosition
    this.config = config
    this.walkClip = walkClip
    this.idleClip = idleClip
  }

  update(dt: number): void {
    if (this.isIdle) {
      this.handleIdle(dt)
    } else {
      this.handleRoaming(dt)
    }
  }

  private handleIdle(dt: number): void {
    this.idleTimer += dt

    // Switch to roaming after idle time
    if (this.idleTimer >= this.config.idleTime) {
      this.startRoaming()
    }
  }

  private handleRoaming(dt: number): void {
    const transform = Transform.getMutableOrNull(this.entity)
    if (!transform) return

    // If we have a target, move towards it
    if (this.currentTarget) {
      const distance = Vector3.distance(transform.position, this.currentTarget)

      if (distance < 1) {
        // Reached target, switch to idle
        this.startIdle()
        return
      }

      // Move towards target
      const direction = Vector3.subtract(this.currentTarget, transform.position)
      const normalizedDirection = Vector3.normalize(direction)

      // Update rotation to face movement direction
      const rotation = Quaternion.lookRotation(normalizedDirection)
      const angles = Quaternion.toEulerAngles(rotation)
      angles.z = 0
      angles.x = 0
      transform.rotation = Quaternion.fromEulerDegrees(
        angles.x,
        angles.y,
        angles.z
      )

      // Move forward
      const moveDistance = this.config.roamSpeed * dt
      const movement = Vector3.scale(normalizedDirection, moveDistance)
      transform.position = Vector3.add(transform.position, movement)

      // Play walk animation only if not already playing
      if (this.currentAnimation !== this.walkClip) {
        // console.log('Roaming: Switching to walk animation:', this.walkClip)
        const animator = Animator.getOrNull(this.entity)
        if (animator) {
          // Find the walk state and play it
          const walkState = animator.states.find(
            (state) => state.clip === this.walkClip
          )
          if (walkState) {
            // console.log('Found walk state, playing animation')
            Animator.playSingleAnimation(this.entity, this.walkClip, true)
            this.currentAnimation = this.walkClip
          } else {
            // console.log(
            //   'Walk state not found, available states:',
            //   animator.states.map((s) => s.clip)
            // )
            // Fallback: try to play any available animation
            if (animator.states.length > 0) {
              const fallbackClip = animator.states[0].clip
              // console.log('Using fallback animation:', fallbackClip)
              Animator.playSingleAnimation(this.entity, fallbackClip, true)
              this.currentAnimation = fallbackClip
            }
          }
        } else {
          // console.log('No animator found on entity')
        }
      }
    } else {
      // No target, generate new one
      this.generateNewTarget()
    }
  }

  private generateNewTarget(): void {
    const transform = Transform.getMutableOrNull(this.entity)
    if (!transform) return

    const pattern = this.config.roamPattern || 'random'

    switch (pattern) {
      case 'patrol':
        this.generatePatrolTarget()
        break
      case 'circle':
        this.generateCircleTarget()
        break
      case 'random':
      default:
        this.generateRandomTarget()
        break
    }
  }

  private generateRandomTarget(): void {
    // Generate random position within roam radius
    const angle = Math.random() * 2 * Math.PI
    const distance = Math.random() * this.config.roamRadius

    const offsetX = Math.cos(angle) * distance
    const offsetZ = Math.sin(angle) * distance

    const targetX = this.initialPosition.x + offsetX
    const targetZ = this.initialPosition.z + offsetZ
    const targetY = this.initialPosition.y // Keep same Y level

    this.currentTarget = Vector3.create(targetX, targetY, targetZ)

    // Ensure target is within max roam distance
    this.clampTargetToMaxDistance()
  }

  private generatePatrolTarget(): void {
    if (!this.config.patrolPoints || this.config.patrolPoints.length === 0) {
      // Fall back to random if no patrol points
      this.generateRandomTarget()
      return
    }

    // Use patrol points in sequence
    this.currentTarget = this.config.patrolPoints[this.currentPatrolIndex]
    this.currentPatrolIndex =
      (this.currentPatrolIndex + 1) % this.config.patrolPoints.length
  }

  private generateCircleTarget(): void {
    const radius = this.config.roamRadius
    const angle = this.circleAngle

    const offsetX = Math.cos(angle) * radius
    const offsetZ = Math.sin(angle) * radius

    const targetX = this.initialPosition.x + offsetX
    const targetZ = this.initialPosition.z + offsetZ
    const targetY = this.initialPosition.y

    this.currentTarget = Vector3.create(targetX, targetY, targetZ)

    // Increment angle for next circle position
    this.circleAngle += Math.PI / 4 // Move 45 degrees each time
    if (this.circleAngle >= 2 * Math.PI) {
      this.circleAngle = 0
    }
  }

  private clampTargetToMaxDistance(): void {
    if (!this.currentTarget) return

    const distanceFromSpawn = Vector3.distance(
      this.initialPosition,
      this.currentTarget
    )
    if (distanceFromSpawn > this.config.maxRoamDistance) {
      // Scale back to max distance
      const scale = this.config.maxRoamDistance / distanceFromSpawn
      const direction = Vector3.subtract(
        this.currentTarget,
        this.initialPosition
      )
      const scaledDirection = Vector3.scale(direction, scale)
      this.currentTarget = Vector3.add(this.initialPosition, scaledDirection)
    }
  }

  private startIdle(): void {
    this.isIdle = true
    this.idleTimer = 0
    this.currentTarget = null

    // Play idle animation only if not already playing
    if (this.currentAnimation !== this.idleClip) {
      // console.log('Roaming: Switching to idle animation:', this.idleClip)
      const animator = Animator.getOrNull(this.entity)
      if (animator) {
        // Find the idle state and play it
        const idleState = animator.states.find(
          (state) => state.clip === this.idleClip
        )
        if (idleState) {
          // console.log('Found idle state, playing animation')
          Animator.playSingleAnimation(this.entity, this.idleClip, true)
          this.currentAnimation = this.idleClip
        } else {
          // console.log(
          //   'Idle state not found, available states:',
          //   animator.states.map((s) => s.clip)
          // )
        }
      } else {
        // console.log('No animator found on entity')
      }
    }
  }

  private startRoaming(): void {
    this.isIdle = false
    this.idleTimer = 0
    this.generateNewTarget()
  }

  // Call this when monster engages with player
  onEngage(): void {
    this.isIdle = false
    this.idleTimer = 0
    this.currentTarget = null
  }

  // Call this when monster disengages from player
  onDisengage(): void {
    this.startIdle()
  }

  // Get current roaming state
  isRoaming(): boolean {
    return !this.isIdle && this.currentTarget !== null
  }

  // Get current idle state
  isInIdle(): boolean {
    return this.isIdle
  }
}

// Example function to create a guard monster with patrol route
export function createGuardMonsterConfig(
  spawnPosition: Vector3,
  patrolRadius: number = 10,
  patrolPoints: number = 4
): RoamingConfig {
  const patrolRoute = createPatrolRoute(
    spawnPosition,
    patrolRadius,
    patrolPoints
  )

  return {
    ...ROAMING_CONFIGS.guard,
    patrolPoints: patrolRoute
  }
}

// Example function to create a lazy monster that stays close to spawn
export function createLazyMonsterConfig(spawnPosition: Vector3): RoamingConfig {
  return {
    ...ROAMING_CONFIGS.lazy,
    roamRadius: 5,
    maxRoamDistance: 8
  }
}

// Example function to create an aggressive monster that roams widely
export function createAggressiveMonsterConfig(
  spawnPosition: Vector3
): RoamingConfig {
  return {
    ...ROAMING_CONFIGS.aggressive,
    roamRadius: 20,
    maxRoamDistance: 25
  }
}
