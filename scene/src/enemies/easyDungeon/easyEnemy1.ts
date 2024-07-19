import MonsterOligar from '../monster'
import { DungeonStage } from '../../counters'
import { getRandomIntRange } from '../../utils/getRandomInt'
import { LEVEL_TYPES } from '../../player/LevelManager'
import { ITEM_TYPES } from '../playerInventoryMaps'
import { Player } from '../../player/player'

const DEFAULT_ATTACK = 35
const DEFAULT_XP = 50
const DEFAULT_LEVEL = 5
const DEFAULT_HP = 200

const MODEL_NAMES = [
  'models/SkeletonSword.glb',
  'models/SkeletonwBow.glb',
  'models/Executioner.glb',
  'models/ExecutionerAxe.glb',
  'models/DarkKnight.glb'
]

// CHECK TYPE HEALER
export default class easyEnemy1 extends MonsterOligar {
  shapeFile = ''
  hoverText = 'Attack LVL 15 Butcher!'
  minLuck = 2
  hasDrop = false
  static currentInstance: easyEnemy1

  constructor() {
    const stage = DungeonStage.read()
    const randomModelIndex = Math.floor(Math.random() * MODEL_NAMES.length)
    super(
      Math.round(DEFAULT_ATTACK + stage * 1.75),
      Math.round(DEFAULT_XP + stage * 4),
      Math.round(DEFAULT_LEVEL + stage * 0.25),
      Math.round(DEFAULT_HP + stage * 60)
    )
    this.shapeFile = MODEL_NAMES[randomModelIndex]
    this.initMonster()
    super.setupEngageTriggerBox()
    this.setTopOffset(2.5)
    // # in %
    this.dropRate = 100
    easyEnemy1.currentInstance = this
  }

  onDropXp(): void {
    const xp = getRandomIntRange(this.xp, this.xp + 10)
    const randomNumber = Math.random()

    if (randomNumber <= 0.1) {
      // ui.displayAnnouncement("+1 POTIONS")
      const player = Player.getInstanceOrNull()
      if (player !== null) player.inventory.incrementItem(ITEM_TYPES.POTION, 1)
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const exp = [
      {
        type: LEVEL_TYPES.ENEMY,
        value: 1
      },
      {
        type: LEVEL_TYPES.PLAYER,
        value: xp
      }
    ]
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const loot = [
      {
        type: ITEM_TYPES.BONE,
        value: 2
      }
    ]
    // TODO UI
    // addRewards(exp, loot)
  }

  onDropLoot(): void {
    // showGetBoneIcon()
  }

  setupAttackTriggerBox(): void {
    super.setupAttackTriggerBox()
  }

  create(): void {}

  loadTransformation(): void {}
}
