import { Quaternion, Vector3 } from '@dcl/sdk/math'
import MonsterOligar from '../monster'
import { DungeonStage } from '../../counters'
import { Transform } from '@dcl/sdk/ecs'
import { getRandomInt } from '../../utils/getRandomInt'
import { LEVEL_TYPES } from '../../player/LevelManager'
import { Player } from '../../player/player'

export default class BetaBoss1 extends MonsterOligar {
  shapeFile = 'assets/models/Butcher.glb'
  hoverText = `Attack LVL ${DungeonStage.read()} Jameson's Butcher`
  minLuck = 10

  constructor() {
    const player = Player.getInstanceOrNull()
    const level = player?.levels.getLevel(LEVEL_TYPES.PLAYER) ?? 1
    const stage = DungeonStage.read()

    super(5 + stage * 7, level + 100, level + 1, 100 * (stage * 3))
    this.initMonster()
    this.setTopOffset(3.75)
    // # in %
    this.dropRate = -1
  }

  onDropXp(): void {
    // TODO
    // removeNPCFromMap("Trews1")
    // callanQuestLabel.value = "Talk to Callan."
    // createChryseNPCs()
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
}
