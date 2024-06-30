import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { type MonsterOligar } from './monster'
import {
  Animator,
  type Entity,
  GltfContainer,
  Transform,
  engine
} from '@dcl/sdk/ecs'
import { Player, player } from '../player/player'
import { getRandomInt } from '../utils/getRandomInt'

let arrow: Entity | null = null
let arrowStartPosition: Vector3

export function shootArrow(): void {
  if (arrow == null) {
    arrow = engine.addEntity()
    Transform.create(arrow, {})
    GltfContainer.create(arrow, { src: 'assets/models/GreenOrb.glb' })
  }

  const playerPosition = Transform.get(engine.PlayerEntity).position
  const playerRotation = Transform.get(engine.PlayerEntity).rotation
  Transform.getMutable(arrow).position = playerPosition
  Transform.getMutable(arrow).rotation = playerRotation

  // Calculate the forward direction and set the initial position
  const forward = Vector3.rotate(Vector3.Forward(), playerRotation)
  arrowStartPosition = Vector3.add(Vector3.scale(forward, 0.5), playerPosition)
}
// Configuration constants
const MOVE_SPEED = 1
const ROT_SPEED = 1
const MAX_DISTANCE = 20

type MonsterAttackConfig = {
  moveSpeed?: number
  rotSpeed?: number
  engageDistance?: number
  onAttack?: () => void
}

export class MonsterAttackRanged {
  private readonly monster: MonsterOligar
  private readonly moveSpeed: number
  private readonly rotSpeed: number
  private readonly engageDistance: number
  private readonly createdAt: Date
  private readonly onAttack?: () => void
  private readonly refreshTimer: number
  private readonly isIdle?: boolean
  private hasBeenHit: boolean = true
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
    const playerPos = Transform.get(engine.PlayerEntity).position
    const monsterPos = Transform.getMutable(this.monster.entity).position
    const distanceToPlayer = Vector3.distance(playerPos, monsterPos)
    const moveMonsterTowardsPlayer = (
      playerPos: Vector3,
      monsterPos: Vector3,
      dt: any
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    ) => {
      const directionToPlayer = Vector3.normalize(
        Vector3.subtract(playerPos, monsterPos) as Vector3
      )
      const newPosition = Vector3.add(
        monsterPos,
        Vector3.scale(directionToPlayer, this.moveSpeed * 2 * dt) as Vector3
      )
      Transform.getMutable(this.monster.entity).position = newPosition
      Transform.getMutable(this.monster.entity).rotation =
        Quaternion.fromLookAt(newPosition, playerPos)
    }
    if (this.hasBeenHit && distanceToPlayer > this.stopDistance) {
      moveMonsterTowardsPlayer(playerPos, monsterPos, dt)
      Animator.playSingleAnimation(
        this.monster.entity,
        this.monster.walkClip,
        false
      )
    }
    if (arrow != null) {
      arrowMove(arrow, dt)
      // Calculate distance for collision detection
      const arrowPos = Transform.getMutable(arrow).position
      const targetPos = Transform.getMutable(this.monster.entity).position
      const distance = Vector3.distance(arrowPos, targetPos)
      // Check if the arrow has traveled beyond the maximum distance
      const traveledDistance = Vector3.distanceSquared(
        arrowStartPosition,
        Transform.getMutable(this.monster.entity).position
      )
      if (traveledDistance > MAX_DISTANCE * MAX_DISTANCE) {
        engine.removeEntity(arrow)
        arrow = null
        return
      }
      if (distance < 1.5) {
        this.hasBeenHit = true
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const distanceToMonster = Vector3.distance(
          Transform.get(engine.PlayerEntity).position,
          Transform.getMutable(this.monster.entity).position
        )
        if (this.monster.health <= 0) {
          this.monster.onDead()
          this.hasBeenHit = false
          return
        }
        this.monster.performAttack(Player.getInstance().getMagic() / 3, false)
        // const monsterDiceResult = this.monster.rollDice()
        // const playerDiceResult = player.rollDice()

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const playerAttack = Math.round(
          player.getPlayerAttack(getRandomInt(100) <= player.critRateBuff)
        )

        // MainHUD.getInstance().updateStats(
        //     `${Math.floor(playerDiceResult)}`,
        //     `${Math.floor(monsterDiceResult)}`,
        //     `${playerAttack}`,
        //     `MISSED`
        // )
      }
    }
    function arrowMove(arrow: Entity, dt: number): void {
      const transform = Transform.getMutable(arrow)
      const forward = Vector3.rotate(Vector3.Forward(), transform.rotation)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const arrowMove = Vector3.lerp(transform.position, forward, dt * 0.2)
    }
  }
}
