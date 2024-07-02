import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import Banner from '../../ui/banner/bannerComponent'
import { BannerPosition, BannerType } from '../../ui/banner/bannerConstants'
import { engine } from '@dcl/sdk/ecs'
// import { UiCanvasInformation, engine } from "@dcl/sdk/ecs"
// import { canvasInfo } from "../../ui/utils/utils"

export class UI {
  public bannerType: BannerType
  public isBannerVisible: boolean
  public bannerPosition: BannerPosition
  public timer: number
  constructor() {
    this.bannerType = BannerType.B_BERRIES
    this.isBannerVisible = true
    this.bannerPosition = BannerPosition.BP_CENTER_TOP
    this.timer = 2
    const uiComponent = (): ReactEcs.JSX.Element[] => [this.bannerUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  showBannerSystem(dt: number): void {
    if (this.timer - dt <= 0) {
      this.isBannerVisible = false
      engine.removeSystem('showBannerSystem')
    } else {
      this.timer = this.timer - dt
    }
  }

  showBanner(): void {
    this.isBannerVisible = true
    this.timer = 2
    engine.addSystem(this.showBannerSystem.bind(this),0,'showBannerSystem')
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
  // // all the initializing logic
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const gameUI = new UI()
  gameUI.showBanner()

  // Giorgio
  // const game = new GameController()
  // game.start()
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // ReactEcsRenderer.setUiRenderer(exampleBannerUi)
}
