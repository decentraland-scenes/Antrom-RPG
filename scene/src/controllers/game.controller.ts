import { Dialogs } from '../dialog'
import { RealmController } from './realm.controller'
import { UIController } from './ui.controller'

export class GameController {
  uicontroller: UIController
  realmController: RealmController
  dialogs: Dialogs
  constructor() {
    this.uicontroller = new UIController(this)
    this.realmController = new RealmController(this)
    this.dialogs = new Dialogs(this)
  }
}
