import * as utils from '@dcl-sdk/utils'
import {
  Animator,
  GltfContainer,
  InputAction,
  PointerEventType,
  PointerEvents,
  Transform,
  engine,
  inputSystem
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { type GameController } from '../controllers/game.controller'
import { Gem, Items, Pot } from '../mineables'
import { setPlayerPosition } from '../utils/engine'
import { getRandomInt } from '../utils/getRandomInt'
import { type Realm, type RealmType } from './types'
import { entityController } from './entityController'
import ExecutionerCaveDungeon from '../enemies/ExecutionerCaveDungeon'

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

export class MinersCave implements Realm {
  private readonly cave = entityController.addEntity()
  private readonly ladder = entityController.addEntity()
  private readonly pot_positions: Vector3[]
  private readonly pots_entities: Pot[]
  private readonly gems_entities: Gem[]
  private readonly difficulty: string
  gameController: GameController
  constructor(gameController: GameController, difficulty: string) {
    this.gameController = gameController
    this.difficulty = difficulty
    this.createCaveDungeonEnemies(this.gameController)
    this.buildCave()
    GltfContainer.create(this.cave, { src: 'assets/models/cave.glb' })
    GltfContainer.create(this.ladder, { src: 'assets/models/CaveLadder.glb' })
    Transform.createOrReplace(this.cave, {
      position: Vector3.create(16, 0, 16),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1)
    })
    Transform.createOrReplace(this.ladder, {
      position: Vector3.create(16, -1, 16),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1)
    })
    Animator.create(this.cave, {
      states: [
        {
          clip: 'idle',
          playing: true,
          loop: true
        }
      ]
    })
    Animator.create(this.ladder, {
      states: [
        {
          clip: 'idle',
          playing: true,
          loop: true
        }
      ]
    })
    PointerEvents.createOrReplace(this.ladder, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Climb ladder!',
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
          this.ladder
        )
      ) {
        // buildWilderness() ??
      }
    })
    this.pot_positions = [
      Vector3.create(60.93, 19.66, -7.77),
      Vector3.create(57.43, 16.34, 13.89),
      Vector3.create(47.04, 19.11, 4.77),
      Vector3.create(60.89, 19.03, 6.88),
      Vector3.create(64.63, 16.82, -18.82),
      Vector3.create(29.42, 3.64, -2.95),
      Vector3.create(9.34, 3.26, 49.69),
      Vector3.create(-8.06, 3.58, 58.6),
      Vector3.create(-28.95, 10.39, 31.44),
      Vector3.create(-8.13, 9.29, 4.94),
      Vector3.create(-44.41, 14.47, 58.02),
      Vector3.create(57.12, 3.26, 74.18),
      Vector3.create(56.24, 16.83, 22.01),
      Vector3.create(30.54, 8.99, 17.27),
      Vector3.create(-47.0, 13.31, 51.81),
      Vector3.create(-13.97, 4.6, 7.01)
    ]
    this.pots_entities = []
    this.pot_positions.forEach(() => {
      const position = Vector3.clone(
        this.pot_positions[getRandomInt(this.pot_positions.length)]
      )
      this.pots_entities.push(
        new Pot(
          this.gameController,
          Items.pot,
          position.x,
          position.y,
          position.z
        )
      )
    })
    this.gems_entities = [
      new Gem(this.gameController, Items.gem),
      new Gem(this.gameController, Items.gem),
      new Gem(this.gameController, Items.gem),
      new Gem(this.gameController, Items.gem),
      new Gem(this.gameController, Items.gem)
    ]
  }

  createSoldier(position: Vector3, gameController: GameController): void {
    console.log('rock soldier created')
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, new-cap
      const soldier = new ExecutionerCaveDungeon(gameController, position)
    } catch (error) {
      console.log('Failed to create soldier:', error)
    }
  }

  createCaveDungeonEnemies(gameController: GameController): void {
    caveSoldierPositions.forEach((position) => {
      this.createSoldier(position, gameController)
    })
  }

  buildCave(): void {
    utils.timers.setTimeout(() => {
      // buildCaveBuilderScene()
      // loader.showLoaderCave(15000)
      utils.timers.setTimeout(() => {
        // createQuestTimerText()
        // quest.turnOnKingQuestTimer()
        setPlayerPosition(69.34, 17.38, -26.64)
      }, 1000)
    }, 50)
  }

  spawnSingleEntity(entityName: string): void {
    switch (entityName) {
      case '':
    }
  }

  removeAllEntities(): void {
    entityController.removeEntity(this.cave)
    entityController.removeEntity(this.ladder)
    this.gems_entities.forEach((gem) => {
      gem.removeGem()
    })
    this.pots_entities.forEach((pot) => {
      pot.removepot()
    })
  }

  deadPosition(): Vector3 | null {
    return null
  }

  getId(): RealmType {
    return 'minersCave'
  }
}
