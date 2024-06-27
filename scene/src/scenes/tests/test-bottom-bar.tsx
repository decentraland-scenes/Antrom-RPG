import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import BottomBar from '../../ui/bottom-bar/bottomBar'

export class UI {
  public isVisible: boolean = true

  constructor() {
    const uiComponent = (): ReactEcs.JSX.Element[] => [this.bottomBarUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  bottomBarUI(): ReactEcs.JSX.Element {
    return (
      <BottomBar isVisible={this.isVisible}/>
    )
  }
}

export function main(): void {
  // // all the initializing logic
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const gameUI = new UI()
}
