import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { Transform } from '@dcl/sdk/ecs'
import { type GameController } from '../../controllers/game.controller'
import { DungeonStage } from '../../counters'
import { LEVEL_TYPES } from '../../player/LevelManager'
import { Player } from '../../player/player'
import { entityController } from '../../realms/entityController'
import { getRandomInt } from '../../utils/getRandomInt'
import MonsterMob from '../MonsterMob'

export default class BetaBoss1 extends MonsterMob {
  shapeFile = 'assets/models/Butcher.glb'
  hoverText = `Attack LVL ${DungeonStage.read()} Jameson's Butcher`
  
  gameController: GameController
  constructor(gameController: GameController) {
    const player = Player.getInstanceOrNull()
    const level = player?.levels.getLevel(LEVEL_TYPES.PLAYER) ?? 1
    const stage = DungeonStage.read()
    super(5 + stage * 7, level + 100, level + 1, 10) // ---> 100 * (stage * 3)
    this.minLuck = 10
    this.gameController = gameController
    Transform.createOrReplace(this.entity, {
      position: Vector3.create(0, 0, 0)
    })
    this.initMonster()
    this.loadTransformation()
    this.setTopOffset(3.75)
    // # in %
    this.dropRate = -1
  }

  onDropXp(): void {
    // TODO
    this.gameController.npcs.createChryseNPC()
  }

  setupAttackTriggerBox(): void {
    super.setupAttackTriggerBox()
  }

  loadTransformation(): void {
    const initialPosition = Vector3.create(-37.59, 0, 25.67)
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
