import { MonsterMobAuto } from './monsterMobAuto'
import { MonsterMob } from './MonsterMob'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import type MonsterOligar from './monster'
import { type Entity, Transform, engine } from '@dcl/sdk/ecs'
import { Player } from '../player/player'
import { Animator } from '@dcl/sdk/ecs'
import { MonsterRoaming, type RoamingConfig } from './monsterRoaming'

// Configuration
const MOVE_SPEED = 1
const ROT_SPEED = 1

interface MonsterAttackConfig {
  moveSpeed: number
  engageDistance: number
  roaming?: RoamingConfig
}

export class MonsterAttack {
  private monster: MonsterMobAuto | MonsterMob
  private moveSpeed: number
  private engageDistance: number
  private refreshTimer: number = 0
  private readonly createdAt: Date
  private readonly hasBeenHit: boolean = true
  private readonly stopDistance: number = 5
  private roaming: MonsterRoaming | null = null
  private isEngaged: boolean = false

  constructor(
    monster: MonsterMobAuto | MonsterMob,
    config: MonsterAttackConfig
  ) {
    this.monster = monster
    this.moveSpeed = config.moveSpeed
    this.engageDistance = config.engageDistance
    this.createdAt = new Date()

    // Initialize roaming system if config provided
    if (config.roaming) {
      const initialPosition = Transform.get(monster.entity).position
      this.roaming = new MonsterRoaming(
        monster.entity,
        initialPosition,
        config.roaming,
        monster.walkClip || 'walk',
        monster.idleClip || 'idle'
      )
    }
  }

  attackSystem = (dt: number): void => {
    if (this.refreshTimer > 0) {
      this.refreshTimer -= dt
      return // Add early return to prevent attack attempts during cooldown
    }

    const player = Player.getInstanceOrNull()
    if (player === null) return

    const playerTransform = Transform.getMutable(engine.PlayerEntity)
    const monsterTransform = Transform.getMutableOrNull(this.monster.entity)
    if (!monsterTransform) return

    const distanceToPlayer = Vector3.distance(
      monsterTransform.position,
      playerTransform.position
    )

    // If monster is dead or in death animation, stop attacking
    if (this.monster.isDeadAnimation) {
      engine.removeSystem(this.attackSystem.bind(this))
      return
    }

    // Check if monster should engage with player
    const shouldEngage = distanceToPlayer <= this.engageDistance

    // Handle engagement state changes
    if (shouldEngage && !this.isEngaged) {
      this.isEngaged = true
      this.roaming?.onEngage()
    } else if (!shouldEngage && this.isEngaged) {
      this.isEngaged = false
      this.roaming?.onDisengage()
    }

    // Always try to attack if within range
    if (shouldEngage) {
      console.log('Monster attempting attack at distance:', distanceToPlayer)
      // Handle the actual attack
      this.monster.handleAttack()
      // Set a longer cooldown to prevent rapid attacks
      this.refreshTimer = 2 // Increased from 1 to 2 seconds
    }

    // Handle movement based on engagement state
    if (this.isEngaged) {
      // Chase player if engaged but too far
      if (distanceToPlayer >= this.engageDistance) {
        this.monsterMove(dt)
      }
    } else {
      // Use roaming behavior when not engaged
      this.roaming?.update(dt)
    }
  }

  private monsterMove(dt: number): void {
    const playerPos = Transform.get(engine.PlayerEntity).position
    const lookAtTarget = Vector3.create(
      playerPos.x,
      playerPos.y - 1.5,
      playerPos.z
    )

    const monsterTransform = Transform.getMutableOrNull(this.monster.entity)
    if (monsterTransform == null || this.monster.isDeadAnimation) {
      return
    }

    const monsterPos = monsterTransform.position
    const direction = Vector3.subtract(lookAtTarget, monsterPos)
    if (this.monster.isPrey) {
      direction.x = -direction.x
      direction.z = -direction.z
    }

    const rotation = Quaternion.lookRotation(direction)
    const angles = Quaternion.toEulerAngles(rotation)
    angles.z = 0
    angles.x = 0
    monsterTransform.rotation = Quaternion.fromEulerDegrees(
      angles.x,
      angles.y,
      angles.z
    )

    const distance = Vector3.distanceSquared(monsterPos, playerPos)

    // Handle movement
    if (distance >= this.engageDistance) {
      // Chase player if too far
      const dirVector = Vector3.Forward()
      const forwardVector = Vector3.rotate(dirVector, monsterTransform.rotation)
      const increment = Vector3.scale(forwardVector, dt * this.moveSpeed)
      monsterMove(this.monster.entity, increment)
    } else {
      // Keep moving towards player while in range
      const dirVector = Vector3.Forward()
      const forwardVector = Vector3.rotate(dirVector, monsterTransform.rotation)
      const increment = Vector3.scale(forwardVector, dt * this.moveSpeed)
      monsterMove(this.monster.entity, increment)
    }

    // TODO: empty function
    function monsterMove(entity: Entity, forward: Vector3): void {
      const transform = Transform.getMutable(entity)
      transform.position = Vector3.add(transform.position, forward)
    }
  }
}
