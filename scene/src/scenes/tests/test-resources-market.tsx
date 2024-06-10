import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { ITEMS, RESOURCES_INVENTORY, RESOURCES_MARKET, resourcesMarketSprites } from '../../ui/resources-market/resourcesData'
import type { InventoryItem, Items} from '../../ui/resources-market/resourcesData'
import ResourcesMarket from '../../ui/resources-market/resourcesMarket'
import type { Sprite } from '../../ui/utils/utils'

const BALANCE:number = 300

export class UI {
  public isVisible: boolean
  public balance: number
  public tradeClicked: boolean
  public isSelling: boolean
  public itemsArray: InventoryItem[]
  public totalPrice: number
  public buttonMaxSprite: Sprite
  public selectedQuantity: number
  public selectedItem?: InventoryItem
  
  constructor() {
    this.isVisible = true
    this.balance = BALANCE
    this.tradeClicked = false
    this.isSelling = true
    this.itemsArray = RESOURCES_INVENTORY
    this.totalPrice = 0
    this.buttonMaxSprite = resourcesMarketSprites.max_button
    this.selectedQuantity = 1
    this.selectedItem = undefined
    const uiComponent = (): ReactEcs.JSX.Element => [this.ResourcesMarketUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  changeVisibility(): void {
    this.isVisible = !this.isVisible
  }

  selectItem(inventoryItem: InventoryItem): void {
    console.log('select item id:', inventoryItem.item.id)
    this.selectedItem = inventoryItem
    this.selectedQuantity = 1
    this.updatePrice()
    console.log(this.selectedItem.item.id)
  }

  updatePrice(value?: string): void {
    console.log('update price')

    if (value !== undefined) {
      const formattedValue = value.replace(' ', '')
      if (!Number.isNaN(Number(formattedValue))) {
        this.selectedQuantity = Number(formattedValue)
      } else {
        this.selectedQuantity = 1
      }
    }

    let unitPrice: number | undefined

    if (this.selectedItem !== undefined) {
      if (this.isSelling) {
        unitPrice = this.selectedItem.item.sellPrice
      } else {
        unitPrice = this.selectedItem.item.buyPrice
      }
      if (unitPrice !== undefined) {
        this.totalPrice =
          this.selectedQuantity * unitPrice
      } else {
        this.totalPrice = 0
      }
    }
  }

  mouseDownMax(): void {
  this.buttonMaxSprite =
    resourcesMarketSprites.max_button_clicked
  }

  mouseUpMax(item: InventoryItem): void {
    this.buttonMaxSprite = resourcesMarketSprites.max_button
    if (this.isSelling && item.amount !== undefined) {
      this.selectedQuantity = item.amount
    }
    if (!this.isSelling && item.item.buyPrice !== undefined) {
      this.selectedQuantity = Math.floor(
        this.balance / item.item.buyPrice
      )
    }
    this.updatePrice.bind(this)
  }

  setSelling(state: boolean): void {
    if (this.isSelling !== state) {
      this.selectedItem = undefined
      this.isSelling = state
      if (state) {
        this.itemsArray = RESOURCES_INVENTORY
      } else {
        this.itemsArray = RESOURCES_MARKET
      }
    }
  }

  tradeDown(): void {
    if (this.selectedItem !== undefined) {
      if (this.isSelling) {
        if (
          this.selectedItem?.item.sellPrice !== undefined &&
          this.selectedItem.amount !== undefined
        ) {
          if (
            this.selectedItem.amount >=
            this.selectedQuantity
          ) {
            this.balance =
              this.balance +
              this.selectedItem.item.sellPrice *
                this.selectedQuantity
          } else {
            return
          }
        }
      } else {
        if (this.selectedItem.item.buyPrice !== undefined) {
          if (
            this.balance -
              this.selectedItem.item.buyPrice *
                this.selectedQuantity >=
            0
          ) {
            this.balance =
              this.balance -
              this.selectedItem.item.buyPrice *
                this.selectedQuantity
          } else {
            return
          }
        }
      }
      this.updateInventory.bind(this)
    }
    this.tradeClicked = true
  }

  updateInventory(): void {
    const existingItemIndex = RESOURCES_INVENTORY.findIndex(
      (resourcesInventoryItem) =>
        resourcesInventoryItem.item.id ===
        this.selectedItem?.item.id
    )
    const existingItem = RESOURCES_INVENTORY[existingItemIndex]

    if (this.isSelling) {
      if (existingItem?.amount !== undefined) {
        if (existingItem.amount - this.selectedQuantity <= 0) {
          RESOURCES_INVENTORY.splice(existingItemIndex, 1)
        }
        existingItem.amount -= this.selectedQuantity
      }
    } else {
      if (existingItem !== undefined) {
        if (existingItem.amount !== undefined) {
          existingItem.amount += this.selectedQuantity
        } else {
          existingItem.amount = this.selectedQuantity
        }
      } else {
        this.addItemToResourcesInventory.bind(this)
      }
    }
  }

  isUnavailable(): boolean {
    if (this.selectedItem !== undefined) {
      if (this.isSelling) {
        if (
          this.selectedItem.amount !== undefined &&
          this.selectedItem.amount >=
            this.selectedQuantity
        ) {
          return false
        } else {
          return true
        }
      } else {
        if (this.totalPrice > this.balance) {
          return true
        } else {
          return false
        }
      }
    } else {
      return false
    }
  }

  addItemToResourcesInventory(): void {
    if (this.selectedItem !== undefined) {
      const key = this.selectedItem.item.id
      if (key in ITEMS) {
        RESOURCES_INVENTORY.push({
          item: ITEMS[key as Items],
          amount: this.selectedQuantity
        })
      }
    }
  }

  ResourcesMarketUI(): ReactEcs.JSX.Element {
    return (
      <ResourcesMarket 
        isVisible={this.isVisible}
        balance={this.balance}
        tradeClicked={this.tradeClicked} 
        isSelling={this.isSelling} 
        itemsArray={this.itemsArray} 
        totalPrice={this.totalPrice} 
        buttonMaxSprite={this.buttonMaxSprite} 
        selectedQuantity={0} 
        changeVisibility={this.changeVisibility.bind(this)}
        selectItem={this.selectItem.bind(this)} 
        updatePrice={this.updatePrice.bind(this)} 
        mouseDownMax={this.mouseDownMax.bind(this)} 
        mouseUpMax={this.mouseUpMax.bind(this)} 
        setSelling={this.setSelling.bind(this)} 
        tradeDown={this.tradeDown.bind(this)} 
        updateInventory={this.updateInventory.bind(this)} 
        isUnavailable={this.isUnavailable.bind(this)} 
        addItemToResourcesInventory={this.addItemToResourcesInventory.bind(this)}
      />
    )
  }
}

export function main(): void {
  // all the initializing logic
  const gameUI = new UI()
  gameUI.ResourcesMarketUI()
}
