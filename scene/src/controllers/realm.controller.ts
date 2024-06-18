import { Antrom } from '../realms/antrom'
import { DemonKingDungeon } from '../realms/demonKingDungeon'
import { Dungeon } from '../realms/dungeon'
import { DungeonBase } from '../realms/dungeonBase'
import { MinersCave } from '../realms/minerscave'
import { type GameController } from './game.controller'

type RealmType =
  | 'antrom'
  | 'demonKingDungeon'
  | 'dungeon'
  | 'dungeonBase'
  | 'minersCave'

export class RealmController {
  public antrom: Antrom
  public demonKingDugeon: DemonKingDungeon
  public dungeon: Dungeon
  public dungeonBase: DungeonBase
  public minersCave: MinersCave
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.antrom = new Antrom(this.gameController)
    this.demonKingDugeon = new DemonKingDungeon(this.gameController)
    this.dungeon = new Dungeon(this.gameController)
    this.dungeonBase = new DungeonBase(this.gameController)
    this.minersCave = new MinersCave(this.gameController)
  }

  switchRealm(realm: RealmType): void {
    this.cleanUpScene()
    switch (realm) {
      case 'antrom':
        this.antrom = new Antrom(this.gameController)
        break
      case 'demonKingDungeon':
        this.demonKingDugeon = new DemonKingDungeon(this.gameController)
        break
      case 'dungeon':
        this.dungeon = new Dungeon(this.gameController)
        break
      case 'dungeonBase':
        this.dungeonBase = new DungeonBase(this.gameController)
        break
      case 'minersCave':
        this.minersCave = new MinersCave(this.gameController)
        break
    }
  }

  cleanUpScene(): void {
    this.demonKingDugeon.removeAllEntities()
    this.antrom.removeAllEntities()
    this.minersCave.removeAllEntities()
    this.dungeon.removeAllEntities()
  }
}
