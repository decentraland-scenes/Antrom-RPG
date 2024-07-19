import { Transform } from '@dcl/sdk/ecs'
import MonsterOligar from '../monster'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { Player } from '../../player/player'
import { LEVEL_TYPES } from '../../player/LevelManager'
import { backToAntrom } from './NightmareDesertDungeonBoss'
import { quest } from '../../utils/refresherTimer'
import { ITEM_TYPES } from '../playerInventoryMaps'

const DEFAULT_XP = 60

export default class HardDesertDungeonBoss extends MonsterOligar {
  shapeFile = 'assets/models/SandBoss.glb'
  hoverText = `Attack Wasteland Apex Ahau!`

  minLuck = 10

  constructor(difficulty: number) {
    super(350, DEFAULT_XP, Player.getInstance().getLevel() * difficulty, 140000)

    this.initMonster()

    // super.setupEngageTriggerBox(new utils.TriggerSphereShape(0))

    this.topOffSet = 4
    // # in %
    this.dropRate = -1
  }

  onDropXp(): void {
    quest.turnOffKingQuestTimer()
    const random = Math.random() * 100

    switch (true) {
      case random < 1: {
        // 1% chance
        // confirmAndSendLootUI(
        //   'EPIC',
        //   'Wasteland Mage Helmet',
        //   '0xa83c8951dd73843bf5f7e9936e72a345a3e79874:5',
        //   'wsh2',
        //   0,
        //   0,
        //   0,
        //   0,
        //   3
        // )
        break
      }
      case random < 2: {
        // 1% chance (2% cumulative - 1% previous)
        // confirmAndSendLootUI(
        //   'EPIC',
        //   'Wasteland Mage Pants',
        //   '0xa83c8951dd73843bf5f7e9936e72a345a3e79874:4',
        //   'wsp2',
        //   0,
        //   0,
        //   0,
        //   0,
        //   3
        // )
        break
      }
      case random < 3: {
        // 1% chance (3% cumulative - 2% previous)
        // confirmAndSendLootUI(
        //   'EPIC',
        //   'Wasteland Mage Armor',
        //   '0xa83c8951dd73843bf5f7e9936e72a345a3e79874:3',
        //   'wsa2',
        //   0,
        //   0,
        //   0,
        //   0,
        //   3
        // )
        break
      }
      case random < 10: {
        // 7% chance (10% cumulative - 3% previous)
        // confirmAndSendLootUI(
        //   'RARE',
        //   'Wasteland Helmet',
        //   '0xa83c8951dd73843bf5f7e9936e72a345a3e79874:2',
        //   'wsh1',
        //   0,
        //   0,
        //   0,
        //   0,
        //   3
        // )
        break
      }
      case random < 20: {
        // 10% chance (20% cumulative - 10% previous)
        // confirmAndSendLootUI(
        //   'RARE',
        //   'Wasteland Pants',
        //   '0xa83c8951dd73843bf5f7e9936e72a345a3e79874:1',
        //   'wsp1',
        //   0,
        //   0,
        //   0,
        //   0,
        //   3
        // )
        break
      }
      case random < 30: {
        // 10% chance (30% cumulative - 20% previous)
        // confirmAndSendLootUI(
        //   'RARE',
        //   'Wasteland Armor',
        //   '0xa83c8951dd73843bf5f7e9936e72a345a3e79874:0',
        //   'wsa1',
        //   0,
        //   0,
        //   0,
        //   0,
        //   3
        // )
        break
      }
      case random < 40: {
        // 10% chance (40% cumulative - 30% previous)
        // confirmAndSendLootUI(
        //   'EPIC',
        //   'Druid Staff',
        //   '0x2b5e68e51dd54fe100150a6f52547f4f0b3d32aa:5',
        //   'ds',
        //   0,
        //   0,
        //   0,
        //   0,
        //   3
        // )
        break
      }

      case random < 80: {
        // 20% chance (80% cumulative - 60% previous)
        // confirmAndSendLootUI(
        //   'RARE',
        //   'NIGHTMARE BOW',
        //   '0x2b5e68e51dd54fe100150a6f52547f4f0b3d32aa:3',
        //   'nb',
        //   0,
        //   0,
        //   0,
        //   0,
        //   3
        // )
        break
      }
      default: {
        // 20% chance (100% cumulative - 80% previous)
        // confirmAndSendLootUI(
        //   'UNCOMMON',
        //   'ONE-HANDED SWORD',
        //   '0x2b5e68e51dd54fe100150a6f52547f4f0b3d32aa:6',
        //   'ohs',
        //   0,
        //   0,
        //   0,
        //   0,
        //   3
        // )
      }
    }
    void backToAntrom('Medium')

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const exp = [
      {
        type: LEVEL_TYPES.ENEMY,
        value: 1
      },
      {
        type: LEVEL_TYPES.PLAYER,
        value: 120
      }
    ]
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const loot = [
      {
        type: ITEM_TYPES.BONE,
        value: 100
      }
    ]

    // addRewards(exp, loot)
    // DailyQuestHUD.getInstance().listenAndUpdateForAnyActiveQuest(
    //     LEVEL_TYPES.ENEMY
    // )
    void backToAntrom('Hard')
  }

  onDropLoot(): void {}

  setupAttackTriggerBox(): void {
    super.setupAttackTriggerBox()
  }

  create(): void {}

  loadTransformation(): void {
    const initialPosition = Vector3.create(51.0, 2.53, 63.52)
    const initialRotation = Quaternion.fromEulerDegrees(0, 90, 0)
    Transform.createOrReplace(this.entity, {
      position: initialPosition,
      rotation: initialRotation
    })
  }
}
