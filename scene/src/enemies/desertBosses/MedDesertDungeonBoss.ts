import { Transform } from '@dcl/sdk/ecs'
import MonsterOligar from '../monster'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { Player } from '../../player/player'
import { quest } from '../../utils/refresherTimer'
import { ITEM_TYPES } from '../../inventory/playerInventoryMap'
import { LEVEL_TYPES } from '../../player/LevelManager'
import { backToAntrom } from './NightmareDesertDungeonBoss'

const DEFAULT_XP = 60

export default class MedDesertDungeonBoss extends MonsterOligar {
  shapeFile = 'assets/models/SandBoss.glb'
  hoverText = `Attack Wasteland Apex Ahau!`

  constructor(difficulty: number) {
    super(100, DEFAULT_XP, Player.getInstance().getLevel() * difficulty, 10000)
    this.minLuck = 10

    this.initMonster()

    // super.setupEngageTriggerBox(new utils.TriggerSphereShape(0))

    this.setTopOffset(4)
    // # in %
    this.dropRate = -1
  }

  onDropXp(): void {
    quest.turnOffKingQuestTimer()
    const random = Math.random() * 100

    switch (true) {
      case random < 3: {
        // 3% chance
        // confirmAndSendLootUI(
        //     "RARE",
        //     "FIRE BOW",
        //     "0x3b8f5b62ddd10c1af0f31665c5ab09b2bf85cacc:2",
        //     "fb",
        //     0,
        //     0,
        //     0,
        //     0,
        //     3
        // )
        break
      }
      case random < 6: {
        // 3% chance (6% cumulative - 3% previous)
        // confirmAndSendLootUI(
        //     "RARE",
        //     "FIRE SWORD",
        //     "0x3b8f5b62ddd10c1af0f31665c5ab09b2bf85cacc:0",
        //     "fs",
        //     0,
        //     0,
        //     0,
        //     0,
        //     3
        // )

        break
      }
      case random < 9: {
        // 3% chance (9% cumulative - 6% previous)
        // confirmAndSendLootUI(
        //     "EPIC",
        //     "Wasteland Mage Armor",
        //     "0xa83c8951dd73843bf5f7e9936e72a345a3e79874:3",
        //     "wsa2",
        //     0,
        //     0,
        //     0,
        //     0,
        //     3
        // )

        break
      }
      case random < 15: {
        // 6% chance (15% cumulative - 9% previous)
        // confirmAndSendLootUI(
        //     "EPIC",
        //     "Druid Staff",
        //     "0x2b5e68e51dd54fe100150a6f52547f4f0b3d32aa:5",
        //     "ds",
        //     0,
        //     0,
        //     0,
        //     0,
        //     3
        // )
        break
      }
      case random < 25: {
        // 10% chance (25% cumulative - 15% previous)

        // confirmAndSendLootUI(
        //     "RARE",
        //     "Wasteland Helmet",
        //     "0xa83c8951dd73843bf5f7e9936e72a345a3e79874:2",
        //     "wsh1",
        //     0,
        //     0,
        //     0,
        //     0,
        //     3
        // )

        break
      }
      case random < 35: {
        // 10% chance (35% cumulative - 25% previous)
        // confirmAndSendLootUI(
        //     "RARE",
        //     "Wasteland Pants",
        //     "0xa83c8951dd73843bf5f7e9936e72a345a3e79874:1",
        //     "wsp1",
        //     0,
        //     0,
        //     0,
        //     0,
        //     3
        // )

        break
      }
      case random < 45: {
        // 10% chance (45% cumulative - 35% previous)
        // confirmAndSendLootUI(
        //     "RARE",
        //     "Wasteland Armor",
        //     "0xa83c8951dd73843bf5f7e9936e72a345a3e79874:0",
        //     "wsa1",
        //     0,
        //     0,
        //     0,
        //     0,
        //     3
        // )

        break
      }
      case random < 60: {
        // 15% chance (60% cumulative - 45% previous)
        // confirmAndSendLootUI(
        //     "UNCOMMON",
        //     "Apprentice Mage Sceptre",
        //     "0x477d5780511ce18379056c3f4e6b4712a47d171c:2",
        //     "b3",
        //     0,
        //     0,
        //     0,
        //     0,
        //     3
        // )
        break
      }
      case random < 80: {
        // 20% chance (80% cumulative - 60% previous)
        // confirmAndSendLootUI(
        //     "UNCOMMON",
        //     "Apprentice Berserker Axe",
        //     "0xd81dcebc0769f1f055352f4588bbcc55e08d1c60:2",
        //     "apba",
        //     0,
        //     0,
        //     0,
        //     0,
        //     3
        // )
        break
      }
      default: {
        // 20% chance (100% cumulative - 80% previous)
        // confirmAndSendLootUI(
        //     "UNCOMMON",
        //     "Apprentice Ranger Bow",
        //     "0xc032771f2be2b5f31d62186e720f0f455d3aaa19:2",
        //     "a3",
        //     0,
        //     0,
        //     0,
        //     0,
        //     3
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
