import { NPCs } from '../NPCs'
import { Dialogs } from '../dialog'
import { RealmController } from './realm.controller'
import { UIController } from './ui.controller'

export class GameController {
  uiController: UIController
  realmController: RealmController
  dialogs: Dialogs
  npcs: NPCs
  constructor() {
    this.uiController = new UIController(this)
    this.realmController = new RealmController(this)
    this.dialogs = new Dialogs(this)
    this.npcs = new NPCs(this)
  }
}
