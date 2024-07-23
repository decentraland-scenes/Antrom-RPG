import { Transform } from '@dcl/sdk/ecs'
import MonsterOligar from '../monster'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { Player } from '../../player/player'
import { quest } from '../../utils/refresherTimer'
import { LEVEL_TYPES } from '../../player/LevelManager'
import { ITEM_TYPES } from '../../inventory/playerInventoryMap'
import { backToAntrom } from './NightmareDesertDungeonBoss'

// const DEFAULT_ATTACK = 35
const DEFAULT_XP = 60
// const DEFAULT_LEVEL = 5
// const DEFAULT_HP = 200
// const DEFAULT_DEF = 0.1

export default class EasyDesertDungeonBoss extends MonsterOligar {
  shapeFile = 'assets/models/SandBoss.glb'
  hoverText = `Attack Wasteland Apex Ahau!`

  constructor(difficulty: number) {
    super(20, DEFAULT_XP, Player.getInstance().getLevel() * difficulty, 1000)
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
      case random < 1: {
        // 1% chance
        // TODO UI
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

      case random < 10: {
        // Additional 0.5% Chance (Cumulative 1% - 0.5% for the previous case)
        // TODO UI
        // confirmAndSendLootOnceUI(
        //     "LEGENDARY",
        //     "Lava Gauntlets",
        //     "0x6e78e8aacddbf96296dbcc9a1cb682a4b16b60de:1",
        //     "lavag",
        //     0,
        //     0,
        //     0,
        //     0,
        //     6
        // )
        break
      }

      case random < 20: {
        // 1% chance (2% cumulative - 1% previous)
        // TODO UI
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
      case random < 30: {
        // 1% chance (3% cumulative - 2% previous)
        // TODO UI
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
      case random < 40: {
        // 7% chance (10% cumulative - 3% previous)
        // TODO UI
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
      case random < 50: {
        // 10% chance (20% cumulative - 10% previous)
        // TODO UI
        // confirmAndSendLootUI(
        //     "UNCOMMON",
        //     "Apprentice Ranger Hood",
        //     "0xc032771f2be2b5f31d62186e720f0f455d3aaa19:1",
        //     "a2",
        //     0,
        //     0,
        //     0,
        //     0,
        //     3
        // )
        break
      }
      case random < 65: {
        // 10% chance (30% cumulative - 20% previous)
        // TODO UI
        // confirmAndSendLootUI(
        //     "UNCOMMON",
        //     "Apprentice Berserker Helm",
        //     "0xd81dcebc0769f1f055352f4588bbcc55e08d1c60:1",
        //     "apbh",
        //     0,
        //     0,
        //     0,
        //     0,
        //     3
        // )
        break
      }
      case random < 75: {
        // 10% chance (40% cumulative - 30% previous)
        // TODO UI
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
        break
      }
      case random < 85: {
        // 20% chance (60% cumulative - 40% previous)
        // TODO UI
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
        // TODO UI
        // confirmAndSendLootUI(
        //     "UNCOMMON",
        //     "Apprentice Ranger Suit",
        //     "0xc032771f2be2b5f31d62186e720f0f455d3aaa19:0",
        //     "a1",
        //     0,
        //     0,
        //     0,
        //     0,
        //     3
        // )
      }
    }
    // })

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

    // TODO UI
    // addRewards(exp, loot)
    // DailyQuestHUD.getInstance().listenAndUpdateForAnyActiveQuest(
    //     LEVEL_TYPES.ENEMY
    // )

    void backToAntrom('Easy')
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
