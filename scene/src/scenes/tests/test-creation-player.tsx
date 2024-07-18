import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import CreationPlayer from '../../ui/creation-player/creationPlayer'
import {
  type CharacterClassStatsType,
  type CharacterAlliancesType,
  type CharacterRaceStatsType
} from '../../ui/creation-player/creationPlayerData'

export class UI {
  public selectedClass: CharacterClassStatsType | undefined
  public selectedRace: CharacterRaceStatsType | undefined
  public selectedAlliance: CharacterAlliancesType | undefined
  public clearOptionsClicked: boolean
  public acceptClicked: boolean

  constructor() {
    const uiComponent = (): ReactEcs.JSX.Element[] => [this.creationPlayerUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
    this.clearOptionsClicked = false
    this.acceptClicked = false
  }

  selectOption(
    option:
      | CharacterClassStatsType
      | CharacterRaceStatsType
      | CharacterAlliancesType
  ): void {
    switch (option.type) {
      case 'race':
        this.selectedRace = option
        break
      case 'class':
        this.selectedClass = option
        break
      case 'alliance':
        this.selectedAlliance = option
        break
    }
  }

  clearOptionsMouseDown(): void {
    this.selectedClass = undefined
    this.selectedRace = undefined
    this.selectedAlliance = undefined
    this.clearOptionsClicked = true
  }

  clearOptionsMouseUp(): void {
    this.clearOptionsClicked = false
  }

  acceptMouseDown(): void {
    // code to create character
    this.acceptClicked = true
  }

  acceptMouseUp(): void {
    this.acceptClicked = false
  }

  creationPlayerUI(): ReactEcs.JSX.Element {
    return (
      <CreationPlayer
        selectedClass={this.selectedClass}
        selectedRace={this.selectedRace}
        selectedAlliance={this.selectedAlliance}
        selectOption={this.selectOption.bind(this)}
        clearOptionsClicked={this.clearOptionsClicked}
        clearOptionsMouseDown={this.clearOptionsMouseDown.bind(this)}
        clearOptionsMouseUp={this.clearOptionsMouseUp.bind(this)}
        acceptClicked={this.acceptClicked}
        acceptMouseDown={this.acceptMouseDown.bind(this)}
        acceptMouseUp={this.acceptMouseUp.bind(this)}
      />
    )
  }
}

export let gameUi: UI
export function main(): void {
  // all the initializing logic
  gameUi = new UI()
}
