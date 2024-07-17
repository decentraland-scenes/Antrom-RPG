import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import Inventory from '../../ui/inventory/inventoryComponent'
import { inventorySprites } from '../../ui/inventory/inventoryData'
import { type Sprite } from '../../utils/ui-utils'
import * as utils from '@dcl-sdk/utils'

export class UI {
  public isVisible: boolean = false
  public isInventory: boolean = false
  public isSkills: boolean = false
  public isCompanions: boolean = false
  public isProfessions: boolean = false
  public tabIndex: number = 2
  public leftSprite: Sprite = inventorySprites.leftArrowButton
  public rightSprite: Sprite = inventorySprites.rightArrowButton
  constructor() {
    const uiComponent = (): ReactEcs.JSX.Element[] => [this.inventoryUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  inventoryUI(): ReactEcs.JSX.Element {
    return (
      <Inventory
        isVisible={this.isVisible}
        isInventory={this.isInventory}
        isCompanions={this.isCompanions}
        isSkills={this.isSkills}
        isProfessions={this.isProfessions}
        scrollRight={this.increaseTabIndex.bind(this)}
        scrollLeft={this.decreaseTabIndex.bind(this)}
        leftSprite={this.leftSprite}
        rightSprite={this.rightSprite}
        updateTab={this.updateTab.bind(this)}
      />
    )
  }

  showInventory(): void {
    this.isVisible = true
    this.updateTab(this.tabIndex)
  }

  hideInventory(): void {
    this.isVisible = false
    this.tabIndex = 0
  }

  setAllFalse(): void {
    this.isInventory = false
    this.isSkills = false
    this.isCompanions = false
    this.isProfessions = false
  }

  updateTab(index: number): void {
    this.setAllFalse()
    this.tabIndex = index
    this.updateSpritesButtons(150)
    switch (this.tabIndex) {
      case 0:
        this.isInventory = true
        break
      case 1:
        this.isCompanions = true
        break
      case 2:
        this.isSkills = true
        break
      case 3:
        this.isProfessions = true
        break
    }
  }

  increaseTabIndex(): void {
    if (this.tabIndex < 3) {
      this.rightSprite = inventorySprites.rightArrowButtonClicked
      this.tabIndex++
      this.updateTab(this.tabIndex)
    }
  }

  decreaseTabIndex(): void {
    if (this.tabIndex > 0) {
      this.leftSprite = inventorySprites.leftArrowButtonClicked
      this.tabIndex--
      this.updateTab(this.tabIndex)
    }
  }

  updateSpritesButtons(milisecs: number): void {
    utils.timers.setTimeout(() => {
      if (this.tabIndex === 0) {
        this.leftSprite = inventorySprites.leftArrowButtonUnavailable
      } else {
        this.leftSprite = inventorySprites.leftArrowButton
      }
      if (this.tabIndex === 3) {
        this.rightSprite = inventorySprites.rightArrowButtonUnavailable
      } else {
        this.rightSprite = inventorySprites.rightArrowButton
      }
    }, milisecs)
  }
}

export function main(): void {
  const gameUI = new UI()
  gameUI.showInventory()
}
