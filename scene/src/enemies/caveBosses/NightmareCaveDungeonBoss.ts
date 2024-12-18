import {
  GltfContainer,
  InputAction,
  MeshCollider,
  Transform,
  pointerEventsSystem
} from '@dcl/sdk/ecs'
import MonsterOligar from '../monster'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { DungeonStage } from '../../counters'
import { LEVEL_TYPES } from '../../player/LevelManager'
import { quest } from '../../utils/refresherTimer'
import { ITEM_TYPES } from '../../inventory/playerInventoryMap'
import { Player } from '../../player/player'
import { entityController } from '../../realms/entityController'

function getRandomIntRange(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default class NightmareCaveDungeonBoss extends MonsterOligar {
  shapeFile = 'assets/models/RockMonsterBoss.glb'
  hoverText = `Attack Metapsammite!`

  constructor(difficulty: number) {
    const stage = DungeonStage.read()
    const player = Player.getInstance()
    super(
      1200 + 75 * stage,
      player.levels.getLevel(LEVEL_TYPES.PLAYER) + 100,
      player.levels.getLevel(LEVEL_TYPES.PLAYER) + 5,
      1250000 + 15000 * stage
    )
    this.minLuck = 50

    this.initMonster()

    // TODO super.setupEngageTriggerBox(new utils.TriggerSphereShape(0))

    this.setTopOffset(3)
    // # in %
    this.dropRate = -1
  }

  onDropXp(): void {
    const xp = getRandomIntRange(this.xp, this.xp + 10)
    quest.turnOffKingQuestTimer()
    const random = Math.random() * 1000

    switch (true) {
      case random < 5: {
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

      case random < 200: {
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

      case random < 300: {
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
      case random < 400: {
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
      case random < 500: {
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
      case random < 600: {
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
      case random < 800: {
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

      default: {
        // 20% chance (Cumulative 100% - 80% for previous cases)
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
        value: xp
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

    // backToAntromFromCave("Nightmare")
  }

  onDropLoot(): void {}

  setupAttackTriggerBox(): void {
    super.setupAttackTriggerBox()
  }

  create(): void {}

  loadTransformation(): void {
    const initialPosition = Vector3.create(-15.5, 2.45, -4.6)
    const initialRotation = Quaternion.fromEulerDegrees(0, 90, 0)
    Transform.createOrReplace(this.entity, {
      position: initialPosition,
      rotation: initialRotation
    })
  }
}

export async function backToAntromFromCave(difficulty: string): Promise<void> {
  const door1 = entityController.addEntity()
  Transform.create(door1, {
    position: Vector3.create(48.14, 19, -5.73),
    rotation: Quaternion.create(0, -0.05, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(door1, { src: 'assets/models/Portal.glb' })
  MeshCollider.setBox(door1)
  pointerEventsSystem.onPointerDown(
    {
      entity: door1,
      opts: {
        button: InputAction.IA_POINTER,
        hoverText: 'Restart Antrom'
      }
    },
    function () {
      const player = Player.getInstance()
      quest.removeKingQuestTimer()
      entityController.removeEntity(door1)
      const currentDungeonTokens = player.inventory.getItemCount(
        ITEM_TYPES.ICESHARD
      )
      const currentPremuimDungeonTokens = player.inventory.getItemCount(
        ITEM_TYPES.ICEHEART
      )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const total = currentPremuimDungeonTokens + currentDungeonTokens
      // TODO UI
      // const prompt = new ui.OptionPrompt(
      //   'Congrats!',
      //   `Restart ${difficulty} Dungeon \nTokens Remaining: ${total}`,

      if (difficulty === 'Easy') {
        // resetCaveDungeons('easy')
      }

      if (difficulty === 'Medium') {
        // resetCaveDungeons('medium')
      }

      if (difficulty === 'Hard') {
        // resetCaveDungeons('hard')
      }

      if (difficulty === 'Nightmare') {
        // resetCaveDungeons('nightmare')
      }
      //   if (Player.globalHasSkillActive) {
      //     ui.displayAnnouncement("try again")
      //     door1.addComponentOrReplace(gltfShape1000)
      // } else {
      //     buildantrom2World()
      // }
      // TODO When ui is finished we need to have a look to og code cause it has 2 call backs and logic split
    }
  )

  // const d1animator = new Animator()

  // // Add animator component to the entity
  // door1.addComponent(d1animator)

  // // Instance animation clip object
  // const clipOpen = new AnimationState('open', { looping: false })
  // const clipClose = new AnimationState('close', { looping: false })
  // const idleClip = new AnimationState('idle', { looping: true })

  // // Add animation clip to Animator component
  // d1animator.addClip(clipOpen)
  // d1animator.addClip(clipClose)
  // d1animator.addClip(idleClip)

  // // Add entity to engine
  // entityController.addEntity(door1)

  // // Default Animation
  // idleClip.play()
}
