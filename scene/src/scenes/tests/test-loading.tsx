import { engine } from '@dcl/sdk/ecs'
import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import Loading from '../../ui/loading/loadingComponent'

const TIME_TO_LOAD: number = 2

export class UI {
  public isLoading: boolean
  public isVisible: boolean
  public timer: number

  constructor() {
    this.isLoading = true
    this.isVisible = true
    this.timer = TIME_TO_LOAD
    const uiComponent = (): ReactEcs.JSX.Element[] => [this.LoadingUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  changeVisibility(): void {
    this.isVisible = !this.isVisible
  }

  loadingDungeonSystem(dt: number): void {
    if (this.timer - dt <= 0 && this.isLoading) {
      this.isLoading = false
      engine.removeSystem(this.loadingDungeonSystem)
    } else {
      this.timer = this.timer - dt
    }
  }

  startLoading(): void {
    this.isVisible = true
    this.isLoading = true
    this.timer = TIME_TO_LOAD
    engine.addSystem(this.loadingDungeonSystem.bind(this))
  }

  LoadingUI(): ReactEcs.JSX.Element {
    return (
      <Loading
        isLoading={this.isLoading}
        isVisible={this.isVisible}
        changeVisibility={this.changeVisibility.bind(this)}
      />
    )
  }
}

export function main(): void {
  // all the initializing logic
  const gameUI = new UI()
  gameUI.startLoading()
}
