import { Transform } from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { LEVEL_TYPES } from '../player/LevelManager'
import { Player } from '../player/player'
import { BannerType } from '../ui/banner/bannerConstants'
import { ITEM_TYPES } from '../inventory/playerInventoryMap'
import { entityController } from '../realms/entityController'
import MonsterMobAuto from './monsterMobAuto'

function getRandomIntRange(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default class Executioner extends MonsterMobAuto {
  shapeFile = 'assets/models/ExecutionerAxe.glb'
  hoverText: string
  constructor() {
    const player = Player.getInstanceOrNull()
    const level = player?.levels.getLevel(LEVEL_TYPES.PLAYER) ?? 2
    super(level + 20, level + 60, level - 10, level * 100)
    this.minLuck = 10
    this.hoverText = `Attack LVL ${level} Executioner!`

    Transform.createOrReplace(this.entity, {
      position: Vector3.create(0, 0, 0)
    })
    this.initMonster()
    this.loadTransformation()
    // this.setTopOffset(2.55)
    this.dropRate = -1
  }

  onDropXp(): void {
    const player = Player.getInstance()
    const xp = getRandomIntRange(this.xp, this.xp + 10)
    const randomNumber = Math.random()
    if (randomNumber <= 0.1) {
      player.gameController.uiController.displayAnnouncement(
        '+1 POTIONS',
        Color4.Yellow(),
        3000
      )
      player.inventory.incrementItem(ITEM_TYPES.POTION, 1)
    }

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
    const loot = [
      {
        type: ITEM_TYPES.BONE,
        value: 1
      }
    ]

    player.gameController.uiController.displayBanner(BannerType.B_BONES)
    player.addRewards(exp, loot)

    // TODO
    // DailyQuestHUD.getInstance().listenAndUpdateForAnyActiveQuest(
    //     LEVEL_TYPES.ENEMY
    // )
  }

  setupAttackTriggerBox(): void {
    super.setupAttackTriggerBox()
  }

  loadTransformation(): void {
    const initialPosition = Vector3.create(
      getRandomIntRange(-24, -4),
      0,
      getRandomIntRange(10, -12)
    )
    const initialRotation = Quaternion.fromEulerDegrees(
      0,
      getRandomIntRange(0, 180),
      0
    )
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
    // TODO: this is not being added to the entities list
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newChar = new Executioner()
  }
}
