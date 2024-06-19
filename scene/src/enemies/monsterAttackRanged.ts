import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { type MonsterOligar } from './monster'
import { Animator, Transform, engine } from '@dcl/sdk/ecs'

// Configuration constants
const MOVE_SPEED = 1
const ROT_SPEED = 1
// const MAX_DISTANCE = 20

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
      // Animator.getClip(this.monster.entity, this.monster.walkClip).playing = true
      Animator.playSingleAnimation(
        this.monster.entity,
        this.monster.walkClip,
        false
      )
    }
  }
  //    moveMonsterTowardsPlayer = (playerPos:any, monsterPos:any, dt:number) => {
  //     const directionToPlayer = playerPos.subtract(monsterPos).normalize()
  //     const newPosition = monsterPos.add(
  //         directionToPlayer.scale(this.moveSpeed * 2 * dt)
  //     )
  // newPosition.y = Camera.instance.position.y - 2 // Adjust Y-coordinate to ensure the monster is on the ground
  // this.transform.position = newPosition
  // this.transform.lookAt(playerPos)

  // Add system to engine

  // async update(dt: number) {
  //     const playerPosition = Camera.instance.position
  //     const monsterPosition = this.transform.position
  //     const distanceToPlayer = Vector3.Distance(
  //         playerPosition,
  //         monsterPosition
  //     )

  //     // Function to move the monster towards the player
  //     const moveMonsterTowardsPlayer = (playerPos, monsterPos, dt) => {
  //         const directionToPlayer = playerPos.subtract(monsterPos).normalize()
  //         const newPosition = monsterPos.add(
  //             directionToPlayer.scale(this.moveSpeed * 2 * dt)
  //         )
  //         newPosition.y = Camera.instance.position.y - 2 // Adjust Y-coordinate to ensure the monster is on the ground
  //         this.transform.position = newPosition
  //         this.transform.lookAt(playerPos)
  //     }

  //     // Move monster towards player if it has been hit and is not too close
  //     if (this.hasBeenHit && distanceToPlayer > this.stopDistance) {
  //         moveMonsterTowardsPlayer(playerPosition, monsterPosition, dt)
  //         this.monster.walkClip?.play()
  //     }

  //     if (arrow) {
  //         const transform = arrow.getComponent(Transform)
  //         const forward = Vector3.Forward().rotate(transform.rotation)
  //         transform.translate(forward.scale(dt * 0.2)) // Move the arrow forward

  //         // Calculate distance for collision detection
  //         const arrowPos = transform.position
  //         const targetPos = this.transform.position
  //         const distance = Vector3.Distance(arrowPos, targetPos)

  //         // Check if the arrow has traveled beyond the maximum distance
  //         const traveledDistance = Vector3.DistanceSquared(
  //             arrowStartPosition,
  //             transform.position
  //         )
  //         if (traveledDistance > MAX_DISTANCE * MAX_DISTANCE) {
  //             engine.removeEntity(arrow)
  //             arrow = null
  //             return
  //         }

  //         // Check for collision
  //         if (distance < 1.5) {
  //             this.hasBeenHit = true
  //             const distanceToMonster = Vector3.Distance(
  //                 playerPosition,
  //                 monsterPosition
  //             )
  //             if (this.monster.health <= 0) {
  //                 this.monster.onDead()
  //                 this.hasBeenHit = false
  //                 return
  //             }

  //             // this.monster.createHealthBar()
  //             // this.monster.createLabel()
  //             const monsterDiceResult = this.monster.rollDice()
  //             const playerDiceResult = player.rollDice()

  //             let playerAttack = Math.round(
  //                 player.getPlayerAttack(
  //                     getRandomInt(100) <= player.critRateBuff
  //                 )
  //             )
  //             this.monster.performAttack(
  //                 Player.getInstance().getMagic() / 3,
  //                 false
  //             )

  //             MainHUD.getInstance().updateStats(
  //                 `${Math.floor(playerDiceResult)}`,
  //                 `${Math.floor(monsterDiceResult)}`,
  //                 `${playerAttack}`,
  //                 `MISSED`
  //             )
  //         }
  //     }
  // }
}
