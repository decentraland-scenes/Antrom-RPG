import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import Banner from '../../ui/banner/banner'
import { BannerPosition, BannerType } from '../../ui/banner/bannerConstants'
// import { UiCanvasInformation, engine } from "@dcl/sdk/ecs"
// import { canvasInfo } from "../../ui/utils/utils"

export class UI {
  public bannerType: BannerType = BannerType.B_BERRIES
  public isBannerVisible: boolean = true
  public bannerPosition: BannerPosition = BannerPosition.BP_CENTER_TOP
  constructor() {
    const uiComponent = (): ReactEcs.JSX.Element => [this.bannerUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  bannerUI(): ReactEcs.JSX.Element {
    return (
      <Banner
        isVisible={this.isBannerVisible}
        type={this.bannerType}
        position={this.bannerPosition}
      />
    )
  }
}

export function main(): void {
  // Seba
  // // all the initializing logic
  // const gameUI = new UI()
  // gameUI.bannerUI()


  // Giorgio
  // const game = new GameController()
  // game.start()

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // ReactEcsRenderer.setUiRenderer(exampleBannerUi)
}
