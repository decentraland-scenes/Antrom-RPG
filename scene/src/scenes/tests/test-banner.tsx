import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import Banner from '../../ui/banner/bannerComponent'
import { BannerPosition, BannerType } from '../../ui/banner/bannerConstants'
import * as utils from '@dcl-sdk/utils'

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

  showBanner(): void {
    utils.timers.setTimeout(() => {
      console.log('timer on')
      this.isBannerVisible = false
    }, this.timer * 1000)
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
  const gameUI = new UI()
  gameUI.showBanner()
}
