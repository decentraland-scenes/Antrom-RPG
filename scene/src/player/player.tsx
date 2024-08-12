/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/ban-types */
import { engine, inputSystem, PointerEventType } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs from '@dcl/sdk/react-ecs'
import { getPlayer } from '@dcl/sdk/src/players'
import { type GameController } from '../controllers/game.controller'
import { Character } from '../enemies/character'
import { PlayerInventory } from '../inventory/playerInventory'
import BottomBar from '../ui/bottom-bar/bottomBar'
import {
  type CharacterAlliances,
  type CharacterClasses,
  type CharacterRaces
} from '../ui/creation-player/creationPlayerData'
import { setPlayerPosition } from '../utils/engine'
import { getRandomIntRange } from '../utils/getRandomInt'
import { INPUT_KEYS_ARRAY } from '../utils/ui-utils'
import { type buffItem, type Item, itemTypes } from './Items'
import LevelManager, { LEVEL_TYPES } from './LevelManager'
import { PetManager } from './petManager'
import { type MaybeSkill, type PlayerSkill } from './skills'
import { WearablesConfig } from './wearables-config'
import { ITEM_TYPES } from '../inventory/playerInventoryMap'

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
  private critRateBuff: number = 0
  private defBuff: number = 0
  private atkBuff: number = 0

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
  public inventory!: PlayerInventory
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
  public luckBuff!: number
  public critDamageBuff!: number
  public magicBuff!: number

  public petManager: PetManager
  public avatarModelList?: string[]

  // public healthBarNew: UIBarManager
  // public expBar: UIBarManager

  equiped: string = ITEM_GLBS.SWORD

  public race: number
  public class: CharacterClasses
  public alliance: number

  public skills: PlayerSkill = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  ]

  gameController: GameController

  static getInstance(): Player {
    if (!this.instance) {
      throw new Error('Player instance not created')
    }
    return this.instance
  }

  static getInstanceOrNull(): Player | null {
    if (!this.instance) {
      return null
    }
    return this.instance
  }

  static createInstance(self: Player): void {
    this.instance = self
  }

  static setGlobalHasSkill(value: boolean): void {
    Player.globalHasSkill = value
  }

  static setGlobalHasSkillActive(value: boolean): void {
    Player.globalHasSkillActive = value
  }

  constructor(
    gameController: GameController,
    race: CharacterRaces,
    playerClass: CharacterClasses,
    alliance: CharacterAlliances,
    attack: number = 1,
    xp: number = 0,
    level: number = 1,
    health: number = 100
  ) {
    super(attack, xp, level, health)
    this.race = race
    this.class = playerClass
    this.alliance = alliance
    this.levels = new LevelManager()
    this.levels.setLevel(LEVEL_TYPES.PLAYER, level, xp)
    this.inventory = new PlayerInventory()
    this.petManager = new PetManager()
    this.gameController = gameController

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

    engine.addSystem(this.process.bind(this))
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
    const treeCount = this.inventory.getItemCount(ITEM_TYPES.TREE)
    console.log(treeCount)
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

  updateHealthBar(): void {
    if (this.health > this.maxHealth) this.health = this.maxHealth
    this.checkHealth()
    // this.hpEvent(this.health, this.maxHealth)
    // StatusHUD.updateHp(this.health, this.maxHealth)
    // InventoryHUD.getInstance().pages[0].updateHp(
    //     this.health,
    //     this.maxHealth
    // )
  }

  updateXpBar(): void {}

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
        (this.atkBuff || 0) +
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

  get level(): number {
    return this.levels.getLevel(LEVEL_TYPES.PLAYER)
  }

  PlayerUI(): ReactEcs.JSX.Element {
    return (
      <BottomBar
        currentHpPercent={(100.0 * this.health) / this.maxHealth}
        levelXp={this.levels.getXpNeededThisLevel(LEVEL_TYPES.PLAYER)}
        currentXp={this.levels.getXpThisLevel(LEVEL_TYPES.PLAYER)}
        level={this.level}
        slotsData={this.skills}
      />
    )
  }

  updateCritRate(value: number): void {
    this.critRateBuff += value
  }

  updateMaxHp(value: number): void {
    this.maxHealth += value
  }

  updateDefBuff(value: number): void {
    this.defBuff += value
  }

  updateAtkBuff(value: number): void {
    this.atkBuff += value
  }

  updateMagic(value: number): void {
    this.magicBuff += value
  }

  updateLuckBuff(value: number): void {
    this.luckBuff += value
  }

  setSkill(index: number, skill: MaybeSkill): void {
    this.skills[index] = skill
  }

  getSkills(): MaybeSkill[] {
    return this.skills
  }

  removeSkill(skillName: string): void {
    const skillIndex = this.skills.findIndex(
      (skill) => skill?.definition.name === skillName
    )

    if (skillIndex !== -1) {
      this.skills[skillIndex] = undefined
    }
  }

  process(dt: number): void {
    this.skills.forEach((skill, index) => {
      if (skill) {
        if (
          inputSystem.isTriggered(
            INPUT_KEYS_ARRAY[index],
            PointerEventType.PET_DOWN
          )
        ) {
          skill.trigger()
        }

        skill.process(dt)
      }
    })
  }

  checkHealth(): boolean {
    if (this.health > 0) return false
    if (this.gameController.realmController.currentRealm === null) return false
    this.gameController.realmController.currentRealm.deadPosition()

    const telepPosition =
      this.gameController.realmController.currentRealm.deadPosition()
    if (telepPosition !== null) {
      setPlayerPosition(telepPosition.x, telepPosition.y, telepPosition.z)
    }
    if (this.gameController.realmController.currentRealm.getId() === 'antrom') {
      this.gameController.uiController.displayAnnouncement(
        'Back to training!',
        Color4.Yellow(),
        5000
      )
    }

    this.refillHealthBar()

    return true
  }

  hasWearableEquipped(wearableId: string): boolean {
    const player = getPlayer()
    for (const wearable of player?.wearables ?? []) {
      if (wearable === `urn:decentraland:matic:collections-v2:${wearableId}`) {
        console.log(`WEARABLES: ${wearable}`)
        return true
      }
    }
    return false
  }

  addRewards(
    exp: Array<{ type: LEVEL_TYPES; value: number }>,
    loot: Array<{ type: ITEM_TYPES; value: number }>
  ): void {
    const mainHUD = Player.getInstance().gameController.uiController.mainHud

    for (const i of exp) {
      this.levels.addXp(i.type, i.value)
      if (i.type === LEVEL_TYPES.PLAYER && mainHUD) {
        mainHUD.gainedXP = i.value
      }
    }
    for (const i of loot) {
      this.inventory.incrementItem(i.type, i.value)
    }
  }
}
