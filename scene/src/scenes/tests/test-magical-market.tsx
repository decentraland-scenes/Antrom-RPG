import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import MagicalItemsMarket from '../../ui/magical-market/magicalMarket'
import {
  CLICKED_PURCHASE_SPRITE,
  MAGICAL_ITEMS_MARKET,
  MAGICAL_ITEMS_TO_SHOW,
  PURCHASE_SPRITE,
  magicalItemsMarketSprites
} from '../../ui/magical-market/magicalMarketData'
import type { Sprite } from '../../utils/ui-utils'
import { type Item } from '../../ui/resources-market/resourcesData'

export class UI {
  public isVisible: boolean
  public selectedMagicalItem: Item | undefined
  public scrollPosition: number
  public rightButton: Sprite
  public leftButton: Sprite
  public buttonSprite: Sprite
  public backgroundSprite: Sprite
  public magicalItemsToShow: Item[]

  constructor() {
    this.isVisible = true
    this.scrollPosition = 0
    this.rightButton = magicalItemsMarketSprites.right_unavailable
    this.leftButton = magicalItemsMarketSprites.left_unavailable
    this.backgroundSprite = magicalItemsMarketSprites.background
    this.buttonSprite = PURCHASE_SPRITE
    this.magicalItemsToShow = MAGICAL_ITEMS_MARKET

    const uiComponent = (): ReactEcs.JSX.Element[] => [this.MagicalMarketUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  changeVisibility(): void {
    this.isVisible = !this.isVisible
  }

  selectMagicalItem(magicalItem: Item): void {
    this.selectedMagicalItem = magicalItem
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
      Math.floor(this.magicalItemsToShow.length / MAGICAL_ITEMS_TO_SHOW)
    ) {
      this.rightButton = magicalItemsMarketSprites.right_clicked
      this.scrollPosition++
    }
  }

  scrollLeft(): void {
    if (this.scrollPosition > 0) {
      this.leftButton = magicalItemsMarketSprites.left_clicked
      this.scrollPosition--
    }
  }

  upScrollButtons(): void {
    this.rightButton = magicalItemsMarketSprites.right
    this.leftButton = magicalItemsMarketSprites.left

    if (this.scrollPosition === 0) {
      this.leftButton = magicalItemsMarketSprites.left_unavailable
    }

    if (
      this.scrollPosition * MAGICAL_ITEMS_TO_SHOW >=
      Math.floor(this.magicalItemsToShow.length / MAGICAL_ITEMS_TO_SHOW)
    ) {
      this.rightButton = magicalItemsMarketSprites.right_unavailable
    }
  }

  MagicalMarketUI(): ReactEcs.JSX.Element {
    return (
      <MagicalItemsMarket
        isVisible={this.isVisible}
        selectedMagicalItem={this.selectedMagicalItem}
        backgroundSprite={this.backgroundSprite}
        leftButton={this.leftButton}
        rightButton={this.rightButton}
        buttonSprite={this.buttonSprite}
        scrollPosition={this.scrollPosition}
        magicalItemsToShow={this.magicalItemsToShow}
        changeVisibility={this.changeVisibility.bind(this)}
        scrollLeft={this.scrollLeft.bind(this)}
        scrollRight={this.scrollRight.bind(this)}
        upScrollButtons={this.upScrollButtons.bind(this)}
        tradeDown={this.tradeDown.bind(this)}
        tradeUp={this.tradeUp.bind(this)}
        selectMagicalItem={this.selectMagicalItem.bind(this)}
      />
    )
  }
}

export let gameUi: UI
export function main(): void {
  // all the initializing logic
  gameUi = new UI()
}
