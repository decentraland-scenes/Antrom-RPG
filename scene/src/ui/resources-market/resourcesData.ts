import type { Sprite } from "../utils/utils"

export enum Items {
  I_UNSELECTED = 'unselected',
  I_BERRY = 'berry',
  I_BONE = 'bone',
  I_COIN = 'coins',
  I_TOKEN = 'token',
  I_MEAT = 'meat',
  I_WOOD = 'wood',
  I_IRON = 'iron'
}

export const resourcesMarketSprites: Record<string, Sprite> = {
  background: {
    atlasSrc: 'assets/images/resourcemarket_spritesheet.png',
    atlasSize: { x: 1403, y: 1194 },
    x: 0,
    y: 60,
    w: 1403,
    h: 974
  },
  selected_frame: {
    atlasSrc: 'assets/images/resourcemarket_spritesheet.png',
    atlasSize: { x: 1403, y: 1194 },
    x: 558,
    y: 1032,
    w: 160,
    h: 160
  },
  max_button: {
    atlasSrc: 'assets/images/resourcemarket_spritesheet.png',
    atlasSize: { x: 1403, y: 1194 },
    x: 260,
    y: 0,
    w: 85,
    h: 40
  },
  max_button_clicked: {
    atlasSrc: 'assets/images/resourcemarket_spritesheet.png',
    atlasSize: { x: 1403, y: 1194 },
    x: 345,
    y: 0,
    w: 85,
    h: 40
  },
  purchase_button: {
    atlasSrc: 'assets/images/resourcemarket_spritesheet.png',
    atlasSize: { x: 1403, y: 1194 },
    x: 430,
    y: 0,
    w: 280,
    h: 60
  },
  purchase_button_clicked: {
    atlasSrc: 'assets/images/resourcemarket_spritesheet.png',
    atlasSize: { x: 1403, y: 1194 },
    x: 990,
    y: 0,
    w: 280,
    h: 60
  },
  purchase_button_unavailable: {
    atlasSrc: 'assets/images/resourcemarket_spritesheet.png',
    atlasSize: { x: 1403, y: 1194 },
    x: 710,
    y: 0,
    w: 280,
    h: 60
  },
  sell_button: {
    atlasSrc: 'assets/images/resourcemarket_spritesheet.png',
    atlasSize: { x: 1403, y: 1194 },
    x: 720,
    y: 1034,
    w: 280,
    h: 60
  },
  sell_button_clicked: {
    atlasSrc: 'assets/images/resourcemarket_spritesheet.png',
    atlasSize: { x: 1403, y: 1194 },
    x: 1000,
    y: 1034,
    w: 280,
    h: 60
  },
  sell_button_unavailable: {
    atlasSrc: 'assets/images/resourcemarket_spritesheet.png',
    atlasSize: { x: 1403, y: 1194 },
    x: 0,
    y: 1094,
    w: 280,
    h: 60
  },
  purchase_with_mana_button: {
    atlasSrc: 'assets/images/resourcemarket_spritesheet.png',
    atlasSize: { x: 1403, y: 1194 },
    x: 0,
    y: 1034,
    w: 250,
    h: 54
  },
  purchase_with_mana_button_clicked: {
    atlasSrc: 'assets/images/resourcemarket_spritesheet.png',
    atlasSize: { x: 1403, y: 1194 },
    x: 250,
    y: 1034,
    w: 250,
    h: 54
  },

  berry: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 0,
    y: 0,
    w: 256,
    h: 256
  },
  bone: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 256,
    y: 0,
    w: 256,
    h: 256
  },
  coins: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 768,
    y: 0,
    w: 256,
    h: 256
  },
  token: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 1280,
    y: 0,
    w: 256,
    h: 256
  },
  mana_coin: {
    atlasSrc: 'assets/images/resourcemarket_spritesheet.png',
    atlasSize: { x: 1403, y: 1194 },
    x: 180,
    y: 0,
    w: 39,
    h: 39
  },
  exit_icon: {
    atlasSrc: 'assets/images/resourcemarket_spritesheet.png',
    atlasSize: { x: 1403, y: 1194 },
    x: 219,
    y: 0,
    w: 39,
    h: 39
  }
}

export const resourcesSprites: Record<Items, Sprite> = {
  [Items.I_UNSELECTED]: {
    atlasSrc: '',
    atlasSize: { x: 0, y: 0 },
    x: 0,
    y: 0,
    w: 0,
    h: 0
  },
  [Items.I_BERRY]: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 0,
    y: 0,
    w: 256,
    h: 256
  },
  [Items.I_BONE]: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 256,
    y: 0,
    w: 256,
    h: 256
  },
  [Items.I_COIN]: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 768,
    y: 0,
    w: 256,
    h: 256
  },
  [Items.I_TOKEN]: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 1280,
    y: 0,
    w: 256,
    h: 256
  },
  [Items.I_MEAT]: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 768,
    y: 512,
    w: 256,
    h: 256
  },
  [Items.I_WOOD]: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 512,
    y: 512,
    w: 256,
    h: 256
  },
  [Items.I_IRON]: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 0,
    y: 768,
    w: 256,
    h: 256
  }
}

export const ITEMS: Record<Items, Item> = {
  [Items.I_UNSELECTED]: {
    name: 'Unselected',
    sellPrice: 0,
    buyPrice: 0,
    withMana: false,
    sprite: resourcesSprites.unselected,
    id: Items.I_UNSELECTED
  },
  [Items.I_BERRY]: {
    name: 'Berry',
    sellPrice: 1,
    buyPrice: 5,
    withMana: false,
    sprite: resourcesSprites.berry,
    id: Items.I_BERRY
  },
  [Items.I_BONE]: {
    name: 'Bone',
    sellPrice: 0,
    buyPrice: 1,
    withMana: false,
    sprite: resourcesMarketSprites.bone,
    id: Items.I_BONE
  },
  [Items.I_COIN]: {
    name: 'Coins',
    sellPrice: 0,
    buyPrice: 0.1,
    withMana: true,
    sprite: resourcesMarketSprites.coins,
    id: Items.I_COIN
  },
  [Items.I_TOKEN]: {
    name: 'Premium Dungeon Tokens',
    sellPrice: 0,
    buyPrice: 1,
    withMana: true,
    sprite: resourcesMarketSprites.token,
    id: Items.I_TOKEN
  },
  [Items.I_MEAT]: {
    name: '',
    // provisory sprite
    sellPrice: 0,
    buyPrice: 1,
    withMana: true,
    sprite: resourcesMarketSprites.token,
    id: Items.I_MEAT
  },
  [Items.I_WOOD]: {
    name: '',
    // provisory sprite
    sellPrice: 0,
    buyPrice: 1,
    withMana: true,
    sprite: resourcesMarketSprites.token,
    id: Items.I_WOOD
  },
  [Items.I_IRON]: {
    name: '',
    // provisory sprite
    sellPrice: 0,
    buyPrice: 1,
    withMana: true,
    sprite: resourcesMarketSprites.token,
    id: Items.I_IRON
  }
}

export const RESOURCES_INVENTORY: InventoryItem[] = [
  { item: ITEMS.berry, amount: 10 },
  { item: ITEMS.bone, amount: 5 }
]

// Amount isn't an optional now, this is because idk how set optional in schemas.
export const RESOURCES_MARKET: InventoryItem[] = [
  { item: ITEMS.berry },
  { item: ITEMS.bone, amount: 9999 },
  { item: ITEMS.token, amount: 9999 },
  { item: ITEMS.coins, amount: 9999 }
]

export type Item = {
  name: string
  sellPrice: number
  buyPrice: number
  withMana: boolean
  sprite: Sprite
  id: string
}

export type InventoryItem = {
  item: Item
  amount?: number
}
