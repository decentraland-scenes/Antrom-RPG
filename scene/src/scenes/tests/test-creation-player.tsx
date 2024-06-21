import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import CreationPlayer from '../../ui/creation-player/creationPlayer'
import { ChacarterFactionsType, CharacterStatsType } from '../../ui/creation-player/creationPlayerData'

export class UI {
  public isVisible: boolean = true
  public selectedClass: CharacterStatsType | undefined
  public selectedRace: CharacterStatsType | undefined
  public selectedFaction: ChacarterFactionsType | undefined

  constructor() {
    const uiComponent = (): ReactEcs.JSX.Element[] => [this.creationPlayerUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  creationPlayerUI(): ReactEcs.JSX.Element {
    return (
      <CreationPlayer
        isVisible={this.isVisible}
        selectedClass={this.selectedClass}
        selectedRace={this.selectedRace}
        selectedFaction={this.selectedFaction}
        selectClass={this.selectClass.bind(this)}
        selectRace={this.selectRace.bind(this)}
        selectFaction={this.selectFaction.bind(this)}
      />
    )
  }
}

export function main(): void {
  // // all the initializing logic
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const gameUI = new UI()

  // Giorgio
  // const game = new GameController()
  // game.start()
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // ReactEcsRenderer.setUiRenderer(exampleBannerUi)
}
