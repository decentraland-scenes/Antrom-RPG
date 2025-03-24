import { Quaternion, Vector3 } from '@dcl/sdk/math'
import type MonsterOligar from './monster'
import { type Entity, Transform, engine } from '@dcl/sdk/ecs'

// Configuration
const MOVE_SPEED = 1
const ROT_SPEED = 1

type MonsterAttackConfig = {
  moveSpeed?: number
  rotSpeed?: number
  engageDistance?: number
  onAttack?: () => void
}

export class MonsterAttack {
  private readonly monster: MonsterOligar
  private readonly moveSpeed: number
  private readonly rotSpeed: number
  private readonly engageDistance: number
  private readonly battleDistance: number = 5 // Increased battle distance
  private readonly createdAt: Date
  private readonly onAttack?: () => void
  private refreshTimer: number
  private isIdle?: boolean
  private readonly hasBeenHit: boolean = true
  private readonly stopDistance: number = 3

  constructor(monster: MonsterOligar, config: MonsterAttackConfig = {}) {
    const {
      moveSpeed = MOVE_SPEED,
      rotSpeed = ROT_SPEED,
      onAttack,
      engageDistance = 5
    } = config
    this.monster = monster
    this.moveSpeed = moveSpeed
    this.rotSpeed = rotSpeed
    this.engageDistance = engageDistance
    this.onAttack = onAttack
    this.createdAt = new Date()
    this.refreshTimer = 0.5
  }

  attackSystem = (dt: number): void => {
    if (this.refreshTimer > 0) {
      this.refreshTimer -= dt
    }
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

    // Always try to attack if within range, regardless of movement
    if (distance <= this.engageDistance && this.refreshTimer <= 0) {
      this.monster.handleAttack()
      this.refreshTimer = 1
    }

    // Handle movement
    if (distance >= this.engageDistance) {
      // Chase player if too far
      this.isIdle = false
      const dirVector = Vector3.Forward()
      const forwardVector = Vector3.rotate(dirVector, monsterTransform.rotation)
      const increment = Vector3.scale(forwardVector, dt * this.moveSpeed)
      monsterMove(this.monster.entity, increment)
    } else {
      // Keep moving towards player while in range
      this.isIdle = false
      const dirVector = Vector3.Forward()
      const forwardVector = Vector3.rotate(dirVector, monsterTransform.rotation)
      const increment = Vector3.scale(forwardVector, dt * this.moveSpeed)
      monsterMove(this.monster.entity, increment)
    }

    // TODO: empty function
    function monsterMove(entity: Entity, forward: Vector3): void {
      // const transform = Transform.getMutable(entity)
      // const monsterMove = Vector3.lerp(transform.position, forward, 1)
    }
  }
}
