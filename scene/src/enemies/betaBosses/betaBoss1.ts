import { Quaternion, Vector3 } from '@dcl/sdk/math'
// import MonsterOligar from '../monster'
import { DungeonStage } from '../../counters'
import { LEVEL_TYPES } from '../types'
import { Transform, engine } from '@dcl/sdk/ecs'
import { player } from '../../player/player'
import { getRandomInt } from '../../utils/getRandomInt'
import MonsterMob from '../MonsterMob'

export default class BetaBoss1 extends MonsterMob {
  shapeFile = 'assets/models/Butcher.glb'
  hoverText = `Attack LVL ${DungeonStage.read()} Jameson's Butcher`
  minLuck = 10

  constructor() {
    const stage = DungeonStage.read()
    super(
      5 + stage * 7,
      player.levels.getLevel(LEVEL_TYPES.PLAYER) + 100,
      player.levels.getLevel(LEVEL_TYPES.PLAYER) + 1,
      100 * (stage * 3)
    )
    Transform.createOrReplace(this.entity, {
      position: Vector3.create(0, 0, 0)
    })
    this.initMonster()
    this.loadTransformation()
    this.topOffSet = 3.75
    this.dropRate = -1
  }

  onDropXp(): void {
    // TODO
    console.log('Xp dropped')
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

  create(): void {}

  removeEntity(): void {
    engine.removeEntity(this.rangeAttackTrigger)
    engine.removeEntity(this.engageAttackTrigger)
    engine.removeEntity(this.attackTrigger)
    engine.removeEntity(this.healthBar)
    engine.removeEntity(this.label)
    engine.removeEntity(this.entity)
  }
}

export function spawnBoss1(): void {
  const betaBoss1 = new BetaBoss1()
  console.log(betaBoss1, ' spawned')
}
