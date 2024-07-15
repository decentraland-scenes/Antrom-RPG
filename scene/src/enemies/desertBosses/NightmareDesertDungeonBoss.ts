import {
  GltfContainer,
  InputAction,
  MeshCollider,
  Transform,
  engine,
  pointerEventsSystem
} from '@dcl/sdk/ecs'
import MonsterOligar from '../monster'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { DungeonStage } from '../../counters'
import { player } from '../../player/player'
import { LEVEL_TYPES } from '../../player/LevelManager'
import { quest } from '../../utils/refresherTimer'
import { ITEM_TYPES } from '../playerInventoryMaps'

function getRandomIntRange(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default class NightmareDesertDungeonBoss extends MonsterOligar {
  shapeFile = 'assets/models/RockMonsterBoss.glb'
  hoverText = `Attack LVL ${DungeonStage.read()} NIGHTMARE Wasteland Apex Ahau!`

  minLuck = 50

  constructor(difficulty: number) {
    const stage = DungeonStage.read()
    super(
      600 + 75 * stage,
      player.levels.getLevel(LEVEL_TYPES.PLAYER) + 100,
      player.levels.getLevel(LEVEL_TYPES.PLAYER) + 5,
      750000 + 10000 * stage
    )

    this.initMonster()

    // TODO super.setupEngageTriggerBox(new utils.TriggerSphereShape(0))

    this.topOffSet = 4
    // # in %
    this.dropRate = -1
  }

  onDropXp(): void {
    const xp = getRandomIntRange(this.xp, this.xp + 10)
    quest.turnOffKingQuestTimer()
    const random = Math.random() * 1000

    switch (true) {
      case random < 200: {
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

      case random < 300: {
        // Additional 0.5% Chance (Cumulative 1% - 0.5% for the previous case)
        // TODO UI
        // confirmAndSendLootUI(
        //     "EPIC",
        //     "Wasteland Mage Pants",
        //     "0xa83c8951dd73843bf5f7e9936e72a345a3e79874:4",
        //     "wsp2",
        //     0,
        //     0,
        //     0,
        //     0,
        //     3
        // )
        break
      }

      case random < 400: {
        // 1% chance (2% cumulative - 1% previous)
        // TODO UI
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
      case random < 500: {
        // 1% chance (3% cumulative - 2% previous)
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
      case random < 600: {
        // 7% chance (10% cumulative - 3% previous)
        // TODO UI
        // confirmAndSendLootUI(
        //     "EPIC",
        //     "Wasteland Mage Helmet",
        //     "0xa83c8951dd73843bf5f7e9936e72a345a3e79874:5",
        //     "wsh2",
        //     0,
        //     0,
        //     0,
        //     0,
        //     3
        // )
        break
      }
      case random < 800: {
        // 10% chance (20% cumulative - 10% previous)
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

    void backToAntrom('Nightmare')
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

export async function backToAntrom(difficulty: string): Promise<void> {
  const door1 = engine.addEntity()
  Transform.create(door1, {
    position: Vector3.create(41.78, 2.39, 70.15),
    rotation: Quaternion.create(0, 0, 0, 1),
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
      quest.removeKingQuestTimer()
      engine.removeEntity(door1)
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
        // resetDesertDungeons('easy')
      }

      if (difficulty === 'Medium') {
        // resetDesertDungeons('medium')
      }

      if (difficulty === 'Hard') {
        // resetDesertDungeons('hard')
      }

      if (difficulty === 'Nightmare') {
        // resetDesertDungeons('nightmare')
      }
      //   if (Player.globalHasSkillActive) {
      //     ui.displayAnnouncement("try again")
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
  // engine.addEntity(door1)

  // // Default Animation
  // idleClip.play()
}
