import { Quaternion, Vector3 } from '@dcl/sdk/math'
import MonsterOligar from '../monster'
import { DungeonStage } from '../../counters'
import { getRandomInt, getRandomIntRange } from '../../utils/getRandomInt'
import { LEVEL_TYPES } from '../../player/LevelManager'
import { ITEM_TYPES } from '../../inventory/playerInventoryMap'
import { Transform } from '@dcl/sdk/ecs'

const DEFAULT_ATTACK = 15
const DEFAULT_XP = 100
const DEFAULT_LEVEL = 20
const DEFAULT_HP = 700

// CHECK TYPE HEALER
export default class TrewsE extends MonsterOligar {
  shapeFile = 'assets/models/SkeletonwBow.glb'
  hoverText = 'Attack LVL 25 Skeleton Ranger!'
  static currentInstance: TrewsE

  constructor() {
    const stage = DungeonStage.read()
    super(
      Math.round(DEFAULT_ATTACK + stage * 1.75),
      Math.round(DEFAULT_XP + stage * 4),
      Math.round(DEFAULT_LEVEL + stage * 0.25),
      Math.round(DEFAULT_HP + stage * 60)
    )
    this.minLuck = 12
    this.initMonster()
    this.setTopOffset(3)
    // # in %
    this.dropRate = 100
    TrewsE.currentInstance = this
  }

  onDropXp(): void {
    const xp = getRandomIntRange(this.xp, this.xp + 10)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const exp = [
      {
        type: LEVEL_TYPES.ENEMY,
        value: 6
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
    // log('on drop here')
  }

  setupAttackTriggerBox(): void {
    super.setupAttackTriggerBox()
  }

  create(): void {}

  loadTransformation(): void {
    const initialPosition = Vector3.create(83.62, 63.5, 46.4)
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
