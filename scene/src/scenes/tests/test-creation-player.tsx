import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import CreationPlayer from '../../ui/creation-player/creationPlayer'
import {
  type CharacterFactionsType,
  type CharacterStatsType
} from '../../ui/creation-player/creationPlayerData'

export class UI {
  public isVisible: boolean = true
  public selectedClass: CharacterStatsType | undefined
  public selectedRace: CharacterStatsType | undefined
  public selectedFaction: CharacterFactionsType | undefined
  public clearOptionsClicked: boolean
  public acceptClicked: boolean

  constructor() {
    const uiComponent = (): ReactEcs.JSX.Element[] => [this.creationPlayerUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
    this.clearOptionsClicked = false
    this.acceptClicked = false
  }

  selectOption(option: CharacterStatsType | CharacterFactionsType): void {
    switch (option.type) {
      case 'race':
        this.selectedRace = option
        break
      case 'class':
        this.selectedClass = option
        break
      case 'faction':
        this.selectedFaction = option
        break
    }
  }

  clearOptionsMouseDown(): void {
    this.selectedClass = undefined
    this.selectedRace = undefined
    this.selectedFaction = undefined
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
        isVisible={this.isVisible}
        selectedClass={this.selectedClass}
        selectedRace={this.selectedRace}
        selectedFaction={this.selectedFaction}
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

export function main(): void {
  // // all the initializing logic
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const gameUI = new UI()
}
