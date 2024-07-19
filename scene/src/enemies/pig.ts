import { GltfContainer, Transform, engine } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { type GameController } from '../controllers/game.controller'
import { LEVEL_TYPES } from '../player/LevelManager'
import { Player } from '../player/player'
import { BannerType } from '../ui/banner/bannerConstants'
import { getRandomIntRange } from './../utils/getRandomInt'
import MonsterMeat from './monsterMeat'
import { ITEM_TYPES } from '../inventory/playerInventoryMap'

const DEFAULT_ATTACK = 2
const DEFAULT_XP = 10
const DEFAULT_LEVEL = 5
const DEFAULT_HP = 10

export default class Pig extends MonsterMeat {
  shapeFile = 'assets/models/pig.glb'

  // audioFile = "assets/sounds/chicken.mp3"
  hoverText = 'Attack Pig!'

  gameController: GameController

  constructor(gameController: GameController) {
    super(DEFAULT_ATTACK, DEFAULT_XP, DEFAULT_LEVEL, DEFAULT_HP, 1, 4)
    this.gameController = gameController
    this.initMonster()
    this.shape = this.shapeFile
    GltfContainer.createOrReplace(this.entity, { src: this.shape })
    this.isPrey = true
    this.minLuck = -1000
    this.loadTransformation()
    this.setupAttackTriggerBox()
    this.setTopOffset(1.2)
  }

  onDropXp(): void {
    this.gameController.uiController.displayBanner(BannerType.B_MEAT)
    const player = Player.getInstance()

    console.log('onDropXp - PIG')
    player.levels.addXp(
      LEVEL_TYPES.PLAYER,
      getRandomIntRange(this.xp, this.xp + 10)
    )

    player.levels.addXp(LEVEL_TYPES.MEAT, 1)
    this.gameController.uiController.displayBanner(BannerType.B_XP)

    console.log('onDrop - PIG')

    if (
      player.hasWearableEquipped('0x855ec57cc60c28187a021a3757a80ac4758e0b06:0')
    ) {
      player.inventory.incrementItem(ITEM_TYPES.CHICKEN, 4)
      this.gameController.uiController.displayBanner(BannerType.B_MEAT_PLUS)

      // TODO
      // DailyQuestHUD.getInstance().listenAndUpdateForAnyActiveQuest(
      //     ITEM_TYPES.CHICKEN,
      //     2
      // )
    } else {
      player.inventory.incrementItem(ITEM_TYPES.CHICKEN, 4)
      this.gameController.uiController.displayBanner(BannerType.B_MEAT)

      // TODO
      // DailyQuestHUD.getInstance().listenAndUpdateForAnyActiveQuest(
      //     ITEM_TYPES.CHICKEN,
      //     1
      // )
    }
  }

  async onDropLoot(): Promise<void> {}

  setupAttackTriggerBox(): void {
    super.setupAttackTriggerBox()
  }

  loadTransformation(): void {
    const initialPosition = Vector3.create(
      getRandomIntRange(-24, -4),
      0,
      getRandomIntRange(10, -12)
    )
    const initialRotation = Quaternion.fromEulerDegrees(0, 80, 0)
    Transform.createOrReplace(this.entity, {
      position: initialPosition,
      rotation: initialRotation
    })
  }

  removeEntity(): void {
    super.cleanup()
    engine.removeEntity(this.rangeAttackTrigger)
    engine.removeEntity(this.engageAttackTrigger)
    engine.removeEntity(this.entity)
  }
}
