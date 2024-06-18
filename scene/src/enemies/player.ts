// import { Character } from './character'

// // WORK IN PROGRESS

// // health increase by 10%
// const HEALTH_MULTIPLIER = 1.05
// // attack increase by 20%
// const ATTACK_MULTIPLIER = 1.11
// enum ITEM_GLBS {
//   SWORD = 'assets/models/KnightSword.glb',
//   AXE = 'assets/models/KnightAxe.glb'
// }

// export class Player extends Character {
//   static instance: Player
//   static globalHasSkill: boolean = true
//   static globalHasSkillActive: boolean = false

//   // public attackAnimation?: () => void
//   public questTime: number
//   public lastLogin: number
//   public username: string = ''
//   public playerDataFetchError!: boolean
//   public consecutiveLoginDays: number
//   // public items: Item[]
//   // public inventory: PlayerInventory
//   // public playerAvatar: PlayerAvatar

//   public swordInventoryCount: number

//   // HSU
//   // public HSU1InventoryCount: ui.UICounter

//   // //HSU
//   // public fmBodyInventoryCount: ui.UICounter
//   // public fmHeadInventoryCount: ui.UICounter

//   public polisher1: number
//   public polisher2: number
//   public polisher3: number
//   public polisher4: number
//   public polisherReward1: number
//   public polisherReward2: number
//   public polisherReward3: number
//   public polisherReward4: number
//   public bossKill2InventoryCount: ui.UICounter
//   public isChoppingTree: boolean
//   public isShakingTree: boolean
//   public isFishing: boolean
//   public isMining: boolean
//   public levels: LevelManager
//   private readonly swordUI: ui.SmallIcon
//   private readonly shieldUI: ui.SmallIcon
//   private readonly helmetUI: ui.SmallIcon
//   private readonly defenseLabel: ui.CornerLabel
//   public onInitDone: (player: Player) => void
//   public hasInit: boolean
//   public attackBuff?: number
//   public luckBuff?: number
//   public defBuff?: number
//   public critRateBuff?: number
//   public critDamageBuff?: number
//   public magicBuff?: number

//   public petManager: PetManager
//   public avatarModelList?: string[]

//   // public healthBarNew: UIBarManager
//   // public expBar: UIBarManager

//   public hpEvent: Function
//   public xpEvent: Function
//   public lvEvent: Function
//   equiped: string = ITEM_GLBS.SWORD
//   public race: number
//   public class: number
//   public alliance: number

//   static getInstance(): Player {
//     if (!this.instance) {
//       this.instance = new this(1, 0, 1, 100)
//     }
//     return this.instance
//   }

//   static setGlobalHasSkill(value: boolean) {
//     Player.globalHasSkill = value
//   }

//   static setGlobalHasSkillActive(value: boolean) {
//     Player.globalHasSkillActive = value
//   }

//   constructor(attack: number, xp: number, level: number, health: number = 1) {
//     super(attack, xp, level, health)
//     this.levels = new LevelManager()
//     this.levels.setLevel(LEVEL_TYPES.PLAYER, level, xp)
//     this.inventory = new PlayerInventory()
//     this.petManager = new PetManager()

//     this.avatarModelList = ['assets/models/BaseCharacter.glb']

//     this.levels.onUpdate = ({ type, level, xp, total, levelChange }) => {
//       switch (type) {
//         case LEVEL_TYPES.PLAYER:
//           if (levelChange) {
//             this.handlePlayerLevelUp(level)
//           } else {
//             this.updateXpBar()
//           }
//           return
//       }
//       this.writeDataToServer()
//     }

//     this.fmBodyInventoryCount = new ui.UICounter(
//       0,
//       -6000,
//       410,
//       Color4.Yellow(),
//       40
//     )
//     this.fmHeadInventoryCount = new ui.UICounter(
//       0,
//       -6000,
//       410,
//       Color4.Yellow(),
//       40
//     )

//     this.swordInventoryCount = 0
//     this.bossKill2InventoryCount = new ui.UICounter(
//       this.level,
//       -200,
//       620,
//       Color4.Red(),
//       40
//     )
//     this.bossKill2InventoryCount.hide()

//     this.items = []

//     this.defenseLabel = new ui.CornerLabel(``, -8850, 0)
//     this.defenseLabel.hide()
//     this.luckBuff = 0
//     this.critRateBuff = 1
//     this.critDamageBuff = 100
//     this.attackBuff = 0
//     this.magicBuff = 0
//     this.defBuff = 0
//     this.lastLogin = 0
//     this.consecutiveLoginDays = 0
//     this.questTime = 99999
//     // this.lvEvent(this.level)
//     StatusHUD.updateLv(this.level)
//     executeTask(async () => {
//       await WriteUserUsername()
//     })
//   }

//   async CreatePlayerAvatar(shape?: GLTFShape) {
//     const { userId } = await getUserData()
//     this.playerAvatar = new PlayerAvatar(
//       userId,
//       shape || new GLTFShape('assets/models/Knight.glb')
//     )
//   }

//   SwapModel(shape: GLTFShape) {
//     if (this.playerAvatar) {
//       this.playerAvatar.swapModel(shape)
//     } else {
//       executeTask(async () => {
//         await this.CreatePlayerAvatar(shape)
//       })
//     }
//   }

//   getDefensePercent(): number {
//     const defense =
//       super.getDefensePercent() + this.defBuff ||
//       0 +
//         this.items.reduce((accm, item: Item) => {
//           const buff: buffItem[] | buffItem = item.buff

//           if (item.type === itemTypes.SHIELD) {
//             if (Array.isArray(buff)) {
//               const wearable = WearablesConfig.mapping[item.name]
//               if (
//                 wearable &&
//                 wearable.duplicates !== undefined &&
//                 wearable.duplicates > 0 &&
//                 wearable.dStats?.defBuff
//               )
//                 accm += wearable.dStats.defBuff * wearable.duplicates
//               // @ts-expect-error
//               const b = buff.find((buff) => buff.type)
//               if (b) {
//                 return accm + b.value
//               }
//               return accm
//             }
//             return accm + buff.value
//           }
//           return accm
//         }, 0)
//     const safeDefense = defense >= 1 ? 0.99 : defense
//     const percentageDef = safeDefense * 100
//     this.defenseLabel.set(`Player Defense: ${percentageDef}%`)
//     setTimeout(2000, () => this.defenseLabel.hide())
//     this.defenseLabel.show()
//     return safeDefense
//   }

//   attackAnimation() {
//     // log("attack animation")
//     this.playerAvatar?.playAttack()
//   }

//   impactAnimation() {
//     // log("attack animation")
//     this.playerAvatar?.playImpact()
//   }

//   addAvatarModel(model: string, weight: number = 0) {
//     this.avatarModelList.push(model)
//     executeTask(() => AddAvatarModels(model, weight))
//   }
// }
