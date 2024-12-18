import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import type { Sprite } from '../../utils/ui-utils'
import {
  APPRENTICE_WEARABLES,
  CLICKED_PURCHASE_SPRITE,
  PURCHASE_SPRITE,
  WEARABLES_TO_SHOW,
  wearablesMarketSprites,
  type Wearable
} from '../../ui/wearables-market/wearablesData'
import WearablesMarket from '../../ui/wearables-market/wearablesMarket'

export class UI {
  public isVisible: boolean
  public selectedWearable: Wearable | undefined
  public scrollPosition: number
  public rightButton: Sprite
  public leftButton: Sprite
  public buttonSprite: Sprite
  public backgroundSprite: Sprite
  public wearablesToShow: Wearable[]

  constructor() {
    this.isVisible = true
    this.scrollPosition = 0
    this.rightButton = wearablesMarketSprites.right_unavailable
    this.leftButton = wearablesMarketSprites.left_unavailable
    this.backgroundSprite = wearablesMarketSprites.background
    this.buttonSprite = PURCHASE_SPRITE
    this.wearablesToShow = APPRENTICE_WEARABLES

    const uiComponent = (): ReactEcs.JSX.Element[] => [this.WearablesMarketUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  changeVisibility(): void {
    this.isVisible = !this.isVisible
  }

  selectWearable(wearable: Wearable): void {
    this.selectedWearable = wearable
  }

  tradeDown(): void {
    this.buttonSprite = CLICKED_PURCHASE_SPRITE
  }

  tradeUp(): void {
    this.buttonSprite = PURCHASE_SPRITE
  }

  scrollRight(): void {
    if (
      this.scrollPosition <
      Math.floor(this.wearablesToShow.length / WEARABLES_TO_SHOW)
    ) {
      this.rightButton = wearablesMarketSprites.right_clicked
      this.scrollPosition++
    }
  }

  scrollLeft(): void {
    if (this.scrollPosition > 0) {
      this.leftButton = wearablesMarketSprites.left_clicked
      this.scrollPosition--
    }
  }

  upScrollButtons(): void {
    this.rightButton = wearablesMarketSprites.right
    this.leftButton = wearablesMarketSprites.left

    if (this.scrollPosition === 0) {
      this.leftButton = wearablesMarketSprites.left_unavailable
    }

    if (
      this.scrollPosition * WEARABLES_TO_SHOW >=
      Math.floor(this.wearablesToShow.length / WEARABLES_TO_SHOW)
    ) {
      this.rightButton = wearablesMarketSprites.right_unavailable
    }
  }

  WearablesMarketUI(): ReactEcs.JSX.Element {
    return (
      <WearablesMarket
        isVisible={this.isVisible}
        selectedWearable={this.selectedWearable}
        backgroundSprite={this.backgroundSprite}
        leftButton={this.leftButton}
        rightButton={this.rightButton}
        buttonSprite={this.buttonSprite}
        scrollPosition={this.scrollPosition}
        wearablesToShow={this.wearablesToShow}
        changeVisibility={this.changeVisibility.bind(this)}
        scrollLeft={this.scrollLeft.bind(this)}
        scrollRight={this.scrollRight.bind(this)}
        upScrollButtons={this.upScrollButtons.bind(this)}
        tradeDown={this.tradeDown.bind(this)}
        tradeUp={this.tradeUp.bind(this)}
        selectWearable={this.selectWearable.bind(this)}
      />
    )
  }
}

export let gameUi: UI
export function main(): void {
  // all the initializing logic
  gameUi = new UI()
}
