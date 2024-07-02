import { Quaternion, Vector3 } from '@dcl/sdk/math'
import MonsterOligar from '../monster'
import { DungeonStage } from '../../counters'
import { getRandomInt, getRandomIntRange } from '../../utils/getRandomInt'
import { LEVEL_TYPES } from '../types'
import { ITEM_TYPES } from '../playerInventoryMaps'
import { Transform } from '@dcl/sdk/ecs'

const DEFAULT_ATTACK = 30
const DEFAULT_XP = 250
const DEFAULT_LEVEL = 80
const DEFAULT_HP = 600
const POSITIONS: Vector3[] = [Vector3.create(-12.43, 40.2, -3.95)]
// CHECK TYPE HEALER
export default class DragonMotherNightmare extends MonsterOligar {
  shapeFile = 'assets/models/Butcher.glb'
  hoverText = 'Attack Nightmare Butcher!'
  minLuck = 20
  static currentInstance: DragonMotherNightmare

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
    DragonMotherNightmare.currentInstance = this
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
        type: ITEM_TYPES.BERRY,
        value: 35
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