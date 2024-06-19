import * as utils from '@dcl-sdk/utils'
import {
  Animator,
  GltfContainer,
  InputAction,
  PointerEventType,
  PointerEvents,
  Transform,
  engine,
  executeTask,
  inputSystem
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { movePlayerTo } from '~system/RestrictedActions'
import { getWorldTime } from '~system/Runtime'
import { Gem, Items, Pot } from '../mineables'
import { type GameController } from '../controllers/game.controller'
import { getRandomInt } from '../utils/getRandomInt'

export class MinersCave {
  private readonly cave = engine.addEntity()
  private readonly ladder = engine.addEntity()
  private readonly pot_positions: Vector3[]
  private readonly pots_entities: Pot[]
  private readonly gems_entities: Gem[]
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    GltfContainer.create(this.cave, { src: 'models/cave.glb' })
    GltfContainer.create(this.ladder, { src: 'models/CaveLadder.glb' })
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
    executeTask(async () => {
      const time = await getWorldTime({})
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      time.seconds < 6.25 * 60 * 60 || time.seconds > 19.85 * 60 * 60
      console.log(time.seconds)
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

  buildCave(): void {
    utils.timers.setTimeout(() => {
      // buildCaveBuilderScene()
      // loader.showLoaderCave(15000)
      utils.timers.setTimeout(() => {
        // createQuestTimerText()
        // quest.turnOnKingQuestTimer()
        void movePlayerTo({
          newRelativePosition: Vector3.create(69.38, 17.73, -24.05)
        })
      }, 15000)
    }, 50)
  }

  removeAllEntities(): void {
    engine.removeEntity(this.cave)
    engine.removeEntity(this.ladder)
    this.gems_entities.forEach((gem) => {
      gem.removeGem()
    })
    this.pots_entities.forEach((pot) => {
      pot.removepot()
    })
  }
}
