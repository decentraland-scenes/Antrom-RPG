import { Antrom } from '../realms/antrom'
import { DemonKingDungeon } from '../realms/demonKingDungeon'
import { Dungeon } from '../realms/dungeon'
import { DungeonBase } from '../realms/dungeonBase'
import { entityController } from '../realms/entityController'
import { MinersCave } from '../realms/minerscave'
import { type RealmType, type Realm } from '../realms/types'
import { type GameController } from './game.controller'

export class RealmController {
  public currentRealm: Realm | null = null
  gameController: GameController

  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  switchRealm(realm: RealmType): void {
    this.cleanUpScene()

    // TODO: utils and npc library should be cleaned as well
    entityController.clean()

    switch (realm) {
      case 'antrom':
        this.currentRealm = new Antrom(this.gameController)
        break
      case 'demonKingDungeon':
        this.currentRealm = new DemonKingDungeon(this.gameController)
        break
      case 'dungeon':
        this.currentRealm = new Dungeon(this.gameController)
        break
      case 'dungeonBase':
        this.currentRealm = new DungeonBase(this.gameController)
        break
      case 'minersCave':
        this.currentRealm = new MinersCave(this.gameController)
        break
    }
  }

  cleanUpScene(): void {
    this.currentRealm?.removeAllEntities()
    this.currentRealm = null
  }
}
