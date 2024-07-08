import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import BottomBar from '../../ui/bottom-bar/bottomBar'

export class UI {
  public isVisible: boolean = true
  public actualHpPercent: number
  public actualXp: number
  public levelXp: number
  public level: number

  constructor() {
    this.actualHpPercent = 75.6
    this.actualXp = 250
    this.levelXp = 1000
    this.level = 1

    const uiComponent = (): ReactEcs.JSX.Element[] => [this.bottomBarUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  bottomBarUI(): ReactEcs.JSX.Element {
    return (
      <BottomBar
        isVisible={this.isVisible}
        actualHpPercent={this.actualHpPercent}
        levelXp={this.levelXp}
        actualXp={this.actualXp}
        level={this.level}
      />
    )
  }
}

export let gameUi: UI
export function main(): void {
  // all the initializing logic
  gameUi = new UI()
}
