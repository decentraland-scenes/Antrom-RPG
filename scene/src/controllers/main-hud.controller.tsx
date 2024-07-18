import ReactEcs from '@dcl/sdk/react-ecs'
import { openExternalUrl } from '~system/RestrictedActions'
import { Player } from '../player/player'
import MainHud from '../ui/main-hud/mainHudComponent'

export class MainHudController {
  public isVisible: boolean
  public isPlayerRollOpen: boolean
  public isInfoOpen: boolean

  constructor() {
    this.isVisible = true
    this.isPlayerRollOpen = false
    this.isInfoOpen = false
  }

  render(): ReactEcs.JSX.Element {
    const player = Player.getInstance()

    return (
      <MainHud
        isPlayerRollOpen={this.isPlayerRollOpen}
        isInfoOpen={this.isInfoOpen}
        playerRollOnClick={this.playerRollVisibility.bind(this)}
        showInfo={this.showInfo.bind(this)}
        openLink={this.openLink.bind(this)}
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
    )
  }

  playerRollVisibility(visibility: boolean): void {
    this.isPlayerRollOpen = visibility
  }

  showInfo(visibility: boolean): void {
    this.isInfoOpen = visibility
  }

  openLink(url: string): void {
    openExternalUrl({ url }).catch(console.error)
  }
}
