import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { LEVEL_TYPES } from '../player/LevelManager'
import MonsterMob from './MonsterMob'
import { Player } from '../player/player'
import { type GameController } from '../controllers/game.controller'
import { DungeonStage, desertDungeonMonsterCount } from '../counters'
import { Transform } from '@dcl/sdk/ecs'
import { getRandomInt, getRandomIntRange } from '../utils/getRandomInt'
import { ITEM_TYPES } from '../inventory/playerInventoryMap'

export default class ExecutionerDesertDungeon extends MonsterMob {
  shapeFile = 'assets/models/desertnpcM.glb'
  hoverText = `Attack Apex Ahau Disciple!`

  gameController: GameController
  constructor(gameController: GameController, initialPos: Vector3) {
    const player = Player.getInstanceOrNull()
    const level = player?.levels.getLevel(LEVEL_TYPES.PLAYER) ?? 1
    const stage = DungeonStage.read()
    super(5 + stage * 7, level + 100, level + 1, 50)
    this.gameController = gameController
    this.minLuck = 20

    Transform.createOrReplace(this.entity, {
      position: Vector3.create(0, 0, 0)
    })
    this.initMonster()
    super.setupAttackTriggerBox()
    super.setupEngageTriggerBox()
    this.loadTransformation(initialPos)
    this.setTopOffset(2.25)
    this.dropRate = -2
  }

  onDropXp(): void {
    const xp = getRandomIntRange(this.xp, this.xp + 10)
    console.log(xp)
    desertDungeonMonsterCount.increase(1)

    // let damage = player.levels.getLevel(LEVEL_TYPES.PLAYER) * 5
    // if (player.levels.getLevel(LEVEL_TYPES.PLAYER) >= 60) {
    //   damage = player.levels.getLevel(LEVEL_TYPES.PLAYER) * 10
    // }

    // const doorOpeningSource = globalThis.doorOpeningSource

    // ui.displayAnnouncement(`${easyDungeonMonsterCount1.read()}`)

    if (desertDungeonMonsterCount.read() === 1) {
      this.gameController.uiController.displayAnnouncement(
        'room 1 opens',
        Color4.Yellow(),
        2000
      )
      if (
        this.gameController.realmController.currentRealm?.removeSingleEntity !==
        undefined
      ) {
        this.gameController.realmController.currentRealm?.removeSingleEntity(
          'wall6'
        )
      }
      // TODO lerp animation
    }

    if (desertDungeonMonsterCount.read() === 2) {
      this.gameController.uiController.displayAnnouncement(
        'room 2 opens',
        Color4.Yellow(),
        2000
      )
      if (
        this.gameController.realmController.currentRealm?.removeSingleEntity !==
        undefined
      ) {
        this.gameController.realmController.currentRealm?.removeSingleEntity(
          'wall5'
        )
      }
    }

    if (desertDungeonMonsterCount.read() === 3) {
      this.gameController.uiController.displayAnnouncement(
        'room 3 opens',
        Color4.Yellow(),
        2000
      )
      if (
        this.gameController.realmController.currentRealm?.removeSingleEntity !==
        undefined
      ) {
        this.gameController.realmController.currentRealm?.removeSingleEntity(
          'wall4'
        )
      }
    }

    if (desertDungeonMonsterCount.read() === 4) {
      this.gameController.uiController.displayAnnouncement(
        'room 4 opens',
        Color4.Yellow(),
        2000
      )
      if (
        this.gameController.realmController.currentRealm?.removeSingleEntity !==
        undefined
      ) {
        this.gameController.realmController.currentRealm?.removeSingleEntity(
          'wall3'
        )
      }
    }

    if (desertDungeonMonsterCount.read() === 5) {
      this.gameController.uiController.displayAnnouncement(
        'room 6 opens',
        Color4.Yellow(),
        2000
      )
      if (
        this.gameController.realmController.currentRealm?.removeSingleEntity !==
        undefined
      ) {
        this.gameController.realmController.currentRealm?.removeSingleEntity(
          'wall1'
        )
      }
      desertDungeonMonsterCount.decrease(47)
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
    console.log(exp, loot)
    // UI ? addRewards(exp, loot)
    // DailyQuestHUD.getInstance().listenAndUpdateForAnyActiveQuest(
    //   LEVEL_TYPES.ENEMY
    // )
  }

  onDropLoot(): void {}

  setupAttackTriggerBox(): void {
    super.setupAttackTriggerBox()
  }

  create(): void {}

  loadTransformation(initialPos: Vector3): void {
    const initialPosition = Vector3.create(
      initialPos.x,
      initialPos.y,
      initialPos.z
    )
    const initialRotation = Quaternion.fromEulerDegrees(
      0,
      getRandomInt(10) / 10 + getRandomInt(4),
      0
    )
    Transform.createOrReplace(this.entity, {
      position: initialPosition,
      rotation: initialRotation
    })
  }
}
