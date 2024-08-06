/* eslint-disable @typescript-eslint/no-loss-of-precision */
import * as utils from '@dcl-sdk/utils'
import { engine } from '@dcl/ecs/dist/runtime/initialization'
import {
  Animator,
  AudioSource,
  GltfContainer,
  InputAction,
  Material,
  MeshCollider,
  MeshRenderer,
  PointerEventType,
  PointerEvents,
  Transform,
  inputSystem
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import * as npc from 'dcl-npc-toolkit'
import { openDialogWindow } from 'dcl-npc-toolkit'
import { openExternalUrl } from '~system/RestrictedActions'
import { GetPlayerDungeonEasyLeaderBoard } from '../api/api'
import { type GameController } from '../controllers/game.controller'
import {
  garrisonCreatedOnce,
  jailGuards,
  jailKey,
  jailOpenOnce,
  trewsKill
} from '../counters'
import Chicken from '../enemies/chicken'
import Executioner from '../enemies/Executioner'
import Pig from '../enemies/pig'
import { setCurrentActiveScene } from '../instances'
import { LeaderBoard } from '../leaderboard/leaderboard'
import { BerryTree, Items, Rock, Tree } from '../mineables'
import { setPlayerPosition } from '../utils/engine'
import BetaBoss1 from '../enemies/betaBosses/betaBoss1'
import { type RealmType, type Realm } from './types'
import { entityController } from './entityController'
import Minion from '../enemies/hardDungeons/DungeonBossHelp'

export class Antrom implements Realm {
  // BuildBuilderSceneAntrom
  private readonly boardParent = entityController.addEntity()
  private readonly leaderBoard: LeaderBoard
  private readonly dungeonDoor = entityController.addEntity()
  private readonly tz_bersekerUpgradeMarket = entityController.addEntity()
  private readonly tz_resourceMarket = entityController.addEntity()
  private readonly tz_rangerUpgradeMarket = entityController.addEntity()
  private readonly tz_mageUpgradeMarket = entityController.addEntity()
  private readonly tz_apprenticeMarket = entityController.addEntity()
  private readonly tz_skillChange = entityController.addEntity()
  private readonly tz_magicalItemsMarketHUD = entityController.addEntity()
  private readonly tz_dailyRewards = entityController.addEntity()
  private readonly furanceUpgrade = entityController.addEntity()
  private readonly cellDoor = entityController.addEntity()
  private readonly cellEntranceDoor = entityController.addEntity()
  private readonly tavernDoor = entityController.addEntity()
  private readonly heavyGrinderCrown = entityController.addEntity()
  private readonly skybox = entityController.addEntity()
  private readonly campFire = entityController.addEntity()
  // Build the World
  private readonly antromForestTest = entityController.addEntity()
  private readonly antromCavesTest = entityController.addEntity()
  private readonly antromCastleTest = entityController.addEntity()
  private readonly antromColliderTest = entityController.addEntity()
  private readonly antromCastle2Test = entityController.addEntity()
  // Antrom NPC's
  private npc_TownHallWizard = entityController.addEntity()
  private npc_Witch = entityController.addEntity()
  private npc_Witch2 = entityController.addEntity()
  private npc_Vendor = entityController.addEntity()
  public npc_KingGeraldOld = entityController.addEntity()
  private readonly npc_Guyonknees = entityController.addEntity()
  private npc_RandomVillager1 = entityController.addEntity()
  private npc_RandomVillager2 = entityController.addEntity()
  private npc_RandomVillager3 = entityController.addEntity()
  private npc_RandomVillager4 = entityController.addEntity()
  private npc_RandomVillager5 = entityController.addEntity()
  private npc_RandomVillager6 = entityController.addEntity()
  private npc_RandomVillager7 = entityController.addEntity()
  private npc_RandomVillager8 = entityController.addEntity()
  private npc_RandomVillager9 = entityController.addEntity()
  private npc_RandomVillager10 = entityController.addEntity()
  private readonly npc_RandomVillager11 = entityController.addEntity()
  // Mineables
  private readonly rocks: Rock[]
  private readonly trees: Tree[]
  private readonly berryTrees: BerryTree[]
  // Enemies
  private readonly executioners: Executioner[]
  private readonly pigs: Pig[]
  private readonly chickens: Chicken[]
  public butcher!: BetaBoss1
  public jailGuard1!: Minion
  public jailGuard2!: Minion

  // Controllers
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.executioners = []
    this.pigs = []
    this.chickens = []

    GltfContainer.createOrReplace(this.antromForestTest, {
      src: 'assets/models/Antrom/AntromForestTest.glb'
    })
    GltfContainer.createOrReplace(this.antromCavesTest, {
      src: 'assets/models/Antrom/AntromCavesTest.glb'
    })
    GltfContainer.createOrReplace(this.antromCastleTest, {
      src: 'assets/models/Antrom/AntromCastleTest.glb'
    })
    GltfContainer.createOrReplace(this.antromColliderTest, {
      src: 'assets/models/Antrom/AntromColliderTest.glb'
    })
    GltfContainer.createOrReplace(this.antromCastle2Test, {
      src: 'assets/models/Antrom/AntromCastle2Test.glb'
    })
    GltfContainer.createOrReplace(this.skybox, {
      src: 'assets/models/TreesSkybox.glb'
    })
    Transform.createOrReplace(this.antromForestTest, {
      position: Vector3.create(16, 0, 16),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1)
    })
    Transform.createOrReplace(this.boardParent, {
      position: Vector3.create(-45.59, 13.32, -61.18),
      rotation: Quaternion.create(0, 1, 0, 0)
    })
    this.leaderBoard = new LeaderBoard()
    utils.timers.setInterval(() => {
      this.updateBoard().catch((error: Error) => {
        console.log(error)
      })
    }, 2000)
    Animator.create(this.antromForestTest, {
      states: [
        {
          clip: 'idle',
          playing: false,
          loop: true
        }
      ]
    })
    Animator.create(this.antromCavesTest, {
      states: [
        {
          clip: 'idle',
          playing: false,
          loop: true
        }
      ]
    })
    Animator.create(this.antromCastleTest, {
      states: [
        {
          clip: 'idle',
          playing: false,
          loop: true
        }
      ]
    })
    Animator.create(this.antromColliderTest, {
      states: [
        {
          clip: 'idle',
          playing: false,
          loop: true
        }
      ]
    })
    Animator.create(this.antromCastle2Test, {
      states: [
        {
          clip: 'idle',
          playing: false,
          loop: true
        }
      ]
    })
    Animator.playSingleAnimation(this.antromForestTest, 'idle')
    Animator.playSingleAnimation(this.antromCavesTest, 'idle')
    Animator.playSingleAnimation(this.antromCastleTest, 'idle')
    Animator.playSingleAnimation(this.antromColliderTest, 'idle')
    Animator.playSingleAnimation(this.antromCastle2Test, 'idle')

    Transform.create(this.antromCavesTest, { parent: this.antromForestTest })
    Transform.create(this.antromCastleTest, { parent: this.antromForestTest })
    Transform.create(this.antromColliderTest, { parent: this.antromForestTest })
    Transform.create(this.antromCastle2Test, { parent: this.antromForestTest })
    Transform.create(this.skybox, { parent: this.antromForestTest })

    this.rocks = [
      new Rock(this.gameController, Items.rock, 58.79, 1.26, -50.96),
      new Rock(this.gameController, Items.rock, 50.85, 1.26, -45.08),
      new Rock(this.gameController, Items.rock, 49.09, 1.26, -54.18),
      new Rock(this.gameController, Items.rock, 52.56, 1.26, -23.76),
      new Rock(this.gameController, Items.rock, 83.12, 1.26, -28.51),
      new Rock(this.gameController, Items.rock, 85.94, 1.26, -15.38),
      new Rock(this.gameController, Items.rock, 74.72, 1.26, -12.42),
      new Rock(this.gameController, Items.rock, 55.71, 1.26, -38.81),
      new Rock(this.gameController, Items.rock, 81.29, 1.26, -54.54),
      new Rock(this.gameController, Items.rock, 84.09, 1.26, -39.22),
      new Rock(this.gameController, Items.rock, 90.35, 1.26, -49.22),
      new Rock(this.gameController, Items.rock, 70.79, 1.26, -61.73),
      new Rock(this.gameController, Items.rock, 37.59, 4.64, -32.27),
      new Rock(this.gameController, Items.rock, 28.28, 4.34, -28.64),
      new Rock(this.gameController, Items.rock, 28.65, 4.49, -19.29),
      new Rock(this.gameController, Items.rock, 26.89, 5.32, -15.34),
      new Rock(this.gameController, Items.rock, 44.78, 7.41, 18.91),
      new Rock(this.gameController, Items.rock, 46.4, 3.76, 52.16),
      new Rock(this.gameController, Items.rock, 51.94, 4.29, 56.65),
      new Rock(this.gameController, Items.rock, 50.93, 4.48, 58.95),
      new Rock(this.gameController, Items.rock, 46.97, 4.25, 57.51),
      new Rock(this.gameController, Items.rock, 46.97, 4.25, 57.51),
      new Rock(this.gameController, Items.rock, 65.85, 4.08, 62.56),
      new Rock(this.gameController, Items.rock, 81.78, 1.26, -13.03),
      new Rock(this.gameController, Items.rock, 86.76, 1.26, -19.71),
      new Rock(this.gameController, Items.rock, 58.82, 1.26, -55.88),
      new Rock(this.gameController, Items.rock, -36.48, 1.43, 40.66),
      new Rock(this.gameController, Items.rock, -42.15, 0.91, 37.1),
      new Rock(this.gameController, Items.rock, -49.72, 0.94, 41.47),
      new Rock(this.gameController, Items.rock, -34.41, 1.72, 41.06)
    ]

    this.trees = [
      new Tree(this.gameController, Items.tree, 68.22, 4.23, 37.68),
      new Tree(this.gameController, Items.tree, 73.37, 4.23, 37.98),
      new Tree(this.gameController, Items.tree, 80.37, 4.64, 36.38),
      new Tree(this.gameController, Items.tree, 89.51, 4.77, 35.48),
      new Tree(this.gameController, Items.tree, 90.65, 5.23, 30.45),
      new Tree(this.gameController, Items.tree, 90.55, 4.62, 36.34),
      new Tree(this.gameController, Items.tree, 90.49, 5.25, 30.19),
      new Tree(this.gameController, Items.tree, 91.11, 5.73, 22.33),
      new Tree(this.gameController, Items.tree, 89.4, 6.24, 18.29),
      new Tree(this.gameController, Items.tree, 83.85, 6.3, 14.67),
      new Tree(this.gameController, Items.tree, 78.96, 6.43, 10.42),
      new Tree(this.gameController, Items.tree, 73.12, 6.14, 9.67),
      new Tree(this.gameController, Items.tree, 71.09, 5.95, 14.23),
      new Tree(this.gameController, Items.tree, 66.51, 5.83, 18.53),
      new Tree(this.gameController, Items.tree, 65.46, 5.51, 22.22),
      new Tree(this.gameController, Items.tree, 71.52, 5.42, 21.97),
      new Tree(this.gameController, Items.tree, 79.16, 5.0, 34.28),
      new Tree(this.gameController, Items.tree, 68.49, 3.64, 42.92),
      new Tree(this.gameController, Items.tree, 64.66, 4.09, 41.6),
      new Tree(this.gameController, Items.tree, 69.33, 4.19, 37.98),
      new Tree(this.gameController, Items.tree, 32.38, 3.31, 30.82),
      new Tree(this.gameController, Items.tree, 39.0, 3.73, 34.3),
      new Tree(this.gameController, Items.tree, 44.22, 4.36, 36.58),
      new Tree(this.gameController, Items.tree, 50.6, 4.22, 39.34),
      new Tree(this.gameController, Items.tree, 58.23, 4.3, 41.14),
      new Tree(this.gameController, Items.tree, 52.7, 4.54, 37.22),
      new Tree(this.gameController, Items.tree, 47.38, 4.98, 34.14),
      new Tree(this.gameController, Items.tree, 40.76, 4.4, 31.16),
      new Tree(this.gameController, Items.tree, 32.67, 4.07, 27.09),
      new Tree(this.gameController, Items.tree, 26.12, 4.33, 21.41),
      new Tree(this.gameController, Items.tree, 91.26, 6.91, 12.97),
      new Tree(this.gameController, Items.tree, 86.65, 6.9, 10.55),
      new Tree(this.gameController, Items.tree, 81.3, 7.06, 5.46),
      new Tree(this.gameController, Items.tree, 87.76, 7.7, 5.06),
      new Tree(this.gameController, Items.tree, 88.3, 5.32, 32.47),
      new Tree(this.gameController, Items.tree, 55.47, 5.75, 28.67)
    ]

    this.berryTrees = [
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree),
      new BerryTree(this.gameController, Items.berryTree)
    ]
    for (let i = 0; i < 6; i++) {
      this.executioners.push(new Executioner())
    }

    for (let i = 0; i < 4; i++) {
      this.pigs.push(new Pig(this.gameController))
    }
    for (let i = 0; i < 8; i++) {
      this.chickens.push(new Chicken())
    }
    this.AntromNPCs()
    this.DungeonDoor()
    this.createTriggerZoneForBerserkerUpgradeMarket()
    this.createTriggerZoneForResourceMarket()
    this.createTriggerZoneForRangerUpgradeMarket()
    this.createTriggerZoneForMageUpgradeMarket()
    this.createTriggerZoneForApprenticeMarket()
    this.createTriggerZoneForSkillChange()
    this.createTriggerZoneForMagicalItemsMarketHUD()
    this.createTriggerZoneFoDailyRewards()
    this.createCellDoors()
    this.createCellEntranceDoors()
    this.createTavernDoor()
    this.createHeavyGrinderCrown()
    this.createCampfireA()
  }

  async updateBoard(): Promise<void> {
    const scoreData: any = await GetPlayerDungeonEasyLeaderBoard()
    if (scoreData.dungeon_action_easy !== undefined) {
      const data = [...scoreData.dungeon_action_easy]
      data.sort((a, b) => b.dungeons_completed - a.dungeons_completed)
      const topTen = data.slice(0, 10)
      this.leaderBoard
        .buildLeaderBoard(topTen, this.boardParent, 10)
        .catch((error: Error) => {
          console.log(error)
        })
    }
  }

  AntromNPCs(): void {
    this.npc_TownHallWizard = npc.create(
      {
        position: Vector3.create(-33.81, 9.55, -26.69),
        rotation: Quaternion.create(0, 90, 0, 1),
        scale: Vector3.create(
          1.2069778442382812,
          1.2069778442382812,
          1.2069778442382812
        )
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/Alchemist.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.npc_TownHallWizard,
            this.gameController.dialogs.wizardDialog
          )
        },
        onWalkAway: () => {},
        hoverText: 'Leofwine the wizard',
        portrait: 'assets/images/pfp/alchemist.png',
        bubbleHeight: 120,
        bubbleXOffset: 5,
        faceUser: true,
        reactDistance: 3,
        onlyClickTrigger: true
      }
    )
    this.npc_Witch = npc.create(
      {
        position: Vector3.create(-27.99, 4.24, -23.31),
        rotation: Quaternion.create(0, 1, 0, 1),
        scale: Vector3.create(
          1.2069778442382812,
          1.2069778442382812,
          1.2069778442382812
        )
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/Witch.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.npc_Witch,
            this.gameController.dialogs.witchDialog
          )
        },
        onWalkAway: () => {},
        hoverText: 'Witch',
        portrait: 'assets/images/pfp/witch.png',
        bubbleHeight: 120,
        bubbleXOffset: 5,
        faceUser: true,
        onlyClickTrigger: true
      }
    )
    this.npc_Witch2 = npc.create(
      {
        position: Vector3.create(-38.8, 9.63, -26.65),
        rotation: Quaternion.create(0, 1, 0, 1),
        scale: Vector3.create(1, 1, 1)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/Witch.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.npc_Witch2,
            this.gameController.dialogs.inGameWeaponSmithDialog
          )
        },
        onWalkAway: () => {},
        hoverText: 'Enchantment Witch',
        portrait: 'assets/images/witch.png',
        faceUser: true,
        reactDistance: 3,
        idleAnim: `idle`,
        darkUI: true,
        coolDownDuration: 3,
        onlyClickTrigger: true,
        onlyExternalTrigger: false,
        continueOnWalkAway: false
      }
    )
    this.npc_Vendor = npc.create(
      {
        position: Vector3.create(-56.55, 4.99, -11.74),
        rotation: Quaternion.create(0, 1, 0, 1),
        scale: Vector3.create(
          1.2069778442382812,
          1.2069778442382812,
          1.2069778442382812
        )
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/Vendor1.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.npc_Vendor,
            this.gameController.dialogs.vendorDialog
          )
        },
        onWalkAway: () => {},
        hoverText: 'Dungeon Shaman',
        bubbleHeight: 120,
        bubbleXOffset: 5,
        faceUser: true,
        onlyClickTrigger: true
      }
    )
    this.npc_KingGeraldOld = npc.create(
      {
        position: Vector3.create(-44.69, 9.56, -58.6),
        rotation: Quaternion.create(0, 0, 0, 1),
        scale: Vector3.create(
          1.2069778442382812,
          1.2069778442382812,
          1.2069778442382812
        )
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/KingStanding.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.npc_KingGeraldOld,
            this.gameController.dialogs.kingDialog
          )
        },
        onWalkAway: () => {},
        hoverText: 'King Gerald',
        portrait: 'assets/images/pfp/king.png',
        bubbleHeight: 256,
        faceUser: true,
        onlyClickTrigger: true
      }
    )
    this.npc_RandomVillager1 = npc.create(
      {
        position: Vector3.create(-31.97, 9.55, -34.76),
        rotation: Quaternion.create(0, -1, 0, 1),
        scale: Vector3.create(1, 1, 1)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/FarmerFemale1.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.npc_RandomVillager1,
            this.gameController.dialogs.randomDialog1
          )
        },
        onWalkAway: () => {},
        hoverText: 'Villager',
        idleAnim: 'idle',
        faceUser: true,
        reactDistance: 1,
        onlyClickTrigger: true
      }
    )
    this.npc_RandomVillager2 = npc.create(
      {
        position: Vector3.create(-51.88, 9.55, -35.06),
        rotation: Quaternion.create(0, -1, 0, 1),
        scale: Vector3.create(1, 1, 1)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/FarmerFemale1.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.npc_RandomVillager2,
            this.gameController.dialogs.randomDialog2
          )
        },
        onWalkAway: () => {},
        hoverText: 'Villager',
        idleAnim: 'idle',
        faceUser: true,
        onlyClickTrigger: true
      }
    )
    this.npc_RandomVillager3 = npc.create(
      {
        position: Vector3.create(-54.09, 5, -15.34),
        rotation: Quaternion.create(0, -1, 0, 1),
        scale: Vector3.create(1, 1, 1)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/FarmerFemale1.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.npc_RandomVillager3,
            this.gameController.dialogs.randomDialog3
          )
        },
        onWalkAway: () => {},
        hoverText: 'Villager',
        idleAnim: 'idle',
        faceUser: true,
        onlyClickTrigger: true
      }
    )
    this.npc_RandomVillager4 = npc.create(
      {
        position: Vector3.create(-46.25, 0, 9.37),
        rotation: Quaternion.create(0, -1, 0, 1),
        scale: Vector3.create(1, 1, 1)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/FarmerFemale2.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.npc_RandomVillager4,
            this.gameController.dialogs.randomDialog4
          )
        },
        onWalkAway: () => {},
        hoverText: 'Villager',
        idleAnim: 'idle',
        faceUser: true,
        onlyClickTrigger: true
      }
    )
    this.npc_RandomVillager5 = npc.create(
      {
        position: Vector3.create(64.69, 3.18, 86.6),
        rotation: Quaternion.create(0, -1, 0, 1),
        scale: Vector3.create(1, 1, 1)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/FarmerFemale2.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.npc_RandomVillager5,
            this.gameController.dialogs.randomDialog5
          )
        },
        onWalkAway: () => {},
        hoverText: 'Villager',
        idleAnim: 'idle',
        faceUser: true,
        onlyClickTrigger: true
      }
    )
    this.npc_RandomVillager6 = npc.create(
      {
        position: Vector3.create(70.95, 3.18, 65.08),
        rotation: Quaternion.create(0, -1, 0, 1),
        scale: Vector3.create(1, 1, 1)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/FarmerFemale2.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.npc_RandomVillager6,
            this.gameController.dialogs.randomDialog6
          )
        },
        onWalkAway: () => {},
        hoverText: 'Villager',
        idleAnim: 'idle',
        faceUser: true,
        onlyClickTrigger: true
      }
    )
    this.npc_RandomVillager7 = npc.create(
      {
        position: Vector3.create(51.21, 3.64, 63.82),
        rotation: Quaternion.create(0, -1, 0, 1),
        scale: Vector3.create(1, 1, 1)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/FarmerMale1.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.npc_RandomVillager7,
            this.gameController.dialogs.randomDialog7
          )
        },
        onWalkAway: () => {},
        hoverText: 'Villager',
        idleAnim: 'idle',
        faceUser: true,
        onlyClickTrigger: true
      }
    )
    this.npc_RandomVillager8 = npc.create(
      {
        position: Vector3.create(57.35, 7.14, 1.86),
        rotation: Quaternion.create(0, -1, 0, 1),
        scale: Vector3.create(1, 1, 1)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/FarmerFemale1.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.npc_RandomVillager8,
            this.gameController.dialogs.randomDialog8
          )
        },
        onWalkAway: () => {},
        hoverText: 'Villager',
        idleAnim: 'talk',
        faceUser: true,
        onlyClickTrigger: true
      }
    )
    this.npc_RandomVillager9 = npc.create(
      {
        position: Vector3.create(30.81, 3.48, -29.03),
        rotation: Quaternion.create(0, -1, 0, 1),
        scale: Vector3.create(1, 1, 1)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/FarmerMale2.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.npc_RandomVillager9,
            this.gameController.dialogs.randomDialog9
          )
        },
        onWalkAway: () => {},
        hoverText: 'Villager',
        idleAnim: 'talk',
        faceUser: true,
        onlyClickTrigger: true
      }
    )
    this.npc_RandomVillager10 = npc.create(
      {
        position: Vector3.create(-4.73, 2.43, 86.59),
        rotation: Quaternion.create(0, 1, 0, 1),
        scale: Vector3.create(1, 1, 1)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/FarmerMale2.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.npc_RandomVillager10,
            this.gameController.dialogs.randomDialog10
          )
        },
        onWalkAway: () => {},
        hoverText: 'Villager',
        idleAnim: 'idle',
        faceUser: true,
        onlyClickTrigger: true
      }
    )
    this.npc_RandomVillager10 = npc.create(
      {
        position: Vector3.create(66.64, 3.18, 74.7),
        rotation: Quaternion.create(0, -1, 0, 1),
        scale: Vector3.create(1, 1, 1)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/FarmerMale2.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.npc_RandomVillager11,
            this.gameController.dialogs.randomDialog11
          )
        },
        onWalkAway: () => {},
        hoverText: 'Villager',
        idleAnim: 'idle',
        faceUser: true,
        onlyClickTrigger: true
      }
    )
  }

  DungeonDoor(): void {
    Transform.create(this.dungeonDoor, {
      position: Vector3.create(16, 0, 16),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1)
    })
    GltfContainer.createOrReplace(this.dungeonDoor, {
      src: 'assets/models/DungeonDoor.glb'
    })
    PointerEvents.createOrReplace(this.dungeonDoor, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Garrison Door',
            maxDistance: 5
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.dungeonDoor
        )
      ) {
        if (trewsKill.read() === 1) {
          if (garrisonCreatedOnce.read() === 0) {
            garrisonCreatedOnce.increase(1)
          } else {
            setPlayerPosition(-9.83, 48.19, -45.24)
          }
          setCurrentActiveScene('LegacyDungeon')
        } else {
          this.gameController.uiController.displayAnnouncement(
            'Locked',
            Color4.Yellow(),
            3000
          )
        }
      }
    })
    Animator.create(this.dungeonDoor, {
      states: [
        {
          clip: 'idle',
          playing: true,
          loop: true
        },
        {
          clip: 'fire',
          playing: false,
          loop: true
        }
      ]
    })
  }

  createTriggerZoneForBerserkerUpgradeMarket(): void {
    Transform.createOrReplace(this.tz_bersekerUpgradeMarket, {
      position: Vector3.create(-54.61, 9.6, -28.93),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(0, 0, 0, 1)
    })
    GltfContainer.create(this.tz_bersekerUpgradeMarket, {
      src: 'assets/models/Skill_FX/CharacterSelect.glb'
    })
    MeshRenderer.setBox(this.tz_bersekerUpgradeMarket)
    Material.setPbrMaterial(this.tz_bersekerUpgradeMarket, {
      albedoColor: Color4.create(0, 0, 0, 0)
    })
    Animator.create(this.tz_bersekerUpgradeMarket, {
      states: [
        {
          clip: 'idle',
          playing: false,
          loop: true
        },
        {
          clip: 'action',
          playing: false,
          loop: true
        }
      ]
    })
    utils.triggers.addTrigger(
      this.tz_bersekerUpgradeMarket,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(1, 1, 1) }],
      () => {
        // MarketUpgradeHUD.getInstance().show()
        Animator.playSingleAnimation(this.tz_bersekerUpgradeMarket, 'action')
      },
      () => {
        // MarketUpgradeHUD.getInstance().hide()
        Animator.playSingleAnimation(this.tz_bersekerUpgradeMarket, 'idle')
      }
    )
  }

  createTriggerZoneForResourceMarket(): void {
    Transform.createOrReplace(this.tz_resourceMarket, {
      position: Vector3.create(40.76, 7.24, -4.25),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(0, 0, 0, 1)
    })
    GltfContainer.create(this.tz_resourceMarket, {
      src: 'assets/models/Skill_FX/CharacterSelect.glb'
    })
    MeshRenderer.setBox(this.tz_resourceMarket)
    Material.setPbrMaterial(this.tz_resourceMarket, {
      albedoColor: Color4.create(0, 0, 0, 0)
    })
    Animator.create(this.tz_resourceMarket, {
      states: [
        {
          clip: 'idle',
          playing: false,
          loop: true
        },
        {
          clip: 'action',
          playing: false,
          loop: true
        }
      ]
    })
    utils.triggers.addTrigger(
      this.tz_resourceMarket,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(1, 1, 1) }],
      () => {
        // ResourceMarketHUD.getInstance().show()
        Animator.playSingleAnimation(this.tz_resourceMarket, 'action')
      },
      () => {
        // ResourceMarketHUD.getInstance().hide()
        Animator.playSingleAnimation(this.tz_resourceMarket, 'idle')
      }
    )
  }

  createTriggerZoneForRangerUpgradeMarket(): void {
    Transform.createOrReplace(this.tz_rangerUpgradeMarket, {
      position: Vector3.create(-58.44, 9.6, -29.89),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(0, 0, 0, 1)
    })
    GltfContainer.create(this.tz_rangerUpgradeMarket, {
      src: 'assets/models/Skill_FX/fullorange.glb'
    })
    MeshRenderer.setBox(this.tz_rangerUpgradeMarket)
    Material.setPbrMaterial(this.tz_rangerUpgradeMarket, {
      albedoColor: Color4.create(0, 0, 0, 0)
    })
    Animator.create(this.tz_rangerUpgradeMarket, {
      states: [
        {
          clip: 'idle',
          playing: false,
          loop: true
        },
        {
          clip: 'action',
          playing: false,
          loop: true
        }
      ]
    })
    utils.triggers.addTrigger(
      this.tz_rangerUpgradeMarket,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(1, 1, 1) }],
      () => {
        this.gameController.uiController.displayAnnouncement(
          'Ranger Upgrades Coming Soon!',
          Color4.Yellow(),
          3000
        )
        Animator.playSingleAnimation(this.tz_rangerUpgradeMarket, 'action')
      },
      () => {
        Animator.playSingleAnimation(this.tz_rangerUpgradeMarket, 'idle')
      }
    )
  }

  createTriggerZoneForMageUpgradeMarket(): void {
    Transform.createOrReplace(this.tz_mageUpgradeMarket, {
      position: Vector3.create(-58.35, 9.6, -33.78),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(0, 0, 0, 1)
    })
    GltfContainer.create(this.tz_mageUpgradeMarket, {
      src: 'assets/models/Skill_FX/fullorange.glb'
    })
    MeshRenderer.setBox(this.tz_mageUpgradeMarket)
    Material.setPbrMaterial(this.tz_mageUpgradeMarket, {
      albedoColor: Color4.create(0, 0, 0, 0)
    })
    Animator.create(this.tz_mageUpgradeMarket, {
      states: [
        {
          clip: 'idle',
          playing: false,
          loop: true
        },
        {
          clip: 'action',
          playing: false,
          loop: true
        }
      ]
    })
    utils.triggers.addTrigger(
      this.tz_mageUpgradeMarket,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(1, 1, 1) }],
      () => {
        this.gameController.uiController.displayAnnouncement(
          'Ranger Upgrades Coming Soon!',
          Color4.Yellow(),
          3000
        )
        Animator.playSingleAnimation(this.tz_mageUpgradeMarket, 'action')
      },
      () => {
        Animator.playSingleAnimation(this.tz_mageUpgradeMarket, 'idle')
      }
    )
  }

  createTriggerZoneForApprenticeMarket(): void {
    Transform.createOrReplace(this.tz_apprenticeMarket, {
      position: Vector3.create(-55.92, 9.6, -33.67),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(0, 0, 0, 1)
    })
    GltfContainer.create(this.tz_apprenticeMarket, {
      src: 'assets/models/Skill_FX/CharacterSelect.glb'
    })
    MeshRenderer.setBox(this.tz_apprenticeMarket)
    Material.setPbrMaterial(this.tz_apprenticeMarket, {
      albedoColor: Color4.create(0, 0, 0, 0)
    })
    Animator.create(this.tz_apprenticeMarket, {
      states: [
        {
          clip: 'idle',
          playing: false,
          loop: true
        },
        {
          clip: 'action',
          playing: false,
          loop: true
        }
      ]
    })
    utils.triggers.addTrigger(
      this.tz_apprenticeMarket,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(1, 1, 1) }],
      () => {
        // ApprenticeMarketHUD.getInstance().show()
        Animator.playSingleAnimation(this.tz_apprenticeMarket, 'action')
      },
      () => {
        // ApprenticeMarketHUD.getInstance().hide()
        Animator.playSingleAnimation(this.tz_apprenticeMarket, 'idle')
      }
    )
  }

  createTriggerZoneForSkillChange(): void {
    Transform.createOrReplace(this.tz_skillChange, {
      position: Vector3.create(-16.62, 9.67, -46.67),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(0, 0, 0, 1)
    })
    GltfContainer.create(this.tz_skillChange, {
      src: 'assets/models/Skill_FX/CharacterSelect.glb'
    })
    MeshRenderer.setBox(this.tz_skillChange)
    Material.setPbrMaterial(this.tz_skillChange, {
      albedoColor: Color4.create(0, 0, 0, 0)
    })
    Animator.create(this.tz_skillChange, {
      states: [
        {
          clip: 'idle',
          playing: false,
          loop: true
        },
        {
          clip: 'action',
          playing: false,
          loop: true
        }
      ]
    })
    utils.triggers.addTrigger(
      this.tz_skillChange,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(1, 1, 1) }],
      () => {
        //   let prompt = new ui.OptionPrompt(
        //     "Select a new RACE/CLASS!",
        //     "Would you like to reselect your RACE or CLASS\n for 2000 COINS?",
        //     () => {
        //         if (
        //             player.inventory.getItemCount(ITEM_TYPES.COIN) >= 2000
        //         ) {
        //             player.inventory.reduceItem(ITEM_TYPES.COIN, 2000)
        //             CreationHUD.show(true)
        //         } else {
        this.gameController.uiController.displayAnnouncement(
          'Need more coins!',
          Color4.Yellow(),
          3000
        )
        //         }
        //     },
        //     () => {
        //         log(`picked option B`)
        //     },
        //     "Yes",
        //     "No"
        // )
        Animator.playSingleAnimation(this.tz_skillChange, 'action')
      },
      () => {
        Animator.playSingleAnimation(this.tz_skillChange, 'idle')
      }
    )
  }

  createTriggerZoneForMagicalItemsMarketHUD(): void {
    Transform.createOrReplace(this.tz_magicalItemsMarketHUD, {
      position: Vector3.create(-37.38, 9.7, -27.33),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(0, 0, 0, 1)
    })
    GltfContainer.create(this.tz_magicalItemsMarketHUD, {
      src: 'assets/models/Skill_FX/CharacterSelect.glb'
    })
    MeshRenderer.setBox(this.tz_magicalItemsMarketHUD)
    Material.setPbrMaterial(this.tz_magicalItemsMarketHUD, {
      albedoColor: Color4.create(0, 0, 0, 0)
    })
    Animator.create(this.tz_magicalItemsMarketHUD, {
      states: [
        {
          clip: 'idle',
          playing: false,
          loop: true
        },
        {
          clip: 'action',
          playing: false,
          loop: true
        }
      ]
    })
    utils.triggers.addTrigger(
      this.tz_magicalItemsMarketHUD,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(1, 1, 1) }],
      () => {
        // MagicalItemsMarketHUD.getInstance().show()
        Animator.playSingleAnimation(this.tz_magicalItemsMarketHUD, 'action')
      },
      () => {
        // MagicalItemsMarketHUD.getInstance().hide()
        Animator.playSingleAnimation(this.tz_magicalItemsMarketHUD, 'idle')
      }
    )
  }

  createTriggerZoneFoDailyRewards(): void {
    Transform.createOrReplace(this.tz_dailyRewards, {
      position: Vector3.create(-30.07, 9.6, -34.87),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(0, 0, 0, 1)
    })
    GltfContainer.create(this.tz_dailyRewards, {
      src: 'assets/models/Skill_FX/fullorange.glb'
    })
    MeshRenderer.setBox(this.tz_dailyRewards)
    Material.setPbrMaterial(this.tz_dailyRewards, {
      albedoColor: Color4.create(0, 0, 0, 0)
    })
    Animator.create(this.tz_dailyRewards, {
      states: [
        {
          clip: 'idle',
          playing: false,
          loop: true
        },
        {
          clip: 'action',
          playing: false,
          loop: true
        }
      ]
    })
    utils.triggers.addTrigger(
      this.tz_dailyRewards,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(1, 1, 1) }],
      () => {
        this.gameController.uiController.displayAnnouncement(
          'Daily Rewards Coming Soon!',
          Color4.Yellow(),
          3000
        )
        Animator.playSingleAnimation(this.tz_dailyRewards, 'action')
      },
      () => {
        Animator.playSingleAnimation(this.tz_dailyRewards, 'idle')
      }
    )
  }

  createFuranceUpgrade(): void {
    Transform.create(this.furanceUpgrade, {
      position: Vector3.create(16, 0, 16),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1)
    })
    GltfContainer.createOrReplace(this.furanceUpgrade, {
      src: 'assets/models/Furnace_upgrade.glb'
    })
    PointerEvents.createOrReplace(this.furanceUpgrade, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Upgrade Wearables',
            maxDistance: 5
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.furanceUpgrade
        )
      ) {
        Animator.playSingleAnimation(this.furanceUpgrade, 'fire')
        // MarketUpgradeHUD.getInstance().show()
      }
    })
    Animator.create(this.furanceUpgrade, {
      states: [
        {
          clip: 'idle',
          playing: false,
          loop: true
        },
        {
          clip: 'fire',
          playing: false,
          loop: true
        }
      ]
    })
  }

  createCellDoors(): void {
    Transform.create(this.cellDoor, {
      position: Vector3.create(16, 0, 16),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1)
    })
    GltfContainer.createOrReplace(this.cellDoor, {
      src: 'assets/models/castleCelldoor.glb'
    })
    PointerEvents.createOrReplace(this.cellDoor, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Open doors!',
            maxDistance: 5
          }
        }
      ]
    })
    Animator.create(this.cellDoor, {
      states: [
        {
          clip: 'idle',
          playing: false,
          loop: false
        },
        {
          clip: 'open',
          playing: false,
          loop: false
        },
        {
          clip: 'close',
          playing: false,
          loop: false
        }
      ]
    })
    Animator.playSingleAnimation(this.cellDoor, 'idle')
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.cellDoor
        )
      ) {
        if (jailKey.read() === 1) {
          Animator.playSingleAnimation(this.cellDoor, 'open')
          jailKey.decrease(1)
          //     tutorialDialogWindow.openDialogWindow(
          //         FoundChryseGarrisonDialog,
          //         0
          //     )
          //     createpostGarrisonAlaraNPC()
          //     removeNPCFromMap("ChryseJail")
          //     //removeNPCFromMap("AlaraJail")
          //     removeNPCFromMap("WarAlara")
          console.log('on drop here')
          //     //questDialogWindow.openDialogWindow(defeatedGodricDialog, 4)
          //     callanQuestLabel.value = "Find Alara!"
          utils.timers.setTimeout(() => {
            Animator.playSingleAnimation(this.cellDoor, 'close')
          }, 3000)
        } else {
          this.gameController.uiController.displayAnnouncement(
            'Need jail key',
            Color4.Yellow(),
            3000
          )
        }
      }
    })
  }

  createCellEntranceDoors(): void {
    Transform.create(this.cellEntranceDoor, {
      position: Vector3.create(16, 0, 16),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1)
    })
    GltfContainer.createOrReplace(this.cellEntranceDoor, {
      src: 'assets/models/castleCellsEntrance.glb'
    })
    PointerEvents.createOrReplace(this.cellEntranceDoor, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Open doors!',
            maxDistance: 5
          }
        }
      ]
    })
    Animator.create(this.cellEntranceDoor, {
      states: [
        {
          clip: 'idle',
          playing: true,
          loop: false
        },
        {
          clip: 'open',
          playing: false,
          loop: false
        },
        {
          clip: 'close',
          playing: false,
          loop: false
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.cellEntranceDoor
        )
      ) {
        if (jailGuards.read() === 2) {
          console.log('DOOR OPENED')
          Animator.playSingleAnimation(this.cellEntranceDoor, 'open')
          this.gameController.npcs.createChryseJailedNPCs()
          jailOpenOnce.increase(1)
          utils.timers.setTimeout(() => {
            Animator.playSingleAnimation(this.cellEntranceDoor, 'close')
          }, 3000)
        } else {
          if (jailOpenOnce.read() === 1) {
            Animator.playSingleAnimation(this.cellEntranceDoor, 'open')
          } else {
            this.gameController.uiController.displayAnnouncement(
              'Defeat Jail Guards',
              Color4.Yellow(),
              3000
            )
          }
        }
      }
    })
  }

  createTavernDoor(): void {
    Transform.create(this.tavernDoor, {
      position: Vector3.create(16, 0, 16),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1)
    })

    AudioSource.create(this.tavernDoor, {
      audioClipUrl: 'assets/sounds/doorOpen.mp3',
      loop: false,
      playing: false
    })
    GltfContainer.createOrReplace(this.tavernDoor, {
      src: 'assets/models/TavernDoor.glb'
    })
    MeshCollider.createOrReplace(this.tavernDoor)
    PointerEvents.createOrReplace(this.tavernDoor, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Enter Tavern',
            maxDistance: 5
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.tavernDoor
        )
      ) {
        Animator.playSingleAnimation(this.tavernDoor, 'open')
        AudioSource.playSound(this.tavernDoor, 'assets/sounds/doorOpen.mp3')
      }
    })
    Animator.create(this.tavernDoor, {
      states: [
        {
          clip: 'idle',
          playing: true,
          loop: false
        },
        {
          clip: 'open',
          playing: false,
          loop: false
        },
        {
          clip: 'close',
          playing: false,
          loop: false
        }
      ]
    })
  }

  createHeavyGrinderCrown(): void {
    Transform.create(this.heavyGrinderCrown, {
      position: Vector3.create(89.2, 17.89, -19.36),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1)
    })
    GltfContainer.createOrReplace(this.heavyGrinderCrown, {
      src: 'assets/models/zombie.glb'
    })
    PointerEvents.createOrReplace(this.heavyGrinderCrown, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: '...RUN!',
            maxDistance: 5
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.heavyGrinderCrown
        )
      ) {
        void openExternalUrl({
          url: 'https://play.decentraland.org/?realm=hide.dcl.eth&position=141%2C-3'
        })
      }
    })
  }

  createCampfireA(): void {
    GltfContainer.create(this.campFire, { src: 'assets/models/Fireplace.glb' })
    Transform.create(this.campFire, {
      position: Vector3.create(-25.21, 4.64, -26.11),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(2, 2, 2)
    })
    PointerEvents.createOrReplace(this.campFire, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Cook meat!',
            maxDistance: 5
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.campFire
        )
      ) {
        this.gameController.uiController.displayAnnouncement(
          'Cooking...',
          Color4.Yellow(),
          3000
        )
        //                 setTimeout(6000, () => {
        //                     //player.inventory.incrementItem(ITEM_TYPES.TREE, 10)
        this.gameController.uiController.displayAnnouncement(
          'COOOOOOKED!',
          Color4.Yellow(),
          3000
        )
        //                     player.refillHealthBar(1)
        //                     player.writeDataToServer()
        //                 })
        //             } else {
        this.gameController.uiController.displayAnnouncement(
          'You dont have enough MEAT!',
          Color4.Yellow(),
          3000
        )
        //             }
        //         },
        //         () => {
        //             log(`picked option B`)
        //         },
        //         "COOK MEAT",
        //         "No Thanks"
        //     )
        // }
      }
    })
    Animator.create(this.campFire, {
      states: [
        {
          clip: 'action',
          playing: true,
          loop: true
        }
      ]
    })
  }

  spawnSingleEntity(entityName: string): void {
    switch (entityName) {
      case 'butcher':
        this.butcher = new BetaBoss1(this.gameController)
        break
      case 'jailGuards':
        this.jailGuard1 = new Minion(
          this.gameController,
          Vector3.create(-51.27, 4.15, -53.72)
        )
        this.jailGuard2 = new Minion(
          this.gameController,
          Vector3.create(-46.24, 4.15, -54.05)
        )
        break
    }
  }

  removeSingleEntity(entityName: string): void {
    switch (entityName) {
      case 'KingGeraldOld':
        if (this.npc_KingGeraldOld != null) {
          entityController.removeEntity(this.npc_KingGeraldOld)
          console.log('King removed')
          break
        }
    }
  }

  removeAllEntities(): void {
    entityController.removeEntity(this.boardParent)
    this.leaderBoard.destroy()
    entityController.removeEntity(this.leaderBoard.leaderBoard)
    entityController.removeEntity(this.dungeonDoor)
    entityController.removeEntity(this.tz_bersekerUpgradeMarket)
    entityController.removeEntity(this.tz_resourceMarket)
    entityController.removeEntity(this.tz_rangerUpgradeMarket)
    entityController.removeEntity(this.tz_mageUpgradeMarket)
    entityController.removeEntity(this.tz_apprenticeMarket)
    entityController.removeEntity(this.tz_skillChange)
    entityController.removeEntity(this.tz_magicalItemsMarketHUD)
    entityController.removeEntity(this.tz_dailyRewards)
    entityController.removeEntity(this.furanceUpgrade)
    entityController.removeEntity(this.cellDoor)
    entityController.removeEntity(this.cellEntranceDoor)
    entityController.removeEntity(this.tavernDoor)
    entityController.removeEntity(this.heavyGrinderCrown)
    entityController.removeEntity(this.skybox)
    entityController.removeEntity(this.campFire)
    entityController.removeEntity(this.antromForestTest)
    entityController.removeEntity(this.antromCavesTest)
    entityController.removeEntity(this.antromCastleTest)
    entityController.removeEntity(this.antromColliderTest)
    entityController.removeEntity(this.antromCastle2Test)
    entityController.removeEntity(this.npc_TownHallWizard)
    entityController.removeEntity(this.npc_Witch)
    entityController.removeEntity(this.npc_Witch2)
    entityController.removeEntity(this.npc_Vendor)
    entityController.removeEntity(this.npc_KingGeraldOld)
    entityController.removeEntity(this.npc_RandomVillager1)
    entityController.removeEntity(this.npc_RandomVillager2)
    entityController.removeEntity(this.npc_RandomVillager3)
    entityController.removeEntity(this.npc_RandomVillager4)
    entityController.removeEntity(this.npc_RandomVillager5)
    entityController.removeEntity(this.npc_RandomVillager6)
    entityController.removeEntity(this.npc_RandomVillager7)
    entityController.removeEntity(this.npc_RandomVillager8)
    entityController.removeEntity(this.npc_RandomVillager9)
    entityController.removeEntity(this.npc_RandomVillager10)
    entityController.removeEntity(this.npc_RandomVillager11)

    if (this.butcher != null) {
      this.butcher.removeEntity()
    }
    this.executioners.forEach((executioner) => {
      executioner.removeEntity()
    })
    this.chickens.forEach((chicken) => {
      chicken.removeEntity()
    })
    this.pigs.forEach((pig) => {
      pig.removeEntity()
    })

    this.rocks.forEach((rock) => {
      rock.removeRock()
    })
    this.trees.forEach((tree) => {
      tree.removeTree()
    })
    this.berryTrees.forEach((berryTree) => {
      berryTree.removeBerryTree()
    })
  }

  deadPosition(): Vector3 {
    return { x: -38.34, y: 10.43, z: -39.75 }
  }

  getId(): RealmType {
    return 'antrom'
  }
}
