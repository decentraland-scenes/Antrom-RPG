import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { DungeonStage, jailGuards } from '../../counters'
import MonsterMob from '../MonsterMob'
import { Transform } from '@dcl/sdk/ecs'
import { getRandomInt } from '../../utils/getRandomInt'
import { LEVEL_TYPES } from '../../player/LevelManager'
import { Player } from '../../player/player'
import { type GameController } from '../../controllers/game.controller'
import { entityController } from '../../realms/entityController'

export default class Minion extends MonsterMob {
  shapeFile = 'assets/models/ExecutionerAxe.glb'
  hoverText = `Attack Guard!`
  gameController: GameController

  constructor(gameController: GameController, initialPos: Vector3) {
    const player = Player.getInstanceOrNull()
    const level = player?.levels.getLevel(LEVEL_TYPES.PLAYER) ?? 1
    const stage = DungeonStage.read()
    super(5 + stage * 7, level + 100, level + 1, 10) // ---->> 100 * (stage * 3)
    this.minLuck = 30
    this.gameController = gameController
    this.initialPosition = initialPos
    Transform.createOrReplace(this.entity, {
      position: Vector3.create(0, 0, 0)
    })
    this.initMonster()
    this.loadTransformation()
    this.setTopOffset(2.25)
    this.dropRate = -1
  }

  onDropXp(): void {
    jailGuards.increase(1)
    console.log('Guard dead')
  }

  setupAttackTriggerBox(): void {
    super.setupAttackTriggerBox()
  }

  loadTransformation(): void {
    const initialPosition = Vector3.create(
      this.initialPosition?.x,
      this.initialPosition?.y,
      this.initialPosition?.z
    )
    const initialRotation = Quaternion.fromEulerDegrees(
      0,
      getRandomInt(10) / 10 + getRandomInt(4),
      0
    )
    Transform.createOrReplace(this.entity, {
      position: initialPosition,
      rotation: initialRotation
    })
  }

  create(): void {}

  removeEntity(): void {
    super.cleanup()
    entityController.removeEntity(this.rangeAttackTrigger)
    entityController.removeEntity(this.engageAttackTrigger)
    entityController.removeEntity(this.entity)
  }
}
