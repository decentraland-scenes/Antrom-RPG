/* eslint-disable @typescript-eslint/no-base-to-string */
import * as utils from '@dcl-sdk/utils'
import {
  Animator,
  AudioSource,
  AvatarModifierArea,
  AvatarModifierType,
  EasingFunction,
  GltfContainer,
  InputAction,
  Material,
  MeshRenderer,
  PointerEventType,
  PointerEvents,
  Transform,
  Tween,
  engine,
  inputSystem
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { GetPlayerDungeonEasyLeaderBoard } from '../api/api'
import { type GameController } from '../controllers/game.controller'
import { setCurrentActiveScene } from '../instances'
import { LeaderBoard } from '../leaderboard/leaderboard'
import { setPlayerPosition } from '../utils/engine'
import { Realm } from './types'

type Difficulty = {
  EASY: 'easy'
  MEDIUM: 'medium'
  HARD: 'hard'
  NIGHTMARE: 'nightmare'
}
type Location = {
  CAVE: 'cave'
  DESERT: 'desert'
}
const desertSoldierPositions = [
  // room1
  Vector3.create(-16.52, 2.39, 60.76),
  Vector3.create(-17.48, 2.39, 57.79),
  Vector3.create(-14.83, 2.39, 54.86),
  Vector3.create(-11.59, 2.39, 57.96),
  Vector3.create(-18.59, 2.39, 58.73),
  Vector3.create(-32.33, 2.39, 49.4),
  Vector3.create(-31.43, 2.39, 43.91),
  Vector3.create(-27.5, 2.39, 44.92),
  Vector3.create(-24.44, 2.39, 42.36),
  Vector3.create(-28.23, 2.39, 39.59),
  // room2
  Vector3.create(-29.26, 2.39, 19.76),
  Vector3.create(7.97, 2.39, 42.68),
  Vector3.create(10.04, 2.39, 44.81),
  Vector3.create(5.92, 2.39, 42.85),
  Vector3.create(8.15, 2.39, 39.27),
  Vector3.create(15.61, 2.39, 23.75),
  Vector3.create(-30.96, 2.39, 23.52),
  Vector3.create(-26.49, 2.39, 20.83),
  Vector3.create(-28.76, 2.39, 16.34),
  // room 3
  Vector3.create(-30.29, 2.39, 11.36),
  Vector3.create(-29.62, 2.39, -18.54),
  Vector3.create(-30.12, 2.39, -22.04),
  Vector3.create(-26.84, 2.39, -20.37),
  Vector3.create(3.88, 2.39, 8.61),
  Vector3.create(7.06, 2.39, 8.44),
  Vector3.create(24.68, 2.39, 4.16),
  Vector3.create(-11.2, 2.39, 3.94),
  Vector3.create(-15.88, 2.39, 3.33),
  Vector3.create(-13.65, 2.39, 9.29),
  Vector3.create(-10.01, 2.39, 11.08),
  Vector3.create(-26.92, 2.39, -28.04),
  Vector3.create(-33.22, 2.39, -32.68),
  // room 4
  Vector3.create(-28.43, 2.39, -31.8),
  Vector3.create(-27.34, 2.39, -37.66),
  Vector3.create(-28.94, 2.39, -44.21),
  Vector3.create(-12.59, 2.39, -33.13),
  Vector3.create(-9.02, 2.39, -30.56),
  Vector3.create(-7.42, 2.39, -36.22),
  Vector3.create(-10.96, 2.39, -40.84),
  Vector3.create(-19.12, 2.39, -27.37),
  Vector3.create(40.82, 2.39, -34.96),
  Vector3.create(40.89, 2.39, -29.93),
  // room ???
  Vector3.create(47.66, 2.39, -30.0),
  Vector3.create(43.79, 2.39, -26.7),
  Vector3.create(47.15, 2.39, -27.18),
  Vector3.create(60.04, 2.39, -14.6),
  Vector3.create(64.11, 2.39, -14.61),
  Vector3.create(64.41, 2.39, -18.3),
  Vector3.create(60.03, 2.39, -22.37),
  Vector3.create(53.86, 2.39, -18.84),
  Vector3.create(55.25, 2.39, 12.64),
  Vector3.create(57.51, 2.39, 8.67),
  Vector3.create(55.17, 2.39, 5.81),
  Vector3.create(49.56, 2.39, 10.25),
  Vector3.create(49.51, 2.39, 17.07)
]

const caveSoldierPositions = [
  // room1
  Vector3.create(61.89, 17.79, 25.92),
  Vector3.create(62.85, 17.81, 24.6),
  Vector3.create(61.47, 19.74, -2.11),
  Vector3.create(55.26, 20.42, -6.11),
  Vector3.create(13.07, 3.15, 10.38),
  Vector3.create(19.44, 3.75, 12.24),
  // room2
  // 1
  Vector3.create(40.97, 3.16, 51.58),
  Vector3.create(41.58, 3.16, 44.85),
  Vector3.create(44.0, 3.16, 50.73),

  // 2
  Vector3.create(20.48, 3.16, 45.13),
  Vector3.create(21.21, 3.16, 47.47),
  Vector3.create(23.48, 3.16, 43.49),

  // 3
  Vector3.create(26.41, 3.16, 80.57),
  Vector3.create(23.69, 3.16, 77.26),
  Vector3.create(29.63, 3.16, 82.97),

  // 4
  Vector3.create(24.5, 12.34, 62.51),
  Vector3.create(24.02, 12.12, 68.02),
  Vector3.create(19.48, 11.56, 59.89),

  // 5
  Vector3.create(-2.71, 3.16, 64.76),
  Vector3.create(-3.89, 3.16, 68.67),
  Vector3.create(1.29, 3.16, 66.02),

  // room 3
  Vector3.create(-31.96, 12.11, 57.14),
  Vector3.create(-34.98, 9.43, 66.18),
  Vector3.create(-36.55, 9.25, 61.02),

  Vector3.create(-46.08, 13.57, 51.86),
  Vector3.create(-46.28, 13.35, 53.8),
  Vector3.create(-43.62, 14.47, 57.88)
]

// const magePositions = [
//   Vector3.create(43.61, 3.29, 54.45),
//   Vector3.create(61.91, 3.29, 56.97)
// ]

export class Dungeon extends Realm {
  private readonly boardParent = engine.addEntity()
  private readonly leaderBoard: LeaderBoard
  private readonly wall1 = engine.addEntity()
  private readonly wall2 = engine.addEntity()
  private readonly wall3 = engine.addEntity()
  private readonly wall4 = engine.addEntity()
  private readonly wall5 = engine.addEntity()
  private readonly wall6 = engine.addEntity()
  private readonly secretwall = engine.addEntity()
  private readonly lever = engine.addEntity()
  private readonly gem = engine.addEntity()
  private readonly sandDungeonSecret = engine.addEntity()
  private readonly villager1 = engine.addEntity()
  private readonly doorOpening = engine.addEntity()
  gameController: GameController
  constructor(gameController: GameController) {
    super()
    this.gameController = gameController
    GltfContainer.create(this.wall1, {
      src: 'assets/models/sandDungeonDoor.glb'
    })
    GltfContainer.create(this.wall3, {
      src: 'assets/models/sandDungeonDoor.glb'
    })
    GltfContainer.create(this.wall4, {
      src: 'assets/models/sandDungeonDoor.glb'
    })
    GltfContainer.create(this.wall5, {
      src: 'assets/models/sandDungeonDoor.glb'
    })
    GltfContainer.create(this.wall6, {
      src: 'assets/models/sandDungeonDoor.glb'
    })
    GltfContainer.create(this.secretwall, {
      src: 'assets/models/sandDungeonDoor2.glb'
    })
    GltfContainer.create(this.lever, {
      src: 'assets/models/sandDungeonLever.glb'
    })
    GltfContainer.create(this.gem, { src: 'assets/models/Gem08.glb' })
    GltfContainer.create(this.sandDungeonSecret, {
      src: 'assets/models/SandDungeonSecret.glb'
    })
    GltfContainer.create(this.villager1, { src: 'assets/models/Villager1.glb' })
    Transform.create(this.boardParent, {
      position: Vector3.create(25.94, 10, 72),
      rotation: Quaternion.create(0, 0, 0, 0)
    })
    this.leaderBoard = new LeaderBoard()
    Transform.createOrReplace(this.wall1, {
      position: Vector3.create(39.74, 6.88, 25.35),
      scale: Vector3.create(1, 1, 1)
    })
    Transform.createOrReplace(this.wall2, {
      position: Vector3.create(38.91, 6.29, 24.82),
      rotation: Quaternion.create(0, 90, 0, 1),
      scale: Vector3.create(6, 6, 3)
    })
    MeshRenderer.setBox(this.wall2)
    Material.setPbrMaterial(this.wall2, {
      albedoColor: Color4.create(0, 0, 0, 0)
    })
    Transform.createOrReplace(this.wall3, {
      position: Vector3.create(61.69, 6.88, -9.95),
      scale: Vector3.create(1, 1, 1)
    })
    Transform.createOrReplace(this.wall4, {
      position: Vector3.create(-2.3, 7.59, -43.89),
      scale: Vector3.create(1, 1, 1)
    })
    Transform.createOrReplace(this.wall5, {
      position: Vector3.create(-10.42, 6.29, -2.5),
      scale: Vector3.create(1, 1, 1)
    })
    Transform.createOrReplace(this.wall6, {
      position: Vector3.create(-32.07, 6.29, 34.8),
      scale: Vector3.create(1, 1, 1)
    })
    Transform.createOrReplace(this.secretwall, {
      position: Vector3.create(13.625, 8.11, 65.84),
      scale: Vector3.create(1, 1, 1)
    })
    Transform.createOrReplace(this.lever, {
      position: Vector3.create(34.58, 19.58, -39),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(-1, -1, -1, 1)
    })
    Transform.createOrReplace(this.gem, {
      position: Vector3.create(21.04, 9.06, 35.67),
      scale: Vector3.create(2, 2, 2),
      rotation: Quaternion.create(0, 0, 0)
    })
    Transform.createOrReplace(this.sandDungeonSecret, {
      position: Vector3.create(-20.5, 0, 63.5),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(0, 0, 0, 1)
    })
    Transform.createOrReplace(this.villager1, {
      position: Vector3.create(30.99, 4.63, 68.97),
      scale: Vector3.create(1.2, 1.2, 1.2),
      rotation: Quaternion.create(0, -1, 0, 1)
    })
    Transform.createOrReplace(this.doorOpening, {
      position: Transform.get(engine.CameraEntity).position,
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1)
    })
    AudioSource.createOrReplace(this.doorOpening, {
      audioClipUrl: 'assets/sounds/stone_door_fast.mp3',
      loop: false,
      playing: false,
      volume: 1
    })
    Animator.create(this.lever, {
      states: [
        {
          clip: 'activate',
          playing: false,
          loop: false
        }
      ]
    })
    Animator.create(this.sandDungeonSecret, {
      states: [
        {
          clip: 'idle',
          playing: false,
          loop: true
        }
      ]
    })
    Animator.create(this.villager1, {
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
    Animator.playSingleAnimation(this.sandDungeonSecret, 'idle')
    PointerEvents.createOrReplace(this.lever, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Activate',
            maxDistance: 6
          }
        }
      ]
    })
    PointerEvents.createOrReplace(this.villager1, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Dungeon tokens',
            maxDistance: 5
          }
        }
      ]
    })
    PointerEvents.createOrReplace(this.gem, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Pick Up Essence of the Lich God',
            maxDistance: 6
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.lever
        )
      ) {
        Animator.playSingleAnimation(this.lever, 'activate')
        AudioSource.playSound(
          this.doorOpening,
          'assets/sounds/stone_door_fast.mp3'
        )
        Tween.createOrReplace(this.secretwall, {
          mode: Tween.Mode.Move({
            start: Vector3.create(13.625, 8.11, 65.84),
            end: Vector3.create(9.975, 8.11, 65.84)
          }),
          duration: 4,
          easingFunction: EasingFunction.EF_EASEINSINE
        })
      }
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.villager1
        )
      ) {
        // ResourceMarketHUD.getInstance().show()
      }
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.gem
        )
      ) {
        this.gameController.uicontroller.displayAnnouncement(
          'You have picked up the Essence of the Lich God, open a support ticket in Discord for your reward!',
          Color4.Yellow(),
          3000
        )
      }
    })
    Animator.playSingleAnimation(this.villager1, 'idle')
    this.updateBoard().catch((error: Error) => {
      console.log(error)
    })
  }

  buildDungeon(scene: string): void {
    // cleanupScene()
    utils.timers.setTimeout(() => {
      const hideAvatarsEntity = engine.addEntity()
      AvatarModifierArea.create(hideAvatarsEntity, {
        area: Vector3.create(16000, 600, 16000),
        excludeIds: [''],
        modifiers: [AvatarModifierType.AMT_DISABLE_PASSPORTS]
      })
      Transform.create(hideAvatarsEntity, {
        position: Vector3.create(16000, 600, 16000)
      })
    }, 2000)
    setCurrentActiveScene(scene)
    if (scene === 'DesertDungeon') {
      // createQuestTimerText()
      // loader.showLoaderDesertDungeon(5000)
      this.buildDesertDungeonScene()
      utils.timers.setTimeout(() => {
        // quest.turnOnKingQuestTimer()
        setPlayerPosition(23.01, 1.72, 91.7)
      }, 5000)
    }
    if (scene === 'LegacyDungeon') {
      // buildLegacyDungeonScene()
      utils.timers.setTimeout(() => {
        // quest.turnOnKingQuestTimer()
        setPlayerPosition(72.32, 1.03, 69.08)
      }, 5000)
    }
    if (scene === 'CaveDungeon') {
      // buildCaveDungeonScene()
      setPlayerPosition(66.62, 0.54, -41.19)
    }
    if (scene === 'OrcVillage') {
      // buildOrcDungeonScene()
      utils.timers.setTimeout(() => {
        // quest.turnOnKingQuestTimer()
        setPlayerPosition(86.39, 29.26, 86.5)
      }, 5000)
    }
    if (scene === 'UndeadVillage') {
      // buildUndeadDungeonScene()
      utils.timers.setTimeout(() => {
        // quest.turnOnKingQuestTimer()
        setPlayerPosition(0.98, 7.69, -6.0)
      }, 5000)
    }
  }

  resetDungeon(scene: string): void {
    if (scene === 'DesertDungeon') {
      // resetDesertDungeonScene()
      setPlayerPosition(23.01, 1.72, 91.7)
    }
    if (scene === 'CaveDungeon') {
      // resetCaveDungeonScene()
      setPlayerPosition(66.62, 0.54, -41.19)
    }
    if (scene === 'LegacyDungeon') {
      setCurrentActiveScene('LegacyDungeon')
      // buildLegacyDungeonScene()
      setPlayerPosition(72.32, 1.03, 69.08)
    }
  }

  buildDesertDungeonScene(): void {
    // build desert dungeon
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

  createResourceHub(): void {}
  resetDesertDungeonScene(): void {
    // reset dungeon scene
  }

  buildLegacyDungeonScene(): void {
    // dungeonBase()
    // createDungeonPotions()
  }

  buildCaveDungeonScene(): void {
    // buildCave()
  }

  resetCaveDungeonScene(): void {}
  createNightmareDungeonLegacy(): void {
    // const evilGodric = Array.from({ length: 1 }, () => new EvilGodricNightmare())
    // evilGodric.forEach((evilGodric) => engine.addEntity(evilGodric))
    // const trews = Array.from({ length: 1 }, () => new TrewsNightmare())
    // trews.forEach((trews) => engine.addEntity(trews))
    // const berserker = Array.from({ length: 1 }, () => new BerserkerNightmare())
    // berserker.forEach((berserker) => engine.addEntity(berserker))
    // const undeadKing = Array.from({ length: 1 }, () => new UndeadKingNightmare())
    // undeadKing.forEach((undeadKing) => engine.addEntity(undeadKing))
    // const dragonMothere = Array.from({ length: 1 }, () => new DragonMotherNightmare())
    // dragonMothere.forEach((dragonMothere) => engine.addEntity(dragonMothere))
    // console.log('create easy enemies')
  }

  createHardDungeonLegacy(): void {
    // const evilGodric = Array.from({ length: 1 }, () => new EvilGodric())
    // evilGodric.forEach((evilGodric) => engine.addEntity(evilGodric))
    // const trews = Array.from({ length: 1 }, () => new Trews())
    // trews.forEach((trews) => engine.addEntity(trews))
    // const berserker = Array.from({ length: 1 }, () => new Berserker())
    // berserker.forEach((berserker) => engine.addEntity(berserker))
    // const undeadKing = Array.from({ length: 1 }, () => new UndeadKing())
    // undeadKing.forEach((undeadKing) => engine.addEntity(undeadKing))
    // const dragonMothere = Array.from({ length: 1 }, () => new DragonMother())
    // dragonMothere.forEach((dragonMothere) => engine.addEntity(dragonMothere))
    // console.log("create easy enemies")
  }

  createEasyDungeonLegacy(): void {
    // const evilGodric = Array.from({ length: 1 }, () => new EvilGodricE())
    // evilGodric.forEach((evilGodric) => engine.addEntity(evilGodric))
    // const trews = Array.from({ length: 1 }, () => new TrewsE())
    // trews.forEach((trews) => engine.addEntity(trews))
    // const berserker = Array.from({ length: 1 }, () => new BerserkerE())
    // berserker.forEach((berserker) => engine.addEntity(berserker))
    // const undeadKing = Array.from({ length: 1 }, () => new UndeadKingE())
    // undeadKing.forEach((undeadKing) => engine.addEntity(undeadKing))
    // const dragonMothere = Array.from({ length: 1 }, () => new DragonMotherE())
    // dragonMothere.forEach((dragonMothere) => engine.addEntity(dragonMothere))
    // console.log("create easy enemies")
  }

  moveWalls(wall: number): void {
    // Move the wall after kill the enemies
    switch (wall) {
      case 1:
        Tween.createOrReplace(this.wall1, {
          mode: Tween.Mode.Move({
            start: Transform.getMutable(this.wall1).position,
            end: Vector3.create(50.24, 6.85, 25.35)
          }),
          duration: 4,
          easingFunction: EasingFunction.EF_EASEINSINE
        })
        break
      case 3:
        Tween.createOrReplace(this.wall3, {
          mode: Tween.Mode.Move({
            start: Transform.getMutable(this.wall3).position,
            end: Vector3.create(51.19, 6.85, -9.95)
          }),
          duration: 4,
          easingFunction: EasingFunction.EF_EASEINSINE
        })
        break
      case 4:
        Tween.createOrReplace(this.wall4, {
          mode: Tween.Mode.Move({
            start: Transform.getMutable(this.wall4).position,
            end: Vector3.create(-2.3, 16.47, -43.89)
          }),
          duration: 4,
          easingFunction: EasingFunction.EF_EASEINSINE
        })
        break
      case 5:
        Tween.createOrReplace(this.wall5, {
          mode: Tween.Mode.Move({
            start: Transform.getMutable(this.wall5).position,
            end: Vector3.create(-20.92, 6.29, -2.5)
          }),
          duration: 4,
          easingFunction: EasingFunction.EF_EASEINSINE
        })
        break
      case 6:
        Tween.createOrReplace(this.wall6, {
          mode: Tween.Mode.Move({
            start: Transform.getMutable(this.wall6).position,
            end: Vector3.create(-21.57, 6.29, 34.8)
          }),
          duration: 4,
          easingFunction: EasingFunction.EF_EASEINSINE
        })
        break
    }
  }

  createSoldier(
    position: Vector3,
    type: any,
    attack: number,
    hp: number
  ): void {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, new-cap
      const soldier = new type(position, attack, hp)
    } catch (error) {
      console.log('Failed to create soldier:', error)
    }
  }

  createDungeon(difficulty: Difficulty, location: Location): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (location.CAVE) {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (difficulty.EASY) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const easyEnemyAttack = 20
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const easyEnemyHP = 400
        // createCaveDungeonEnemies(easyEnemyAttack, easyEnemyHP)
        // const wastelandApex = Array.from(
        //     { length: 1 },
        //     () => new EasyCaveDungeonBoss(easyEnemyAttack)
        // )
        // wastelandApex.forEach((wastelandApex) => engine.addEntity(wastelandApex))
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      } else if (difficulty.MEDIUM) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const mediumEnemyAttack = 180
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const mediumEnemyHP = 3600
        // createCaveDungeonEnemies(mediumEnemyAttack, mediumEnemyHP)
        // const wastelandApex = Array.from(
        //     { length: 1 },
        //     () => new MedCaveDungeonBoss(mediumEnemyAttack)
        // )
        // wastelandApex.forEach((wastelandApex) => engine.addEntity(wastelandApex))
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      } else if (difficulty.HARD) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const hardEnemyAttack = 900
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const hardEnemyHP = 9000
        // createCaveDungeonEnemies(hardEnemyAttack, hardEnemyHP)
        // const wastelandApex = Array.from(
        //     { length: 1 },
        //     () => new HardCaveDungeonBoss(hardEnemyAttack)
        // )
        // wastelandApex.forEach((wastelandApex) => engine.addEntity(wastelandApex))
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      } else if (difficulty.NIGHTMARE) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const nightmareEnemyAttack = 2000
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const nightmareEnemyHP = 222500
        // createCaveDungeonEnemies(nightmareEnemyAttack, nightmareEnemyHP)
        // const wastelandApex = Array.from(
        //     { length: 1 },
        //     () => new NightmareCaveDungeonBoss(nightmareEnemyAttack)
        // )
        // wastelandApex.forEach((wastelandApex) => engine.addEntity(wastelandApex))
      } else {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
        console.log(`Invalid difficulty level: ${difficulty}`)
      }
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    } else if (location.DESERT) {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (difficulty.EASY) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const easyEnemyAttack = 8
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const easyEnemyHP = 200
        // createDesertDungeonEnemies(easyEnemyAttack, easyEnemyHP)
        // const wastelandApex = Array.from(
        //     { length: 1 },
        //     () => new EasyDesertDungeonBoss(easyEnemyAttack)
        // )
        // wastelandApex.forEach((wastelandApex) => engine.addEntity(wastelandApex))
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      } else if (difficulty.MEDIUM) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const mediumEnemyAttack = 80
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const mediumEnemyHP = 1200
        // createDesertDungeonEnemies(mediumEnemyAttack, mediumEnemyHP)
        // const wastelandApex = Array.from(
        //     { length: 1 },
        //     () => new MedDesertDungeonBoss(mediumEnemyAttack)
        // )
        // wastelandApex.forEach((wastelandApex) => engine.addEntity(wastelandApex))
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      } else if (difficulty.HARD) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const hardEnemyAttack = 900
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const hardEnemyHP = 9000
        // createCaveDungeonEnemies(hardEnemyAttack, hardEnemyHP)
        // const wastelandApex = Array.from(
        //     { length: 1 },
        //     () => new HardCaveDungeonBoss(hardEnemyAttack)
        // )
        // wastelandApex.forEach((wastelandApex) => engine.addEntity(wastelandApex))
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      } else if (difficulty.NIGHTMARE) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const nightmareEnemyAttack = 2000
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const nightmareEnemyHP = 222500
        //   createCaveDungeonEnemies(nightmareEnemyAttack, nightmareEnemyHP)
        //   const wastelandApex = Array.from(
        //     { length: 1 },
        //     () => new NightmareCaveDungeonBoss(nightmareEnemyAttack)
        // )
        // wastelandApex.forEach((wastelandApex) => engine.addEntity(wastelandApex))
      } else {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
        console.log(`Invalid difficulty level: ${difficulty}`)
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.log(`Invalid location: ${location}`)
    }
  }

  createDesertDungeonEnemies(attack: number, hp: number): void {
    desertSoldierPositions.forEach((position) => {
      // this.createSoldier(position, attack, hp)
    })
  }

  createCaveDungeonEnemies(attack: number, hp: number): void {
    caveSoldierPositions.forEach((position) => {
      // this.createSoldier(position, attack, hp)
    })
  }

  removeAllEntities(): void {
    engine.removeEntity(this.boardParent)
    this.leaderBoard.destroy()
    engine.removeEntity(this.leaderBoard.leaderBoard)
    engine.removeEntity(this.wall1)
    engine.removeEntity(this.wall2)
    engine.removeEntity(this.wall3)
    engine.removeEntity(this.wall4)
    engine.removeEntity(this.wall5)
    engine.removeEntity(this.wall6)
    engine.removeEntity(this.secretwall)
    engine.removeEntity(this.lever)
    engine.removeEntity(this.gem)
    engine.removeEntity(this.sandDungeonSecret)
    engine.removeEntity(this.villager1)
    engine.removeEntity(this.doorOpening)
  }
}
