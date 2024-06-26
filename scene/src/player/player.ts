/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/ban-types */
import { type Item, type buffItem, itemTypes } from './Items'
import LevelManager from './LevelManager'
import { Character } from '../enemies/character'
import { PetManager } from './petManager'
import { LEVEL_TYPES } from '../enemies/types'
import { getRandomIntRange } from '../utils/getRandomInt'
import { WearablesConfig } from './wearables-config'

// health increase by 10%
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HEALTH_MULTIPLIER = 1.05
// attack increase by 20%
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ATTACK_MULTIPLIER = 1.11
enum ITEM_GLBS {
  SWORD = 'models/KnightSword.glb',
  AXE = 'models/KnightAxe.glb'
}

export class Player extends Character {
  static instance: Player
  static globalHasSkill: boolean = true
  static globalHasSkillActive: boolean = false

  // public attackAnimation?: () => void
  public questTime: number
  public lastLogin: number
  public username: string = ''
  public playerDataFetchError!: boolean
  public consecutiveLoginDays: number
  public items: Item[]
  // public inventory: PlayerInventory
  // public playerAvatar: PlayerAvatar

  public swordInventoryCount!: number

  // HSU
  // public HSU1InventoryCount: ui.UICounter

  // //HSU
  // public fmBodyInventoryCount: ui.UICounter
  // public fmHeadInventoryCount: ui.UICounter

  public polisher1!: number
  public polisher2!: number
  public polisher3!: number
  public polisher4!: number
  public polisherReward1!: number
  public polisherReward2!: number
  public polisherReward3!: number
  public polisherReward4!: number
  public isChoppingTree!: boolean
  public isShakingTree!: boolean
  public isFishing!: boolean
  public isMining!: boolean
  public levels: LevelManager
  // private swordUI: ui.SmallIcon
  // private shieldUI: ui.SmallIcon
  // private helmetUI: ui.SmallIcon
  // private defenseLabel: ui.CornerLabel
  public onInitDone?: (player: Player) => void
  public hasInit!: boolean
  public attackBuff!: number
  public luckBuff!: number
  public defBuff!: number
  public critRateBuff!: number
  public critDamageBuff!: number
  public magicBuff!: number

  public petManager: PetManager
  public avatarModelList?: string[]

  // public healthBarNew: UIBarManager
  // public expBar: UIBarManager

  public hpEvent!: Function
  public xpEvent!: Function
  public lvEvent!: Function
  equiped: string = ITEM_GLBS.SWORD
  public race!: number
  public class!: number
  public alliance!: number

  static getInstance(): Player {
    if (!this.instance) {
      this.instance = new this(1, 0, 1, 100)
    }
    return this.instance
  }

  static setGlobalHasSkill(value: boolean): void {
    Player.globalHasSkill = value
  }

  static setGlobalHasSkillActive(value: boolean): void {
    Player.globalHasSkillActive = value
  }

  constructor(attack: number, xp: number, level: number, health: number = 1) {
    super(attack, xp, level, health)
    this.levels = new LevelManager()
    this.levels.setLevel(LEVEL_TYPES.PLAYER, level, xp)
    // this.inventory = new PlayerInventory()
    this.petManager = new PetManager()

    this.avatarModelList = ['models/BaseCharacter.glb']

    this.levels.onUpdate = ({ type, level, xp, total, levelChange }) => {
      switch (type) {
        case LEVEL_TYPES.PLAYER:
          if (levelChange) {
            // this.handlePlayerLevelUp(level)
          } else {
            this.updateXpBar()
          }
      }
      // TODO api
      // this.writeDataToServer()
    }
    // TODO UIs
    // this.fmBodyInventoryCount = new ui.UICounter(
    //     0,
    //     -6000,
    //     410,
    //     Color4.Yellow(),
    //     40
    // )
    // this.fmHeadInventoryCount = new ui.UICounter(
    //     0,
    //     -6000,
    //     410,
    //     Color4.Yellow(),
    //     40
    // )

    // this.swordInventoryCount = 0
    // this.bossKill2InventoryCount = new ui.UICounter(
    //     this.level,
    //     -200,
    //     620,
    //     Color4.Red(),
    //     40
    // )
    // this.bossKill2InventoryCount.hide()

    this.items = []

    // this.defenseLabel = new ui.CornerLabel(``, -8850, 0)
    // this.defenseLabel.hide()
    this.luckBuff = 0
    this.critRateBuff = 1
    this.critDamageBuff = 100
    this.attackBuff = 0
    this.magicBuff = 0
    this.defBuff = 0
    this.lastLogin = 0
    this.consecutiveLoginDays = 0
    this.questTime = 99999
    // this.lvEvent(this.level)
    // StatusHUD.updateLv(this.level)
    // executeTask(async () => {
    //     await WriteUserUsername()
    // })
  }

  // async CreatePlayerAvatar(shape?: GLTFShape) {
  //     const { userId } = await getUserData()
  //     this.playerAvatar = new PlayerAvatar(
  //         userId,
  //         shape || new GLTFShape("models/Knight.glb")
  //     )
  // }

  // SwapModel(shape: GLTFShape) {
  //     if (this.playerAvatar) {
  //         this.playerAvatar.swapModel(shape)
  //     } else {
  //         executeTask(() => this.CreatePlayerAvatar(shape))
  //     }
  // }

  getDefensePercent(): number {
    const defense =
      super.getDefensePercent() + this.defBuff ||
      0 +
        this.items.reduce((accm, item: Item) => {
          const buff: buffItem[] | buffItem = item.buff

          if (item.type === itemTypes.SHIELD) {
            if (Array.isArray(buff)) {
              const wearable = WearablesConfig.mapping[item.name]
              if (
                wearable?.duplicates !== undefined &&
                wearable.duplicates > 0 &&
                wearable.dStats?.defBuff
              )
                accm += wearable.dStats.defBuff * wearable.duplicates
              const b = buff.find((buff) => buff.type)
              if (b) {
                return accm + b.value
              }
              return accm
            }
            return accm + buff.value
          }
          return accm
        }, 0)
    const safeDefense = defense >= 1 ? 0.99 : defense
    // const percentageDef = safeDefense * 100
    // TODO UI
    // this.defenseLabel.set(`Player Defense: ${percentageDef}%`)
    // setTimeout(2000, () => this.defenseLabel.hide())
    // this.defenseLabel.show()
    return safeDefense
  }

  attackAnimation(): void {
    // console.log("attack animation")
    // this.playerAvatar?.playAttack()
  }

  impactAnimation(): void {
    // console.log("attack animation")
    // this.playerAvatar?.playImpact()
  }

  addAvatarModel(model: string, weight: number = 0): void {
    // this.avatarModelList.push(model)
    // executeTask(() => AddAvatarModels(model, weight))
  }

  getLuckRange(): number {
    return super.getLuckRange() + this.getLuckBuffs()
  }

  getLuckBuffs(): number {
    return (
      this.luckBuff +
      this.items.reduce((accm, item: Item) => {
        const buff: buffItem[] | buffItem = item.buff
        if (item.type === itemTypes.HELMET) {
          if (Array.isArray(buff)) {
            const wearable = WearablesConfig.mapping[item.name]
            if (
              wearable?.duplicates !== undefined &&
              wearable.duplicates > 0 &&
              wearable.dStats?.luckBuff
            )
              accm += wearable.dStats.luckBuff * wearable.duplicates
            const b = buff.find((buff) => buff.type)
            if (b) {
              return accm + b.value
            }
            return accm
          }
          return accm + buff.value
        }
        return accm
      }, 0)
    )
  }

  getCritRate(): number {
    return this.critRateBuff
  }

  getCritDamage(): number {
    return this.critDamageBuff
  }

  getMagic(isCriticalAttack: boolean = false): number {
    return (
      (this.magic +
        (this.magicBuff || 0) +
        this.items.reduce((accm, item: Item) => {
          const buff: buffItem[] | buffItem = item.buff
          if (item.type === itemTypes.SWORD) {
            const wearable = WearablesConfig.mapping[item.name]
            if (
              wearable?.duplicates !== undefined &&
              wearable.duplicates > 0 &&
              wearable.dStats?.magicBuff
            ) {
              accm += wearable.dStats.magicBuff * wearable.duplicates
            }
            if (Array.isArray(buff)) {
              const b = buff.find((buff) => buff.type)
              if (b) {
                return accm + b.value
              }
              return accm
            }
            return accm + (buff ? buff.value : 0)
          }
          return accm
        }, 0)) *
      (isCriticalAttack ? 2 : 1) // remove this if magic cannot crit
    )
  }

  chopTree(): void {
    // const treeCount = this.inventory.getItemCount(ITEM_TYPES.TREE)
    // console.log(treeCount)
  }

  reduceHealth(attack: number): void {
    super.reduceHealth(attack)
    this.updateHealthBar()
  }

  refillHealthBar(percentage = 1, playAnimation = true): void {
    this.health += this.maxHealth * percentage
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth
    }
    this.updateHealthBar()

    if (playAnimation) {
      // applyHealToLocation(Camera.instance.feetPosition) ??
    }
  }

  heal(absorbedHealth: number): void {
    this.health += absorbedHealth
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth
    }
    this.updateHealthBar()
    // ui.displayAnnouncement(heal ${absorbedHealth})

    // Optionally, apply healing animation
    // applyHealToLocation(Camera.instance.feetPosition) ??
  }

  depleteHealthBar(percentage = 1): void {
    this.health -= this.maxHealth * percentage
    // if (this.health > this.maxHealth) {
    //     this.health = this.maxHealth
    // }
    this.updateHealthBar()
  }

  getLevel(): number {
    return this.level
  }

  subscribeHpEvent(f: Function): void {
    this.hpEvent = f
  }

  subscribeXpEvent(f: Function): void {
    this.xpEvent = f
  }

  subscribeLvEvent(f: Function): void {
    this.lvEvent = f
  }

  updateHealthBar(): void {
    if (this.health > this.maxHealth) this.health = this.maxHealth
    this.hpEvent(this.health, this.maxHealth)
    // StatusHUD.updateHp(this.health, this.maxHealth)
    // InventoryHUD.getInstance().pages[0].updateHp(
    //     this.health,
    //     this.maxHealth
    // )
  }

  updateXpBar(): void {
    const level = this.levels.getLevel(LEVEL_TYPES.PLAYER)
    this.xpEvent(
      this.levels.getXp(LEVEL_TYPES.PLAYER) -
        (level > 1 ? LevelManager.xpRequiredForNextLevel(level - 1) : 0),
      LevelManager.xpRequiredForNextLevel(level) -
        (level > 1 ? LevelManager.xpRequiredForNextLevel(level - 1) : 0)
    )
  }

  rollDice(): number {
    const max = 20 + this.levels.getLevel(LEVEL_TYPES.PLAYER) / 2
    const min = (this.getLuckBuffs() / 100) * max

    const randomNumber = getRandomIntRange(Math.round(min), Math.round(max))

    // const value2 = this.getLuckBuffs() / 2

    return randomNumber
  }

  getPlayerAttack(isCriticalAttack = false): number {
    return (
      (this.attack +
        (this.attackBuff || 0) +
        this.items.reduce((accm, item: Item) => {
          const buff: buffItem[] | buffItem = item.buff
          if (item.type === itemTypes.SWORD) {
            const wearable = WearablesConfig.mapping[item.name]
            if (
              wearable?.duplicates !== undefined &&
              wearable.duplicates > 0 &&
              wearable.dStats?.attackBuff
            ) {
              accm += wearable.dStats.attackBuff * wearable.duplicates
            }
            if (Array.isArray(buff)) {
              const b = buff.find((buff) => buff.type)
              if (b) {
                return accm + b.value
              }
              return accm
            }
            return accm + (buff ? buff.value : 0)
          }
          return accm
        }, 0)) *
      (isCriticalAttack ? 1 + this.critDamageBuff / 100 : 1)
    )
  }
}
export const player = Player.getInstance()
