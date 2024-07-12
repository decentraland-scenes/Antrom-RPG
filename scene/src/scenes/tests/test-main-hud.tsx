import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import MainHud from '../../ui/main-hud/mainHudComponent'
import * as utils from '@dcl-sdk/utils'

export class UI {
  public isVisible: boolean
  public isPlayerRollOpen: boolean
  public isInfoOpen: boolean

  constructor() {
    this.isVisible = true
    this.isPlayerRollOpen = false
    this.isInfoOpen = false
    const uiComponent = (): ReactEcs.JSX.Element[] => [this.mainHudUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  mainHudUI(): ReactEcs.JSX.Element {
    return (
      <MainHud
        isVisible={this.isVisible}
        isPlayerRollOpen={this.isPlayerRollOpen}
        isInfoOpen={this.isInfoOpen}
        playerRollOnClick={this.playerRollVisibility.bind(this)}
        showInfo={this.showInfo.bind(this)}
      />
    )
  }

  playerRollVisibility(visibility: boolean): void {
    this.isPlayerRollOpen = visibility
  }

  showInfo(): void {
    if (!this.isInfoOpen) {
      this.isInfoOpen = true
      utils.timers.setTimeout(() => {
        this.isInfoOpen = false
      }, 1 * 1000)
  }
    }
    
}

export let gameUi: UI
export function main(): void {
  // all the initializing logic
  gameUi = new UI()
}
