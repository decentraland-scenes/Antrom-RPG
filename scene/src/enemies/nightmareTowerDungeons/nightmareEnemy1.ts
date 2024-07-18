import { type Vector3 } from '@dcl/sdk/math'
import MonsterOligar from '../monster'
import { DungeonStage } from '../../counters'
import { getRandomIntRange } from '../../utils/getRandomInt'
import { ITEM_TYPES } from '../playerInventoryMaps'
import { LEVEL_TYPES } from '../../player/LevelManager'
import { Player } from '../../player/player'

const DEFAULT_ATTACK = 35
const DEFAULT_XP = 50
const DEFAULT_LEVEL = 70
const DEFAULT_HP = 300

const MODEL_NAMES = [
  'models/SkeletonSword.glb',
  'models/SkeletonwBow.glb',
  'models/Executioner.glb',
  'models/ExecutionerAxe.glb',
  'models/DarkKnight.glb'
]

export default class nightmareEnemy1 extends MonsterOligar {
  hoverText = 'Attack Skeleton Soldier!'
  minLuck = 2
  hasDrop = false
  static currentInstance: nightmareEnemy1

  constructor(spawnPos: Vector3, dropRate: number = -1) {
    const randomModelIndex = Math.floor(Math.random() * MODEL_NAMES.length)
    const stage = DungeonStage.read()
    super(
      Math.round(DEFAULT_ATTACK + stage * 1.75),
      Math.round(DEFAULT_XP + stage * 4),
      Math.round(DEFAULT_LEVEL + stage * 0.25),
      Math.round(DEFAULT_HP + stage * 60)
    )

    this.shapeFile = MODEL_NAMES[randomModelIndex]
    this.initMonster()
    super.setupEngageTriggerBox()
    this.topOffSet = 2.5
    this.dropRate = dropRate
    if (this.shapeFile === 'assets/models/DarkKnight.glb') {
      this.attack += 50 // Increase attack by 50
    }
    nightmareEnemy1.currentInstance = this
  }

  onDropXp(): void {
    const player = Player.getInstance()
    const xp = getRandomIntRange(this.xp, this.xp + 10)
    const randomNumber = Math.random()

    if (randomNumber <= 0.1) {
      // TODO
      // ui.displayAnnouncement('+1 POTION')
      player.inventory.incrementItem(ITEM_TYPES.POTION, 1)
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
        value: 3
      }
    ]
    // addRewards(exp, loot)
  }

  onDropLoot(): void {
    // TODO UI
    // showGetBoneIcon()
  }

  setupAttackTriggerBox(): void {
    super.setupEngageTriggerBox()
  }

  create(): void {}

  loadTransformation(): void {}
}
