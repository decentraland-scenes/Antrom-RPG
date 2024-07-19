import { Dialogs } from '../dialog'
import { RealmController } from './realm.controller'
import { UIController } from './ui.controller'

export class GameController {
  uiController: UIController
  realmController: RealmController
  dialogs: Dialogs
  constructor() {
    this.uiController = new UIController(this)
    this.realmController = new RealmController(this)
    this.dialogs = new Dialogs(this)
  }
}
