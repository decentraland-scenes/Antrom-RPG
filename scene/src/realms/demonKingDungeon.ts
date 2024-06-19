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
import { Vector3, Quaternion, Color4 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { movePlayerTo } from '~system/RestrictedActions'
import { type GameController } from '../controllers/game.controller'
import { DungeonStage, demonKill } from '../counters'
import * as npc from 'dcl-npc-toolkit'
import { openDialogWindow } from 'dcl-npc-toolkit'

export class DemonKingDungeon {
  private readonly dungeon_collider = engine.addEntity()
  private readonly dungeon_door1 = engine.addEntity()
  private readonly dungeon = engine.addEntity()
  private readonly dungeon_props1 = engine.addEntity()
  private readonly dungeon_platforms = engine.addEntity()
  private npc_garrisonAlara = engine.addEntity()
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    GltfContainer.createOrReplace(this.dungeon_collider, {
      src: 'assets/models/Dungeon_collider.glb'
    })
    GltfContainer.createOrReplace(this.dungeon_door1, {
      src: 'assets/models/Dungeon_Door1.glb'
    })
    GltfContainer.createOrReplace(this.dungeon, {
      src: 'assets/models/Dungeon.glb'
    })
    GltfContainer.createOrReplace(this.dungeon_props1, {
      src: 'assets/models/DungeonProps1.glb'
    })
    GltfContainer.createOrReplace(this.dungeon_platforms, {
      src: 'assets/models/Dungeon_Platforms.glb'
    })
    Transform.createOrReplace(this.dungeon_collider, {
      position: Vector3.create(16, 50, 16),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1)
    })
    Animator.create(this.dungeon_door1, {
      states: [
        {
          clip: 'open',
          playing: false,
          loop: false
        },
        {
          clip: 'close',
          playing: false,
          loop: false
        },
        {
          clip: 'idle',
          playing: false,
          loop: false
        }
      ]
    })
    Animator.create(this.dungeon, {
      states: [
        {
          clip: 'action',
          playing: false,
          loop: true
        }
      ]
    })
    Animator.create(this.dungeon_platforms, {
      states: [
        {
          clip: 'action',
          playing: false,
          loop: true
        }
      ]
    })
    Animator.playSingleAnimation(this.dungeon_door1, 'idle')
    Animator.playSingleAnimation(this.dungeon, 'action')
    Animator.playSingleAnimation(this.dungeon_platforms, 'action')
    PointerEvents.createOrReplace(this.dungeon_door1, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Open door!',
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
          this.dungeon_door1
        )
      ) {
        if (demonKill.read() === 1) {
          Animator.playSingleAnimation(this.dungeon_door1, 'open')
          demonKill.decrease(1)
          //   removeNPCFromMap('GarrisonAlara')
          this.createGarrisonAlara2()
          this.npc_garrisonAlara = engine.addEntity()
          utils.timers.setTimeout(() => {
            Animator.playSingleAnimation(this.dungeon_door1, 'idle')
          }, 60 * 1000)
        } else {
          this.gameController.uicontroller.displayAnnouncement(
            'Defeat the Oligar!',
            Color4.Yellow(),
            3000
          )
        }
      }
    })
    Transform.create(this.dungeon_door1, { parent: this.dungeon_collider })
    Transform.create(this.dungeon, { parent: this.dungeon_collider })
    Transform.create(this.dungeon_props1, { parent: this.dungeon_collider })
    Transform.create(this.dungeon_platforms, { parent: this.dungeon_collider })
    this.buildDemonKingDungeon()
  }

  buildDemonKingDungeon(): void {
    if (DungeonStage.read() <= 2) {
      // loader.showGarrisonscreen(8000)
    }
    utils.timers.setTimeout(() => {
      void movePlayerTo({
        newRelativePosition: Vector3.create(-9.83, 48.19, -45.24)
      })
    }, 8000)
  }

  createGarrisonAlara2(): void {
    this.npc_garrisonAlara = npc.create(
      {
        position: Vector3.create(14.57, 67.44, -3.22),
        rotation: Quaternion.create(0, 1, 0, 1),
        scale: Vector3.create(1, 1, 1)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/FemKnight.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.npc_garrisonAlara,
            this.gameController.dialogs.garrisonAlaraDialog2
          )
        },
        idleAnim: `idle`,
        faceUser: true,
        darkUI: true,
        coolDownDuration: 3,
        hoverText: 'Alara',
        onlyClickTrigger: true,
        onlyExternalTrigger: false,
        reactDistance: 3,
        continueOnWalkAway: false,
        onWalkAway: () => {
          console.log('walked away')
        }
      }
    )
  }

  removeAllEntities(): void {
    engine.removeEntity(this.dungeon_collider)
    engine.removeEntity(this.dungeon_door1)
    engine.removeEntity(this.dungeon)
    engine.removeEntity(this.dungeon_props1)
    engine.removeEntity(this.dungeon_platforms)
    engine.removeEntity(this.npc_garrisonAlara)
  }
}
