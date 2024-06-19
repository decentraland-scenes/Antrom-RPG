import { engine } from '@dcl/ecs/dist/runtime/initialization'
import {
  Animator,
  GltfContainer,
  InputAction,
  PointerEventType,
  PointerEvents,
  Transform,
  inputSystem
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { type GameController } from '../controllers/game.controller'

export class DungeonBase {
  private readonly area = engine.addEntity()
  private readonly door1 = engine.addEntity()
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    GltfContainer.createOrReplace(this.area, {
      src: 'assets/models/Fireplace.glb'
    })
    GltfContainer.createOrReplace(this.door1, {
      src: 'assets/models/knightStatue.glb'
    })
    Transform.createOrReplace(this.area, {
      position: Vector3.create(18.07, 40.93, -9.54),
      scale: Vector3.create(2, 2, 2),
      rotation: Quaternion.create(0, 0, 0, 1)
    })
    Transform.createOrReplace(this.door1, {
      position: Vector3.create(0, 0, 0),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(0, 0, 0, 1)
    })
    Animator.create(this.area, {
      states: [
        {
          clip: 'action',
          playing: false,
          loop: true
        }
      ]
    })
    Animator.create(this.door1, {
      states: [
        {
          clip: 'open',
          playing: false,
          loop: false
        },
        {
          clip: 'action',
          playing: false,
          loop: true
        },
        {
          clip: 'close',
          playing: false,
          loop: false
        }
      ]
    })
    Animator.playSingleAnimation(this.area, 'idle')
    Animator.playSingleAnimation(this.door1, 'idle')
    PointerEvents.createOrReplace(this.area, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true
          }
        }
      ]
    })
    PointerEvents.createOrReplace(this.door1, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.area
        )
      ) { /* empty */ }
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.door1
        )
      ) { /* empty */ }
    })
  }
}
