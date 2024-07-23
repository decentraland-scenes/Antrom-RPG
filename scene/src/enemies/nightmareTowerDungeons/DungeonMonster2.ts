import { Quaternion, Vector3 } from '@dcl/sdk/math'
import MonsterOligar from '../monster'
import { DungeonStage } from '../../counters'
import { getRandomInt, getRandomIntRange } from '../../utils/getRandomInt'
import { LEVEL_TYPES } from '../../player/LevelManager'
import { ITEM_TYPES } from '../playerInventoryMaps'
import { Transform } from '@dcl/sdk/ecs'
import { Player } from '../../player/player'

const DEFAULT_ATTACK = 0
const DEFAULT_XP = 250
const DEFAULT_LEVEL = 80

const POSITIONS: Vector3[] = [
  Vector3.create(65.65, 63.36, 84.73),
  Vector3.create(21.62, 63.49, 65.09)
]
// CHECK TYPE POISON
export default class EvilGodricNightmare extends MonsterOligar {
  shapeFile = 'assets/models/Ghost.glb'
  hoverText = 'Attack Nightmare Deadly Apparition!'
  minLuck = 30
  static currentInstance: EvilGodricNightmare

  constructor() {
    const stage = DungeonStage.read()
    const player = Player.getInstance()
    super(
      Math.round(DEFAULT_ATTACK + stage * 1.75),
      Math.round(DEFAULT_XP + stage * 4),
      Math.round(DEFAULT_LEVEL + stage * 0.25),
      Math.round(player.maxHealth * 2 + stage * 60)
    )
    this.initMonster()
    this.setTopOffset(3)
    // # in %
    this.dropRate = 100
    EvilGodricNightmare.currentInstance = this
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
        type: ITEM_TYPES.CHICKEN,
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
