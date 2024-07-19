import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import MonsterOligar from '../monster'
import {
  Billboard,
  MeshRenderer,
  Transform,
  VisibilityComponent,
  engine
} from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils'
import { getRandomInt } from '../../utils/getRandomInt'
import { type GameController } from '../../controllers/game.controller'
import { Player } from '../../player/player'

const DEFAULT_XP = 240

const POSITIONS = [
  Vector3.create(4.6, 0.49, 2.46),
  Vector3.create(28.81, 0.49, -14.8),
  Vector3.create(6.52, 3.57, 43.26),
  Vector3.create(19.25, 3.52, -13.19),
  Vector3.create(25.69, 3.48, -9.83),
  Vector3.create(27.36, 3.52, 0.79),
  Vector3.create(14.25, 3.48, 2.96),
  Vector3.create(5.29, 3.48, 1.34),
  Vector3.create(-8.6, 2.45, -29.49),
  Vector3.create(-9.98, 2.59, -43.28),
  Vector3.create(37.91, 2.52, 36.32),
  Vector3.create(24.46, 2.58, 44.96)
]

// CHECK TYPE HEALER
export default class HalloweenButcher extends MonsterOligar {
  shapeFile = 'assets/models/Butcher.glb'
  hoverText = 'Attack the butcher!'
  gameController: GameController
  constructor(gameController: GameController) {
    const player = Player.getInstance()
    super(player.attack + 7, DEFAULT_XP, player.level, player.maxHealth)
    this.initMonster()
    this.gameController = gameController
  }

  onDropLoot(): void {
    // TODO in player player.writeDataToServer()
    this.gameController.uiController.displayAnnouncement(
      `You Collected /3 pumpkins from the butchers.`,
      Color4.Red(),
      3000
    )
  }

  setupAttackTriggerBox(): void {
    this.attackTrigger = engine.addEntity()
    Transform.create(this.attackTrigger, { parent: this.entity })
    MeshRenderer.setBox(this.attackTrigger)
    VisibilityComponent.create(this.attackTrigger, { visible: false })
    utils.triggers.addTrigger(
      this.attackTrigger,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(4, 2, 4) }],
      () => {
        console.log('<<< Attack >>>')
        Billboard.create(this.entity, {})
      },
      () => {
        console.log('im out')
        if (this.healthBar != null) engine.removeEntity(this.healthBar)
        if (this.label != null) engine.removeEntity(this.label)
      }
    )
  }

  create(): void {}

  loadTransformation(): void {
    const initialPosition = POSITIONS[getRandomInt(POSITIONS.length)]
    const initialRotation = Quaternion.fromEulerDegrees(
      0,
      getRandomInt(10) / 10 + getRandomInt(4),
      0
    )
    Transform.createOrReplace(this.entity, {
      position: initialPosition,
      rotation: initialRotation,
      scale: Vector3.create(1.5, 1.5, 1.5)
    })
  }
}
