import { type Dialog } from 'dcl-npc-toolkit'
import { type GameController } from './controllers/game.controller'
import { Color4 } from '@dcl/sdk/math'
import { createQuestTimerText } from './utils/refresherTimer'
import { engine } from '@dcl/sdk/ecs'
import { spawnBoss1 } from './enemies/betaBosses/betaBoss1'

export class Dialogs {
  public randomDialog1: Dialog[]
  public randomDialog2: Dialog[]
  public randomDialog3: Dialog[]
  public randomDialog4: Dialog[]
  public randomDialog5: Dialog[]
  public randomDialog6: Dialog[]
  public randomDialog7: Dialog[]
  public randomDialog8: Dialog[]
  public randomDialog81: Dialog[]
  public randomDialog9: Dialog[]
  public randomDialog10: Dialog[]
  public randomDialog11: Dialog[]
  public kingDialog: Dialog[]
  public wizardDialog: Dialog[]
  public witchDialog: Dialog[]
  public lukanDialog: Dialog[]
  public guyOnKneesDialog: Dialog[]
  public trewsDialog: Dialog[]
  public plawmanDialog: Dialog[]
  public vendorDialog: Dialog[]
  public inGameWeaponSmithDialog: Dialog[]
  public garrisonAlaraDialog2: Dialog[]
  public kingCount: number
  gameController: GameController
  constructor(gameController: GameController) {
    this.kingCount = 0
    this.gameController = gameController
    this.lukanDialog = [
      {
        text: `I do not know anything about Lord Callan whereabouts! Even if I did, I wouldn't tell you!`,
        isQuestion: true,
        buttons: [
          {
            label: `Tell me!`,
            goToDialog: 1,
            triggeredActions: () => {
              spawnBoss1()
              engine.removeEntity(this.gameController.npcs.Noir)
            }
          },
          { label: `OK`, goToDialog: 2, triggeredActions: () => {} }
        ]
      },
      {
        name: 'Fight',
        text: `Jameson's Butcher will provide Lord Callan with the opportunity to escape!`,
        isEndOfDialog: true
      },
      {
        name: 'OK',
        text: `Now leave!`,
        isEndOfDialog: true
      }
    ]
    this.plawmanDialog = [
      {
        text: `Welcome to The Plowman's Inn`
      },
      {
        text: `Would you like to rent a room upstairs??`,
        isQuestion: true,
        buttons: [
          {
            label: `Callan?`,
            goToDialog: 4,
            triggeredActions: () => {
              this.gameController.npcs.createNoirNPC()
              this.gameController.uiController.displayAnnouncement(
                'Find Nori \nthe farmer.',
                Color4.Yellow(),
                2000
              )
              engine.removeEntity(this.gameController.npcs.Plawman)
            }
          },
          {
            label: `Yes`,
            goToDialog: 2,
            triggeredActions: () => {}
          },
          { label: `Nope`, goToDialog: 3, triggeredActions: () => {} }
        ]
      },
      {
        name: 'Yes',
        text: `Sorry, we are all out of rooms for the night come back later!`,
        isEndOfDialog: true
      },
      {
        name: 'No',
        text: `Be careful the streets arent safe at night!`,
        isEndOfDialog: true
      },
      {
        name: 'Chryse',
        text: `This hunt for Callan is merely an excuse for the king to oppress the villagers. A farmer named Nori, who tends to Jameson's farm, might possess more information.`,

        isEndOfDialog: true
      }
    ]
    this.trewsDialog = [
      {
        text: `Ah, so you're the aid dispatched by the king? Excellent. We've just been informed by a villager that the plowman might have information regarding Callan's whereabouts.`
      },
      {
        text: `Head to the tavern, where the plowman often frequents, and inquire further.`
      },
      {
        text: `He tends to rent rooms there, so keep an eye out.`,
        isQuestion: true,
        buttons: [
          {
            label: `Plowman?`,
            // to check
            goToDialog: 3,
            triggeredActions: () => {
              this.gameController.npcs.createPlowmanNPC()
              this.gameController.uiController.displayAnnouncement(
                'Find the \nPlowman \nin the tavern.',
                Color4.Yellow(),
                2000
              )
              engine.removeEntity(this.gameController.npcs.Trews)
            }
          },
          {
            label: `No, thanks.`,
            goToDialog: 'OK',
            triggeredActions: () => {}
          }
        ]
      },
      {
        name: 'Plowman',
        text: `Come back when you're ready.`,
        isEndOfDialog: true
      },
      {
        name: 'OK',
        text: `Off you go.`,
        isEndOfDialog: true
      }
    ]
    this.randomDialog1 = [
      {
        text: `I am pleased to meet you.`,
        isQuestion: false,
        buttons: []
      },
      {
        text: `Our town is a bustling hub of activity, with merchants selling their wares,`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `blacksmiths forging weapons and armor, and bards regaling us with their tales.`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `It is a time of great adventure and danger, but also of camaraderie and fellowship.`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `I hope you enjoy your stay in Antrom and make many new friends.`,
        isEndOfDialog: true,

        isQuestion: false,
        buttons: []
      }
    ]
    this.randomDialog2 = [
      {
        text: `I am proud to call this town my home.`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `Our town is surrounded by rolling hills, lush forests, and`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `sparkling rivers, providing us with all the beauty and bounty of nature.`,
        isEndOfDialog: true,

        isQuestion: false,
        buttons: []
      }
    ]
    this.randomDialog3 = [
      {
        text: `I must warn you about the dangers that lurk in the wild.`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `Beyond our town's walls, there are fierce beasts and treacherous`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `landscapes that can pose a threat to even the most skilled adventurers.`,
        isEndOfDialog: true,

        isQuestion: false,
        buttons: []
      }
    ]

    this.randomDialog4 = [
      {
        text: `Have heard tales of the treasures that wait in the depths of the dungeons?`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `It is said that deep beneath the earth, there are vast underground complexes`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `filled with priceless treasures and ancient artifacts.`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `These dungeons are guarded by powerful monsters and deadly traps, making them dangerous to explore.`,
        isEndOfDialog: true,

        isQuestion: false,
        buttons: []
      }
    ]

    this.randomDialog5 = [
      {
        text: `King Gerald is a wise and just ruler.`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `He resides in the magnificent castle that sits at the heart of our town.`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `King Gerald is a powerful warrior, but he is also a skilled diplomat and a visionary leader.`,
        isEndOfDialog: true,

        isQuestion: false,
        buttons: []
      }
    ]

    this.randomDialog6 = [
      {
        text: `I am saddened to hear about our missing general, Callan.`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `He was a brave and loyal member of our town's garrison,`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `and he was well-respected by his fellow soldiers.`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `We can only hope that he will be found safe and sound.`,
        isEndOfDialog: true,

        isQuestion: false,
        buttons: []
      }
    ]

    this.randomDialog7 = [
      {
        text: `Boars are fierce and cunning creatures,`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `and they are a common sight in the forests and fields surrounding our town.`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `To hunt them, one must be patient`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `and alert, and have a steady hand and a sharp eye.`,
        triggeredByNext: () => {
          // showMeatIcon()
        },
        isEndOfDialog: true
      }
    ]

    this.randomDialog8 = [
      {
        text: `Have you heard about the old witch who lives out in the woods?`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `They say she's been there for centuries, practicing dark magic and brewing potions.`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `She's getting old though and needs help collecting WOOD`,
        triggeredByNext: () => {
          // showWoodIcon()
        },
        isEndOfDialog: true
      }
    ]

    this.randomDialog81 = [
      {
        text: `You ran into the crazy shaman? Oh my, what was that like?`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `I've heard so many stories about him, but I've never actually met him myself.`,

        isEndOfDialog: true,

        isQuestion: false,
        buttons: []
      }
    ]

    this.randomDialog9 = [
      {
        text: `Bones are valuable commodities in our town, as they can be used for a variety of purposes.`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `They can be ground into fertilizer to enrich the soil, or they can be crafted into weapons and tools.`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `But collecting bones is no easy task.`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `They must be carefully harvested from the bodies of dead creatures, and this can be a dangerous and unpleasant job.`,
        triggeredByNext: () => {
          // showBoneIcon()
        },
        isEndOfDialog: true
      }
    ]

    this.randomDialog10 = [
      {
        text: `The furnace is a crucial part of our town's economy`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `it is used to smelt ore into metal and forge weapons and armor.`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `Working the furnace is a demanding job, requiring strength, skill, and stamina,`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `but it is also a rewarding job, as it plays a crucial role in our town's prosperity.`,
        triggeredByNext: () => {
          // showIronIcon()
        },
        isEndOfDialog: true
      }
    ]

    this.randomDialog11 = [
      {
        text: `I have heard that a new store is coming soon.`,

        isQuestion: false,
        buttons: []
      },
      {
        text: `This is exciting news, as it will bring new opportunities for shopping and commerce to our town.`,
        isEndOfDialog: true,

        isQuestion: false,
        buttons: []
      }
    ]
    this.guyOnKneesDialog = [
      {
        text: `Please, I have no knowledge where Callan could be; I'm simply passing through!`,
        isEndOfDialog: true
      }
    ]
    this.kingDialog = [
      {
        text: `Ah, finally you have arrived!`
      },
      {
        text: `I need you to find Callan Chryse, a rebel noble with designs upon the throne.`
      },
      {
        text: `His plot was discovered, and he fled with his young daughter, Alara.`,
        isQuestion: true,
        isEndOfDialog: true,
        buttons: [
          {
            label: `Quest`,
            goToDialog: 3,
            triggeredActions: () => {
              if (this.kingCount === 0) {
                this.gameController.npcs.createQuest1NPCs()
                if (
                  this.gameController.realmController.currentRealm
                    ?.removeSingleEntity !== undefined
                ) {
                  this.gameController.realmController.currentRealm?.removeSingleEntity(
                    'KingGeraldOld'
                  )
                }
                createQuestTimerText()
                this.gameController.uiController.displayAnnouncement(
                  'QUEST STARTED',
                  Color4.Yellow(),
                  3000
                )
                this.kingCount++
                //  createCallanQuestLabel()
              } else {
                this.gameController.uiController.displayAnnouncement(
                  'QUEST ALREADY STARTED STARTED FIND CPT TREWS!',
                  Color4.Yellow(),
                  3000
                )
              }
            }
          },
          { label: `No`, goToDialog: 'No', triggeredActions: () => {} }
        ]
      },
      {
        name: 'Yes',
        text: `My spies believe they have located him in the neighbouring farmland. Find Captain Trews and help him bring Chryse to me!`,
        isEndOfDialog: true
      },
      {
        name: 'No',
        text: `Carry on`,
        isEndOfDialog: true
      }
    ]

    this.wizardDialog = [
      {
        text: `Say, do you like magic? I can show you the magic of healing with my viles of berry potion.`,
        triggeredByNext: () => {
          // showBerryIcon()
        }
      },
      {
        text: `Would you like to try? Every 35 Berries will get you one potion to restore 25% hp!`,
        isQuestion: true,
        buttons: [
          {
            label: `35 Berries`,
            goToDialog: 'Yes',
            triggeredActions: () => {
              // if (player.inventory.getItemCount(ITEM_TYPES.BERRY) >= 35) {
              //     if (tutorialChecker.isTutorialActive) {
              //         tutorialDialogWindow.openDialogWindow(
              //             guideWitchDialog,
              //             11
              //         )
              //     }
              //     player.inventory.incrementItem(ITEM_TYPES.POTION, 1)
              //     player.inventory.reduceItem(ITEM_TYPES.BERRY, 35)
              //     player.writeDataToServer()
              // } else {
              this.gameController.uiController.displayAnnouncement(
                'You dont have enough berries',
                Color4.Yellow(),
                3000
              )
              // }
            }
          },
          {
            label: `100 Berries`,
            goToDialog: 'Yes',
            triggeredActions: () => {
              // if (
              //     player.inventory.getItemCount(ITEM_TYPES.BERRY) >= 100
              // ) {
              //     player.inventory.incrementItem(ITEM_TYPES.POTION, 3)
              //     player.inventory.reduceItem(ITEM_TYPES.BERRY, 100)
              //     player.writeDataToServer()
              // } else {
              this.gameController.uiController.displayAnnouncement(
                'You dont have enough berries',
                Color4.Yellow(),
                3000
              )
              // }
            }
          },
          {
            label: `500 Berries`,
            goToDialog: 'Yes',
            triggeredActions: () => {
              // if (
              //     player.inventory.getItemCount(ITEM_TYPES.BERRY) >= 500
              // ) {
              //     player.inventory.incrementItem(ITEM_TYPES.POTION, 20)
              //     player.writeDataToServer()
              //     player.inventory.reduceItem(ITEM_TYPES.BERRY, 500)
              //     player.writeDataToServer()
              // } else {
              this.gameController.uiController.displayAnnouncement(
                'You dont have enough berries',
                Color4.Yellow(),
                3000
              )
              // }
            }
          },
          {
            label: `I'm busy`,
            goToDialog: 'No1',
            triggeredActions: () => {}
          }
        ]
      },
      {
        name: 'Yes',
        text: `Enjoy!`,
        isEndOfDialog: true
      },
      {
        name: 'No1',
        text: `Okay then, but don't go complaining later.`,
        isEndOfDialog: true
      }
    ]

    this.witchDialog = [
      {
        text: `Heheh, I have a suit of armor that you might be interested in.`
      },
      {
        text: `Its a magical armor, imbued with powerful spells and ancient enchantments...`
      },
      {
        text: `In exchange for this armor, I ask only for 50 MEAT to cook on this fire.`
      },
      {
        text: `Kill the chickens near the windmill for MEAT!`
      },
      {
        text: `Will you accept this trade and use the armor to safeguard your future?`,
        isQuestion: true,
        buttons: [
          {
            label: `YES`,
            goToDialog: 'Yes',
            triggeredActions: () => {
              // if (
              //     //player is a "rebel" swap avatar for knight without a weapon glb
              //     player.alliance === Alliance.REBELS &&
              //     player.inventory.getItemCount(ITEM_TYPES.CHICKEN) >= 50
              // ) {
              //     player.addAvatarModel("assets/models/Knight.glb", 1)
              //     player?.SwapModel(new GLTFShape("assets/models/Knight.glb"))
              //     player.inventory.reduceItem(ITEM_TYPES.CHICKEN, 50)
              //     createNPC("Vendor")
              //     loader.showShamanLoader(5000)
              //     player.writeDataToServer()
              this.gameController.uiController.displayAnnouncement(
                'YOU HAVE ARMOR',
                Color4.Yellow(),
                3000
              )
              // } else if (
              //     player.alliance === Alliance.DISCIPLES &&
              //     player.inventory.getItemCount(ITEM_TYPES.CHICKEN) >= 50
              // ) {
              //     player.addAvatarModel("assets/models/Executioner.glb", 1)
              //     player?.SwapModel(
              //         new GLTFShape("assets/models/Executioner.glb")
              //     )
              //     player.inventory.reduceItem(ITEM_TYPES.CHICKEN, 50)
              //     createNPC("Vendor")
              //     loader.showShamanLoader(5000)
              //     player.writeDataToServer()
              this.gameController.uiController.displayAnnouncement(
                'YOU HAVE ARMOR',
                Color4.Yellow(),
                3000
              )
              // } else {
              this.gameController.uiController.displayAnnouncement(
                'YOU DONT HAVE ENOUGH MEAT',
                Color4.Yellow(),
                3000
              )
              // }
            }
          },
          { label: `No`, goToDialog: 'No', triggeredActions: () => {} }
        ]
      },
      {
        name: 'Yes',
        text: `Theres an crazy shaman giving away a weapon around here somewhere...`,
        isEndOfDialog: true
      },
      {
        name: 'No',
        text: `Have a great day!`,
        isEndOfDialog: true
      }
    ]

    this.vendorDialog = [
      {
        text: `I have a weapon that I would like to give you.`
      },
      {
        text: `It is a powerful tool, crafted with skill.`
      },
      {
        text: `In exchange for this weapon, I ask only for 50 IRON ORE for crafting.`
      },
      {
        text: `Behind the Great Castle of Antrom you will find plenty of IRON ORE!`
      },
      {
        text: `Will you accept this trade and use the weapon to secure your future?`,
        isQuestion: true,
        buttons: [
          {
            label: `YES`,
            goToDialog: 'Yes',
            triggeredActions: () => {
              // if (
              //     //player is a "rebel" swap avatar for knight with a weapon glb
              //     player.alliance === Alliance.REBELS &&
              //     player.inventory.getItemCount(ITEM_TYPES.ROCK) >= 50
              // ) {
              //     //add armored knight with a weapon glb
              //     player.addAvatarModel("assets/models/KnightSword.glb", 2)
              //     player?.SwapModel(
              //         new GLTFShape("assets/models/KnightSword.glb")
              //     )
              //     player.inventory.reduceItem(ITEM_TYPES.ROCK, 50)
              //     loader.showAPLoader(5000)
              //     player.writeDataToServer()
              //     // AddAvatarModels('assets/models/KnightSword.glb', 2)
              this.gameController.uiController.displayAnnouncement(
                'YOU HAVE A WEAPON',
                Color4.Yellow(),
                3000
              )
              // } else if (
              //     //player is a "disciple" swap avatar for executioner with a weapon glb
              //     player.alliance === Alliance.DISCIPLES &&
              //     player.inventory.getItemCount(ITEM_TYPES.ROCK) >= 50
              // ) {
              //     //add armored executioner with a weapon glb
              //     player.addAvatarModel("assets/models/ExecutionerAxe.glb", 2)
              //     player?.SwapModel(
              //         new GLTFShape("assets/models/ExecutionerAxe.glb")
              //     )
              //     player.inventory.reduceItem(ITEM_TYPES.ROCK, 50)
              //     loader.showAPLoader(5000)
              //     player.writeDataToServer()
              this.gameController.uiController.displayAnnouncement(
                'YOU HAVE A WEAPON',
                Color4.Yellow(),
                3000
              )
              // } else {
              this.gameController.uiController.displayAnnouncement(
                'YOU DONT HAVE ENOUGH IRON ORE',
                Color4.Yellow(),
                3000
              )
              // }
            }
          },
          { label: `No`, goToDialog: 'No', triggeredActions: () => {} }
        ]
      },
      {
        name: 'Yes',
        text: `Go forth and conquer the Wild!`,
        isEndOfDialog: true
      },
      {
        name: 'No',
        text: `Have a great day!`,
        isEndOfDialog: true
      }
    ]
    this.inGameWeaponSmithDialog = [
      {
        text: `Hark, brave adventurer! 'Tis I, the Keeper of Enchantments. I possess rare and powerful items that can aid thee on thy journey`
      },
      {
        text: `With these enchanted trinkets, you can increase your base stats of attack, defense, and luck.`,
        isEndOfDialog: true
      }
    ]
    this.garrisonAlaraDialog2 = [
      {
        text: `Prepare yourself before facing him. Ensure you're fully healed and ready to confront his formidable skills. Utilize your own abilities wisely to emerge victorious against him. Good luck!`,
        isEndOfDialog: true
      }
    ]
  }

  // createQuest1NPCs(): void {
  //   let Guyonknees = engine.addEntity()
  //   Guyonknees = npc.create(
  //     {
  //       position: Vector3.create(-38.17, 9.53, -39.78),
  //       rotation: Quaternion.create(0, 1, 0, 1),
  //       scale: Vector3.create(1, 1, 1)
  //     },
  //     {
  //       type: npc.NPCType.CUSTOM,
  //       model: 'assets/models/VillagerOnKnees.glb',
  //       onActivate: () => {
  //         console.log('npc activated')
  //         openDialogWindow(
  //           Guyonknees,
  //           this.gameController.dialogs.guyOnKneesDialog
  //         )
  //       },
  //       onWalkAway: () => {
  //         console.log('walked away')
  //       },
  //       bubbleHeight: 256,
  //       faceUser: true,
  //       onlyClickTrigger: true
  //     }
  //   )

  //   let soldierA = engine.addEntity()
  //   soldierA = npc.create(
  //     {
  //       position: Vector3.create(-38.17, 9.53, -42.16),
  //       rotation: Quaternion.create(0, 1, 0, 1),
  //       scale: Vector3.create(0.9, 0.9, 0.9)
  //     },
  //     {
  //       type: npc.NPCType.CUSTOM,
  //       model: 'assets/models/DarkKnight.glb',
  //       onActivate: () => {
  //         console.log('npc activated', soldierA)
  //       },
  //       onWalkAway: () => {
  //         console.log('walked away')
  //       },
  //       bubbleHeight: 256,
  //       faceUser: true,
  //       onlyClickTrigger: true
  //     }
  //   )

  //   let soldierB = engine.addEntity()
  //   soldierB = npc.create(
  //     {
  //       position: Vector3.create(-40.78, 9.53, -39.66),
  //       rotation: Quaternion.create(0, 1, 0, 1),
  //       scale: Vector3.create(0.9, 0.9, 0.9)
  //     },
  //     {
  //       type: npc.NPCType.CUSTOM,
  //       model: 'assets/models/DarkKnight.glb',
  //       onActivate: () => {
  //         console.log('npc activated', soldierB)
  //       },
  //       onWalkAway: () => {
  //         console.log('walked away')
  //       },
  //       bubbleHeight: 256,
  //       faceUser: true,
  //       onlyClickTrigger: true
  //     }
  //   )

  //   let soldierC = engine.addEntity()
  //   soldierC = npc.create(
  //     {
  //       position: Vector3.create(-38.05, 9.53, -37.37),
  //       rotation: Quaternion.create(0, 1, 0, 1),
  //       scale: Vector3.create(0.9, 0.9, 0.9)
  //     },
  //     {
  //       type: npc.NPCType.CUSTOM,
  //       model: 'assets/models/DarkKnight.glb',
  //       onActivate: () => {
  //         console.log('npc activated', soldierC)
  //       },
  //       onWalkAway: () => {
  //         console.log('walked away')
  //       },
  //       bubbleHeight: 256,
  //       faceUser: true,
  //       onlyClickTrigger: true
  //     }
  //   )

  //   let Trews = engine.addEntity()
  //   Trews = npc.create(
  //     {
  //       position: Vector3.create(-34.93, 9.53, -39.42),
  //       rotation: Quaternion.create(0, -1, 0, 1),
  //       scale: Vector3.create(1.3, 1.3, 1.3)
  //     },
  //     {
  //       type: npc.NPCType.CUSTOM,
  //       model: 'assets/models/Trews.glb',
  //       onActivate: () => {
  //         console.log('npc activated')
  //         openDialogWindow(Trews, this.gameController.dialogs.trewsDialog)
  //       },
  //       onWalkAway: () => {
  //         console.log('walked away')
  //       },
  //       bubbleHeight: 256,
  //       faceUser: true,
  //       onlyClickTrigger: true
  //     }
  //   )
  // }
}
