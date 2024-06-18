export type InventoryItem = {
  name: string
  count: number
}

export type Inventory = Record<string, InventoryItem>
