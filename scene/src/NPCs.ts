import { type Entity } from '@dcl/sdk/ecs'
import { type GameController } from './controllers/game.controller'
import * as npc from 'dcl-npc-toolkit'
import { openDialogWindow } from 'dcl-npc-toolkit'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { entityController } from './realms/entityController'

export class NPCs {
  gameController: GameController
  public Guyonknees!: Entity
  public Alara!: Entity
  public soldierA!: Entity
  public soldierB!: Entity
  public soldierC!: Entity
  public Trews!: Entity
  public Plawman!: Entity
  public Noir!: Entity
  public Chryse!: Entity
  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  createQuest1NPCs(): void {
    this.Guyonknees = entityController.addEntity()
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

    this.soldierA = entityController.addEntity()
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

    this.soldierB = entityController.addEntity()
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

    this.soldierC = entityController.addEntity()
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

    this.Trews = entityController.addEntity()
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
    this.Plawman = entityController.addEntity()
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
    this.Noir = entityController.addEntity()
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

  createChryseNPC(): void {
    this.Chryse = entityController.addEntity()
    this.Chryse = npc.create(
      {
        position: Vector3.create(-41.39, 0, 26.89),
        rotation: Quaternion.create(0, 1, 0, 1),
        scale: Vector3.create(1.2, 1.2, 1.2)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/Villager2.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.Chryse,
            this.gameController.dialogs.FoundChryseDialog
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

    this.soldierC = entityController.addEntity()
    this.soldierC = npc.create(
      {
        position: Vector3.create(-40.04, 0, 25.11),
        rotation: Quaternion.create(0, -1, 0, 1),
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

    this.Trews = entityController.addEntity()
    this.Trews = npc.create(
      {
        position: Vector3.create(-41.27, 0, 29.25),
        rotation: Quaternion.create(0, -1, 0, 1),
        scale: Vector3.create(1.3, 1.3, 1.3)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/Trews.glb',
        onActivate: () => {
          console.log('npc activated')
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

  createAlara1NPC(): void {
    this.Alara = entityController.addEntity()
    this.Alara = npc.create(
      {
        position: Vector3.create(85.65, 3.18, 72.26),
        rotation: Quaternion.create(0, -1, 0, 1),
        scale: Vector3.create(1, 1, 1)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/FemKnight_withoutArmor.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.Alara,
            this.gameController.dialogs.alaraWakenUpDialog
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

  createAlara2NPC(): void {
    this.Alara = entityController.addEntity()
    this.Alara = npc.create(
      {
        position: Vector3.create(-52.16, 9.55, -56.47),
        rotation: Quaternion.create(0, -1, 0, 1),
        scale: Vector3.create(1, 1, 1)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/FemKnight.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.Alara,
            this.gameController.dialogs.alaraCallToArmsDialog
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

  createChryseJailedNPCs(): void {
    this.Chryse = entityController.addEntity()
    this.Chryse = npc.create(
      {
        position: Vector3.create(-52.93, 4.15, -42.99),
        rotation: Quaternion.create(0, -1, 0, 1),
        scale: Vector3.create(1.2, 1.2, 1.2)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/Villager2.glb',
        onActivate: () => {
          console.log('npc activated')
          openDialogWindow(
            this.Chryse,
            this.gameController.dialogs.foundChryseGarrisonDialog
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
}
