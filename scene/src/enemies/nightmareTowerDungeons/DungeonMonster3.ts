import { Quaternion, Vector3 } from '@dcl/sdk/math'
import MonsterOligar from '../monster'
import { DungeonStage } from '../../counters'
import { getRandomInt, getRandomIntRange } from '../../utils/getRandomInt'
import { LEVEL_TYPES } from '../../player/LevelManager'
import { ITEM_TYPES } from '../playerInventoryMaps'
import { Transform } from '@dcl/sdk/ecs'

const DEFAULT_ATTACK = 50
const DEFAULT_XP = 250
const DEFAULT_LEVEL = 100
const DEFAULT_HP = 700

const POSITIONS: Vector3[] = [
  Vector3.create(83.62, 63.5, 46.4),
  Vector3.create(75.39, 63.52, 57.82)
]
// CHECK TYPE FIREBALL
export default class TrewsNightmare extends MonsterOligar {
  shapeFile = 'assets/models/SkeletonwBow.glb'
  hoverText = 'Attack Nightmare Skeleton Ranger!'
  minLuck = 40
  static currentInstance: TrewsNightmare

  constructor() {
    const stage = DungeonStage.read()
    super(
      Math.round(DEFAULT_ATTACK + stage * 1.75),
      Math.round(DEFAULT_XP + stage * 4),
      Math.round(DEFAULT_LEVEL + stage * 0.25),
      Math.round(DEFAULT_HP + stage * 60)
    )
    this.initMonster()
    this.topOffSet = 3
    // # in %
    this.dropRate = 100
    TrewsNightmare.currentInstance = this
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
        type: ITEM_TYPES.TREE,
        value: 50
      }
    ]
    // TODO UI
    // addRewards(exp, loot)
  }

  onDropLoot(): void {
    // manageDungeonKeys('foundKey4')
    // foundSmallKey()
    // key4.increase(1)
    // console.log('on drop here')
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
