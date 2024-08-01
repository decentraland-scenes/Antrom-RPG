import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { LEVEL_TYPES } from '../player/LevelManager'
import MonsterMob from './MonsterMob'
import { Player } from '../player/player'
import { type GameController } from '../controllers/game.controller'
import { DungeonStage, caveDungeonMonsterCount } from '../counters'
import { Transform } from '@dcl/sdk/ecs'
import { getRandomInt, getRandomIntRange } from '../utils/getRandomInt'
import { ITEM_TYPES } from '../inventory/playerInventoryMap'

export default class ExecutionerCaveDungeon extends MonsterMob {
  shapeFile = 'assets/models/RockMonster.glb'
  hoverText = `Attack Metapsammite Disciple!`

  gameController: GameController
  constructor(gameController: GameController, initialPos: Vector3) {
    const player = Player.getInstanceOrNull()
    const level = player?.levels.getLevel(LEVEL_TYPES.PLAYER) ?? 1
    const stage = DungeonStage.read()
    super(5 + stage * 7, level + 100, level + 1, 10)
    this.gameController = gameController
    this.minLuck = 20

    Transform.createOrReplace(this.entity, {
      position: Vector3.create(0, 0, 0)
    })
    this.initMonster()
    super.setupEngageTriggerBox()
    this.loadTransformation(initialPos)
    this.setTopOffset(2.25)
    this.dropRate = -2
  }

  onDropXp(): void {
    const xp = getRandomIntRange(this.xp, this.xp + 10)
    console.log(xp)
    caveDungeonMonsterCount.increase(1)
    this.gameController.uiController.displayAnnouncement(
      `${caveDungeonMonsterCount.read()}`
    )
    // ui.displayAnnouncement(`${easyDungeonMonsterCount1.read()}`)

    if (caveDungeonMonsterCount.read() === 6) {
      this.gameController.uiController.displayAnnouncement(
        'Cube Removed!',
        Color4.Yellow(),
        2000
      )
      if (
        this.gameController.realmController.currentRealm?.removeSingleEntity !==
        undefined
      ) {
        // remove cube 1 and 2
      }

      if (caveDungeonMonsterCount.read() === 21) {
        this.gameController.uiController.displayAnnouncement(
          'Cube Removed!',
          Color4.Yellow(),
          2000
        )
        if (
          this.gameController.realmController.currentRealm
            ?.removeSingleEntity !== undefined
        ) {
          // Remove cube 3
        }
      }

      if (caveDungeonMonsterCount.read() === 27) {
        this.gameController.uiController.displayAnnouncement(
          'Cube Removed!',
          Color4.Yellow(),
          2000
        )
        if (
          this.gameController.realmController.currentRealm
            ?.removeSingleEntity !== undefined
        ) {
          // Remove cube 4
        }
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
