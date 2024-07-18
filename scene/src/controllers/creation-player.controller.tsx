import ReactEcs from '@dcl/sdk/react-ecs'
import future, { type IFuture } from 'fp-future'
import Canvas from '../ui/canvas/Canvas'
import CreationPlayer from '../ui/creation-player/creationPlayer'
import {
  type CharacterClassStatsType,
  type CharacterRaceStatsType,
  type CharacterAlliancesType
} from '../ui/creation-player/creationPlayerData'
import * as ui from 'dcl-ui-toolkit'
import { CreatePlayer } from '../api/api'

export class CreationPlayerController {
  private selectedClass: CharacterClassStatsType | undefined
  private selectedRace: CharacterRaceStatsType | undefined
  private selectedAlliance: CharacterAlliancesType | undefined
  private clearOptionsClicked: boolean = false
  private acceptClicked: boolean = false
  private isVisible: boolean = false

  private readonly finishedFuture: IFuture<void> = future()
  private acceptedTutorial: boolean = false

  constructor() {
    const prompt = ui.createComponent(ui.OptionPrompt, {
      title: 'New Player Tutorial',
      text: 'Do you want to play the tutorial?',
      useDarkTheme: true,
      onAccept: () => {
        this.isVisible = true
        this.acceptedTutorial = true
        prompt.hide()
      },
      onReject: () => {
        this.isVisible = true
        this.acceptedTutorial = false
        prompt.hide()
      }
    })

    prompt.show()
  }

  isTutorialActive(): boolean {
    return this.acceptedTutorial
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
    this.acceptClicked = true
    if (
      this.selectedAlliance === undefined ||
      this.selectedRace === undefined ||
      this.selectedClass === undefined
    ) {
      console.error('All options must be selected')
      return
    }

    // API
    CreatePlayer(
      this.selectedAlliance.id,
      this.selectedRace.id,
      this.selectedClass.id
    )
      .then(() => {
        this.finishedFuture.resolve()
      })
      .catch((error) => {
        console.error('Error creating player', error)
        this.finishedFuture.reject(new Error(`Error creating player ${error}`))
      })
  }

  acceptMouseUp(): void {
    this.acceptClicked = false
  }

  ready(): IFuture<void> {
    return this.finishedFuture
  }

  render(): ReactEcs.JSX.Element | null {
    if (!this.isVisible) return null

    return (
      <Canvas>
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
      </Canvas>
    )
  }
}
