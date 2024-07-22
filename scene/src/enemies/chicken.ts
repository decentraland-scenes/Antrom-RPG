import { Quaternion, Vector3 } from '@dcl/sdk/math'
import MonsterMeat from './monsterMeat'
import { GltfContainer, Transform } from '@dcl/sdk/ecs'
import { getRandomInt, getRandomIntRange } from './../utils/getRandomInt'
import { Player } from '../player/player'
import { LEVEL_TYPES } from '../player/LevelManager'
import { BannerType } from '../ui/banner/bannerConstants'
import { ITEM_TYPES } from '../inventory/playerInventoryMap'
import { entityController } from '../realms/entityController'

const DEFAULT_ATTACK = 0
const DEFAULT_XP = 9
const DEFAULT_LEVEL = 0
const DEFAULT_HP = 1

export default class Chicken extends MonsterMeat {
  shapeFile = 'assets/models/chicken.glb'

  // audioFile = "assets/sounds/chicken.mp3"
  hoverText = 'Attack Chicken!'

  constructor() {
    super(DEFAULT_ATTACK, DEFAULT_XP, DEFAULT_LEVEL, DEFAULT_HP, 1, 4, 1)
    this.initMonster()
    this.loadTransformation()
    this.shape = this.shapeFile
    GltfContainer.createOrReplace(this.entity, { src: this.shape })
    this.isPrey = true
    this.minLuck = -1000
  }

  onDropXp(): void {
    const player = Player.getInstance()
    player.gameController.uiController.displayBanner(BannerType.B_MEAT)

    console.log('onDropXp - Chicken')
    if (player.levels.getLevel(LEVEL_TYPES.PLAYER) <= 5) {
      player.levels.addXp(LEVEL_TYPES.PLAYER, 20)
    } else {
      player.levels.addXp(LEVEL_TYPES.PLAYER, this.xp)
    }

    player.levels.addXp(LEVEL_TYPES.MEAT, 1)
    player.gameController.uiController.displayBanner(BannerType.B_XP)

    console.log('onDrop - Chicken')

    if (
      player.hasWearableEquipped('0x855ec57cc60c28187a021a3757a80ac4758e0b06:0')
    ) {
      player.inventory.incrementItem(ITEM_TYPES.CHICKEN, 2)
      player.gameController.uiController.displayBanner(BannerType.B_MEAT_PLUS)

      // TODO
      // DailyQuestHUD.getInstance().listenAndUpdateForAnyActiveQuest(
      //     ITEM_TYPES.CHICKEN,
      //     2
      // )
    } else {
      player.inventory.incrementItem(ITEM_TYPES.CHICKEN, 2)
      player.gameController.uiController.displayBanner(BannerType.B_MEAT)

      // TODO
      // DailyQuestHUD.getInstance().listenAndUpdateForAnyActiveQuest(
      //     ITEM_TYPES.CHICKEN,
      //     1
      // )
    }

    if (getRandomInt(10) === 1) {
      player.inventory.incrementItem(ITEM_TYPES.EGG)
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
    entityController.removeEntity(this.rangeAttackTrigger)
    entityController.removeEntity(this.engageAttackTrigger)
    entityController.removeEntity(this.entity)
  }

  create(): void {
    // TODO
  }
}
