import { NPCs } from '../NPCs'
import { Dialogs } from '../dialog'
import { SendWearable } from '../menu/wearableMenus'
import { RealmController } from './realm.controller'
import { UIController } from './ui.controller'

export class GameController {
  uiController: UIController
  realmController: RealmController
  dialogs: Dialogs
  npcs: NPCs
  sendWearable: SendWearable
  constructor() {
    this.uiController = new UIController(this)
    this.realmController = new RealmController(this)
    this.dialogs = new Dialogs(this)
    this.npcs = new NPCs(this)
    this.sendWearable = new SendWearable(this)
  }
}

let currentGameController: GameController
export function getCurrentGameController(): GameController {
  return currentGameController
}

export function setCurrentGameController(controller: GameController): void {
  currentGameController = controller
}
