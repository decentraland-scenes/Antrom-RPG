import { Quaternion, Vector3 } from '@dcl/sdk/math'
import MonsterOligar from '../monster'
import { DungeonStage } from '../../counters'
import { getRandomInt, getRandomIntRange } from '../../utils/getRandomInt'
import { LEVEL_TYPES } from '../../player/LevelManager'
import { ITEM_TYPES } from '../playerInventoryMaps'
import { Transform } from '@dcl/sdk/ecs'

const DEFAULT_ATTACK = 75
const DEFAULT_XP = 250
const DEFAULT_LEVEL = 80
const DEFAULT_HP = 450

const POSITIONS: Vector3[] = [Vector3.create(35.18, 63.58, 33.05)]
// CHECK TYPE DEFENSE
export default class BerserkerNightmare extends MonsterOligar {
  shapeFile = 'assets/models/SkeletonSword.glb'
  hoverText = 'Attack Nightmare Skeleton Soldier!'
  minLuck = 20
  static currentInstance: BerserkerNightmare

  constructor() {
    const stage = DungeonStage.read()
    super(
      Math.round(DEFAULT_ATTACK + stage * 1.75),
      Math.round(DEFAULT_XP + stage * 4),
      Math.round(DEFAULT_LEVEL + stage * 0.25),
      Math.round(DEFAULT_HP + stage * 60)
    )
    this.initMonster()
    this.setTopOffset(3)
    // # in %
    this.dropRate = 100
    BerserkerNightmare.currentInstance = this
  }

  onDropXp(): void {
    const xp = getRandomIntRange(this.xp, this.xp + 10)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const exp = [
      {
        type: LEVEL_TYPES.ENEMY,
        value: 3
      },
      {
        type: LEVEL_TYPES.PLAYER,
        value: xp
      }
    ]
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const loot = [
      {
        type: ITEM_TYPES.ROCK,
        value: 50
      }
    ]
    // TODO UI
    // addRewards(exp, loot)
  }

  onDropLoot(): void {
    // manageDungeonKeys('foundKey3')
    // foundSmallKey()
    // key5.increase(1)
    // log('on drop here')
  }

  setupAttackTriggerBox(): void {
    super.setupAttackTriggerBox()
  }

  create(): void {}

  loadTransformation(): void {
    const initialPosition = POSITIONS[getRandomInt(POSITIONS.length)]
    const initialRotation = Quaternion.fromEulerDegrees(0, 90, 0)
    Transform.createOrReplace(this.entity, {
      position: initialPosition,
      rotation: initialRotation
    })
  }
}
