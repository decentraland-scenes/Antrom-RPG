import { type Entity, engine } from '@dcl/sdk/ecs'
import { type GameController } from './controllers/game.controller'
import * as npc from 'dcl-npc-toolkit'
import { openDialogWindow } from 'dcl-npc-toolkit'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

export class NPCs {
  gameController: GameController
  public Guyonknees!: Entity
  public soldierA: Entity | undefined
  public soldierB: Entity | undefined
  public soldierC: Entity | undefined
  public Trews!: Entity
  public Plawman!: Entity
  public Noir!: Entity
  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  createQuest1NPCs(): void {
    this.Guyonknees = engine.addEntity()
    this.Guyonknees = npc.create(
      {
        position: Vector3.create(-38.17, 9.53, -39.78),
        rotation: Quaternion.create(0, 1, 0, 1),
        scale: Vector3.create(1, 1, 1)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/VillagerOnKnees.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.Guyonknees,
            this.gameController.dialogs.guyOnKneesDialog
          )
        },
        onWalkAway: () => {
          console.log('walked away')
        },
        bubbleHeight: 256,
        faceUser: true,
        onlyClickTrigger: true
      }
    )

    this.soldierA = engine.addEntity()
    this.soldierA = npc.create(
      {
        position: Vector3.create(-38.17, 9.53, -42.16),
        rotation: Quaternion.create(0, 1, 0, 1),
        scale: Vector3.create(0.9, 0.9, 0.9)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/DarkKnight.glb',
        onActivate: () => {
          console.log('npc activated', this.soldierA)
        },
        onWalkAway: () => {
          console.log('walked away')
        },
        bubbleHeight: 256,
        faceUser: true,
        onlyClickTrigger: true
      }
    )

    this.soldierB = engine.addEntity()
    this.soldierB = npc.create(
      {
        position: Vector3.create(-40.78, 9.53, -39.66),
        rotation: Quaternion.create(0, 1, 0, 1),
        scale: Vector3.create(0.9, 0.9, 0.9)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/DarkKnight.glb',
        onActivate: () => {
          console.log('npc activated', this.soldierB)
        },
        onWalkAway: () => {
          console.log('walked away')
        },
        bubbleHeight: 256,
        faceUser: true,
        onlyClickTrigger: true
      }
    )

    this.soldierC = engine.addEntity()
    this.soldierC = npc.create(
      {
        position: Vector3.create(-38.05, 9.53, -37.37),
        rotation: Quaternion.create(0, 1, 0, 1),
        scale: Vector3.create(0.9, 0.9, 0.9)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/DarkKnight.glb',
        onActivate: () => {
          console.log('npc activated', this.soldierC)
        },
        onWalkAway: () => {
          console.log('walked away')
        },
        bubbleHeight: 256,
        faceUser: true,
        onlyClickTrigger: true
      }
    )

    this.Trews = engine.addEntity()
    this.Trews = npc.create(
      {
        position: Vector3.create(-34.93, 9.53, -39.42),
        rotation: Quaternion.create(0, -1, 0, 1),
        scale: Vector3.create(1.3, 1.3, 1.3)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/Trews.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(this.Trews, this.gameController.dialogs.trewsDialog)
        },
        onWalkAway: () => {
          console.log('walked away')
        },
        bubbleHeight: 256,
        faceUser: true,
        onlyClickTrigger: true
      }
    )
  }

  createPlowmanNPC(): void {
    this.Plawman = engine.addEntity()
    this.Plawman = npc.create(
      {
        position: Vector3.create(-59.75, 5, -19.05),
        rotation: Quaternion.create(0, -1, 0, 1),
        scale: Vector3.create(1.3, 1.3, 1.3)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/Villager4.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.Plawman,
            this.gameController.dialogs.plawmanDialog
          )
        },
        onWalkAway: () => {
          console.log('walked away')
        },
        bubbleHeight: 256,
        faceUser: true,
        onlyClickTrigger: true
      }
    )
  }

  createNoirNPC(): void {
    this.Noir = engine.addEntity()
    this.Noir = npc.create(
      {
        position: Vector3.create(-41.02, 0, 16.68),
        rotation: Quaternion.create(0, -1, 0, 1),
        scale: Vector3.create(1, 1, 1)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/FarmerMale1.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(this.Noir, this.gameController.dialogs.lukanDialog)
        },
        onWalkAway: () => {
          console.log('walked away')
        },
        bubbleHeight: 256,
        faceUser: true,
        onlyClickTrigger: true
      }
    )
  }
}
