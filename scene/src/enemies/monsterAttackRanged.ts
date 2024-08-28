import {
  Animator,
  type Entity,
  GltfContainer,
  Transform,
  engine
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { Player } from '../player/player'
import { entityController } from '../realms/entityController'
import { type MonsterOligar } from './monster'
import { syncEntity } from '@dcl/sdk/network'

type ArrowType = {
  entity: Entity
  startPosition: Vector3
  forward: Vector3
  distance: number
}
let arrows: ArrowType[] = []

export function shootArrow(distance: number = MAX_DISTANCE): void {
  const arrowEntity = entityController.addEntity()
  const playerPosition = Transform.get(engine.PlayerEntity).position
  const playerRotation = Transform.get(engine.PlayerEntity).rotation

  GltfContainer.create(arrowEntity, {
    src: 'assets/models/GreenOrb.glb',
    invisibleMeshesCollisionMask: 0,
    visibleMeshesCollisionMask: 0
  })

  Transform.create(arrowEntity, {
    position: playerPosition,
    rotation: playerRotation
  })

  // Sync the arrow entity to ensure all players see it the same way
  syncEntity(arrowEntity, [Transform.componentId])

  // Calculate the forward direction and set the initial position
  const forward = Vector3.rotate(Vector3.Forward(), playerRotation)
  const arrowStartPosition = Vector3.add(
    Vector3.scale(forward, 0.5),
    playerPosition
  )

  const newArrow: ArrowType = {
    entity: arrowEntity,
    startPosition: arrowStartPosition,
    forward,
    distance: 0
  }
  arrows.push(newArrow)
}

function arrowSystem(dt: number): void {
  const arrowToRemove: Entity[] = []
  for (const arrow of arrows) {
    const transform = Transform.getMutable(arrow.entity)
    const arrowMove = Vector3.add(
      transform.position,
      Vector3.scale(arrow.forward, 5 * dt)
    )
    transform.position = arrowMove

    // Sync the updated transform of the arrow entity
    syncEntity(arrow.entity, [Transform.componentId])

    const distance = Vector3.distance(arrow.startPosition, arrowMove)
    if (distance > MAX_DISTANCE) {
      arrowToRemove.push(arrow.entity)
    }
  }

  arrows = arrows.filter((arrow) => !arrowToRemove.includes(arrow.entity))
  for (const arrow of arrowToRemove) {
    entityController.removeEntity(arrow)
  }
}

engine.addSystem(arrowSystem)

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
    const playerPos =
      Transform.getOrNull(engine.PlayerEntity)?.position ?? Vector3.Zero()
    const monsterTransform = Transform.getMutableOrNull(this.monster.entity)

    if (monsterTransform == null || this.monster.isDeadAnimation) {
      return
    }

    const monsterPos = monsterTransform.position
    const distanceToPlayer = Vector3.distance(playerPos, monsterPos)
    const moveMonsterTowardsPlayer = (
      playerPos: Vector3,
      monsterPos: Vector3,
      dt: number
    ): void => {
      const directionToPlayer = Vector3.normalize(
        Vector3.subtract(playerPos, monsterPos)
      )
      const newPosition = Vector3.add(
        monsterPos,
        Vector3.scale(directionToPlayer, this.moveSpeed * dt)
      )

      monsterTransform.position = newPosition
      monsterTransform.rotation = Quaternion.fromLookAt(newPosition, playerPos)
    }
    if (
      this.hasBeenHit &&
      distanceToPlayer > this.stopDistance &&
      distanceToPlayer < MAX_DISTANCE
    ) {
      moveMonsterTowardsPlayer(playerPos, monsterPos, dt)
      Animator.playSingleAnimation(
        this.monster.entity,
        this.monster.walkClip,
        false
      )
    } else {
      Animator.playSingleAnimation(
        this.monster.entity,
        this.monster.idleClip,
        false
      )
    }

    for (const arrow of arrows) {
      // Calculate distance for collision detection
      const arrowPos = Transform.get(arrow.entity).position
      const targetPos = monsterTransform.position
      const distance = Vector3.distance(arrowPos, targetPos)

      if (distance < 1.5) {
        this.hasBeenHit = true
        if (this.monster.health <= 0) {
          this.monster.onDead()
          this.hasBeenHit = false
          return
        }
        const player = Player.getInstanceOrNull()
        if (player === null) {
          console.log('player instance is null')
          return
        }

        this.monster.performAttack(player.getMagic() / 3, false)
        const monsterDiceResult = this.monster.rollDice()
        const playerDiceResult = player.rollDice()

        const roundedPlayerDice = Math.floor(playerDiceResult)
        const roundedMonsterDice = Math.floor(monsterDiceResult)

        const mainHUD = player?.gameController.uiController.mainHud
        if (mainHUD !== null) {
          mainHUD.lastPlayerRoll = roundedPlayerDice
          mainHUD.lastEnemyRoll = roundedMonsterDice
        }
      }
    }
  }
}
