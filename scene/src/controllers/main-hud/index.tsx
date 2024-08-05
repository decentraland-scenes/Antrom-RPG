import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { openExternalUrl } from '~system/RestrictedActions'
import { Player } from '../../player/player'
import MainHud from '../../ui/main-hud/mainHudComponent'
import { InventoryController } from './inventory.controller'

export class MainHudController {
  public isVisible: boolean = true
  public isPlayerRollOpen: boolean = false
  public isInfoOpen: boolean = false

  private inventoryController: InventoryController | null = null

  render(): ReactEcs.JSX.Element {
    const player = Player.getInstance()

    return (
      <UiEntity>
        <MainHud
          isPlayerRollOpen={this.isPlayerRollOpen}
          isInfoOpen={this.isInfoOpen}
          playerRollOnClick={this.playerRollVisibility.bind(this)}
          showInfo={this.showInfo.bind(this)}
          openLink={this.openLink.bind(this)}
          showInventory={() => {
            this.showInventory(true)
          }}
          characterRace={player.race}
          characterClass={player.class}
          characterAlliance={player.alliance}
          // TODO: add player roll
          lastRoll={{
            gainedExperience: 25,
            playerRoll: 12,
            enemyRoll: 4,
            playerAttack: 50,
            EnemyAttack: 'MISSED'
          }}
          // TODO: Add player professions
          playerProfessions={{
            lumberjackLevel: 1,
            butcherLevel: 0,
            miningLevel: 1,
            assasinLevel: 0
          }}
        />

        {this.inventoryController?.render()}
      </UiEntity>
    )
  }

  playerRollVisibility(visibility: boolean): void {
    this.isPlayerRollOpen = visibility
  }

  showInfo(visibility: boolean): void {
    this.isInfoOpen = visibility
  }

  showInventory(visibility: boolean): void {
    if (this.inventoryController === null) {
      this.inventoryController = new InventoryController()
    }
      this.inventoryController.showInventory(visibility)
  }

  openLink(url: string): void {
    openExternalUrl({ url }).catch(console.error)
  }
}
