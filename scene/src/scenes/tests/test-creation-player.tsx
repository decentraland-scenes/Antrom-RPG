import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import CreationPlayer from '../../ui/creation-player/creationPlayer'
import type {
  CharacterFactionsType,
  CharacterStatsType
} from '../../ui/creation-player/creationPlayerData'

export class UI {
  public isVisible: boolean = true
  public selectedClass: CharacterStatsType | undefined
  public selectedRace: CharacterStatsType | undefined
  public selectedFaction: CharacterFactionsType | undefined

  constructor() {
    const uiComponent = (): ReactEcs.JSX.Element[] => [this.creationPlayerUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  selectClass(characterClass: CharacterStatsType): void {
    this.selectedClass = characterClass
  }

  selectRace(characterRace: CharacterStatsType): void {
    this.selectedRace = characterRace
  }

  selectFaction(characterFaction: CharacterFactionsType): void {
    this.selectedFaction = characterFaction
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
}
