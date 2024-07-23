import { Transform, engine } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import MonsterMob from './MonsterMob'
import { LEVEL_TYPES } from '../player/LevelManager'
import { Player } from '../player/player'

function getRandomIntRange(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default class Executioner extends MonsterMob {
  shapeFile = 'assets/models/ExecutionerAxe.glb'
  hoverText: string

  minLuck = 10

  constructor() {
    const player = Player.getInstanceOrNull()
    const level = player?.levels.getLevel(LEVEL_TYPES.PLAYER) ?? 1
    super(level + 20, level + 60, level - 10, level * 10)
    this.hoverText = `Attack LVL ${level} Executioner!`

    Transform.createOrReplace(this.entity, {
      position: Vector3.create(0, 0, 0)
    })
    this.initMonster()
    this.loadTransformation()
    this.topOffSet = 2.55
    this.dropRate = -1
  }

  onDropXp(): void {
    // this.create()
    // const xp = getRandomIntRange(this.xp, this.xp + 10)
    // const randomNumber = Math.random()
    // if (randomNumber <= 0.1) {
    // ui.displayAnnouncement("+1 POTIONS")
    // player.inventory.incrementItem(ITEM_TYPES.POTION, 1)
    // }
    // const exp = [
    //   {
    //     type: LEVEL_TYPES.ENEMY,
    //     value: 1
    //   },
    //   {
    //     type: LEVEL_TYPES.PLAYER,
    //     value: xp
    //   }
    // ]
    // const loot = [
    //   {
    //     type: ITEM_TYPES.BONE,
    //     value: 1
    //   }
    // ]
    // UI
    // addRewards(exp, loot)
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
    const initialRotation = Quaternion.fromEulerDegrees(0, 80, 0)
    Transform.createOrReplace(this.entity, {
      position: initialPosition,
      rotation: initialRotation
    })
  }

  create(): void {}

  removeEntity(): void {
    engine.removeEntity(this.rangeAttackTrigger)
    engine.removeEntity(this.engageAttackTrigger)
    engine.removeEntity(this.attackTrigger)
    engine.removeEntity(this.healthBar)
    engine.removeEntity(this.label)
    engine.removeEntity(this.entity)
  }
}
