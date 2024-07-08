import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import BottomBar from '../../ui/bottom-bar/bottomBar'
import * as utils from '@dcl-sdk/utils'


export class UI {
  public isVisible: boolean = true
  public currentHpPercent: number
  public currentXp: number
  public levelXp: number
  public level: number
  public slotOneCooldownTime: number = 0
  public slotOneIsCooling: boolean = false

  constructor() {
    this.currentHpPercent = 75.6
    this.currentXp = 250
    this.levelXp = 1000
    this.level = 1

    const uiComponent = (): ReactEcs.JSX.Element[] => [this.bottomBarUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  showCooldownSlotOne(time: number): void {
    console.log(time)
    this.slotOneCooldownTime = time
    this.slotOneIsCooling = true
    utils.timers.setTimeout(() => {
      console.log('timeout')
      this.slotOneCooldownTime = 0
      this.slotOneIsCooling = false
    }, time * 1000)
  }

  bottomBarUI(): ReactEcs.JSX.Element {
    return (
      <BottomBar
        isVisible={this.isVisible}
        currentHpPercent={this.currentHpPercent}
        levelXp={this.levelXp}
        currentXp={this.currentXp}
        level={this.level}
        slotOneIsCooling={this.slotOneIsCooling}
        onClickSlotOne={this.showCooldownSlotOne.bind(this)}      />
    )
  }
}

export let gameUi: UI
export function main(): void {
  // all the initializing logic
  gameUi = new UI()
}
