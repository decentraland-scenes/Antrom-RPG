import { type Inventory } from './types'
import {
  INVENTORY_ACTIONS,
  type INVENTORY_ACTION_REASONS,
  UpdateInventory
} from './reducer'

export class PlayerInventory {
  inventory: Inventory

  constructor() {
    this.inventory = {}
  }

  incrementItem = (
    itemKey: string,
    by: number = 1,
    reason?: INVENTORY_ACTION_REASONS
  ): void => {
    this.inventory = UpdateInventory(this.inventory, {
      type: INVENTORY_ACTIONS.INCREASE_ITEM,
      itemKey,
      count: by,
      reason
    })
  }

  reduceItem(
    itemKey: string,
    by: number = 1,
    reason?: INVENTORY_ACTION_REASONS
  ): void {
    this.inventory = UpdateInventory(this.inventory, {
      type: INVENTORY_ACTIONS.REDUCE_ITEM,
      itemKey,
      count: by,
      reason
    })
  }

  setItem(itemKey: string, count = 0): void {
    this.inventory[itemKey] = {
      count,
      name: itemKey
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getItem(itemKey: string) {
    return this.inventory?.[itemKey]
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getItemCount(itemKey: string) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return this.getItem(itemKey)?.count || 0
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getInventoryKeys() {
    return Object.keys(this.inventory)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getInventoryValues() {
    return Object.keys(this.inventory).map((key) => this.inventory[key])
  }
}
