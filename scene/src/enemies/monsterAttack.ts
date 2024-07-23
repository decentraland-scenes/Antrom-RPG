import { Quaternion, Vector3 } from '@dcl/sdk/math'
import type MonsterOligar from './monster'
import { type Entity, Transform, engine, Animator } from '@dcl/sdk/ecs'

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
  private readonly createdAt: Date
  private readonly onAttack?: () => void
  private refreshTimer: number
  private isIdle?: boolean
  private readonly hasBeenHit: boolean = true
  private readonly stopDistance: number = 5

  constructor(monster: MonsterOligar, config: MonsterAttackConfig = {}) {
    const {
      moveSpeed = MOVE_SPEED,
      rotSpeed = ROT_SPEED,
      onAttack,
      engageDistance = 9
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
    const monsterPos = Transform.getMutable(this.monster.entity).position
    const direction = Vector3.subtract(lookAtTarget, monsterPos)
    if (this.monster.isPrey) {
      direction.x = -direction.x
      direction.z = -direction.z
    }
    Transform.getMutable(this.monster.entity).rotation =
      Quaternion.lookRotation(direction)
    const distance = Vector3.distanceSquared(monsterPos, playerPos)
    if (distance >= this.engageDistance) {
      Animator.playSingleAnimation(
        this.monster.entity,
        this.monster.walkClip,
        false
      )
      this.isIdle = false

      const dirVector = Vector3.Forward()
      const forwardVector = Vector3.rotate(
        dirVector,
        Transform.getMutable(this.monster.entity).rotation
      )
      const increment = Vector3.scale(forwardVector, dt * this.moveSpeed)
      monsterMove(this.monster.entity, increment)
    } else {
      if (!(this.isIdle ?? false)) {
        this.monster.playIdle()
        this.isIdle = true
      }
      if (this.refreshTimer <= 0) {
        this.monster.handleAttack()
        this.refreshTimer = 2
      }
    }

    // TODO: empty function
    function monsterMove(entity: Entity, forward: Vector3): void {
      // const transform = Transform.getMutable(entity)
      // const monsterMove = Vector3.lerp(transform.position, forward, 1)
    }
  }
}
