import { Antrom } from '../realms/antrom'
import { DemonKingDungeon } from '../realms/demonKingDungeon'
import { Dungeon } from '../realms/dungeon'
import { DungeonBase } from '../realms/dungeonBase'
import { entityController } from '../realms/entityController'
import { MinersCave } from '../realms/minerscave'
import { type RealmType, type Realm } from '../realms/types'
import { type GameController } from './game.controller'
import * as utils from '@dcl-sdk/utils'

export class RealmController {
  public currentRealm: Realm | null = null
  gameController: GameController

  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  switchRealm(realm: RealmType, difficulty: string): void {
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
        this.currentRealm = new Dungeon(this.gameController, difficulty)
        break
      case 'dungeonBase':
        this.currentRealm = new DungeonBase(this.gameController)
        break
      case 'minersCave':
        this.currentRealm = new MinersCave(this.gameController, difficulty)
        break
    }
  }

  cleanUpScene(): void {
    console.log('Cleaning up scene...')

    // Remove all entities from current realm
    if (this.currentRealm) {
      this.currentRealm.removeAllEntities()
    }

    // Clear entity controller
    entityController.clean()

    // Add a small delay to ensure all entities are properly removed
    utils.timers.setTimeout(() => {
      console.log('Scene cleanup completed')
    }, 50)

    this.currentRealm = null
  }
}
