import type { Sprite } from '../utils/utils'

export enum Items {
  I_BERRY = 'berry',
  I_BONE = 'bone',
  I_COIN = 'coins',
  I_TOKEN = 'token',
  I_MEAT = 'meat',
  I_WOOD = 'wood',
  I_IRON = 'iron',
  I_BASIC_RUNE = 'b_rune',
  I_ADV_RUNE = 'a_rune',
  I_MASTER_RUNE = 'm_rune',
  I_BASIC_SPELL = 'b_spell',
  I_ADV_SPELL = 'a_spell',
  I_MASTER_SPELL = 'm_spell',
  I_BASIC_SCROLL = 'b_scroll',
  I_ADV_SCROLL = 'a_scroll',
  I_MASTER_SCROLL = 'm_scroll'
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
  },
    [Items.I_BASIC_RUNE]: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 1024,
    y: 768,
    w: 256,
    h: 256
  },
  [Items.I_ADV_RUNE]: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 256,
    y: 768,
    w: 256,
    h: 256
  },
  [Items.I_MASTER_RUNE]: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 1280,
    y: 256,
    w: 256,
    h: 256
  },
  [Items.I_BASIC_SPELL]: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 256,
    y: 1024,
    w: 256,
    h: 256
  },
  [Items.I_ADV_SPELL]: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 768,
    y: 768,
    w: 256,
    h: 256
  },
  [Items.I_MASTER_SPELL]: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 1280,
    y: 768,
    w: 256,
    h: 256
  },
  [Items.I_BASIC_SCROLL]: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 0,
    y: 1024,
    w: 256,
    h: 256
  },
  [Items.I_ADV_SCROLL]: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 512,
    y: 768,
    w: 256,
    h: 256
  },
  [Items.I_MASTER_SCROLL]: {
    atlasSrc: 'assets/images/item_spritesheet.png',
    atlasSize: { x: 1536, y: 1280 },
    x: 1280,
    y: 512,
    w: 256,
    h: 256
  },
}

export const ITEMS: Record<Items, Item> = {
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
  },
  [Items.I_BASIC_RUNE]: {
    name: 'Basic Rune',
    sellPrice: 0,
    buyPrice: 9999,
    withMana: false,
    // craftCost: [{ item: ITEMS.meat, amount: 50 }, { item: ITEMS.wood, amount: 50 }, { item: ITEMS.iron, amount: 50 }],
    sprite: resourcesSprites.b_rune,
    id: Items.I_BASIC_RUNE
  },
  [Items.I_ADV_RUNE]: {
    name: 'Advanced Rune',
    sellPrice: 0,
    buyPrice: 9999,
    withMana: false,
    // craftCost: [{ item: ITEMS.meat, amount: 5000 }, { item: ITEMS.wood, amount: 4000 }, { item: ITEMS.iron, amount: 2500 }, { item: ITEMS.bone, amount: 500 }],
    sprite: resourcesSprites.a_rune,
    id: Items.I_ADV_RUNE
  },
  [Items.I_MASTER_RUNE]: {
    name: 'Master Rune',
    sellPrice: 0,
    buyPrice: 9999,
    withMana: false,
    // craftCost: [{ item: ITEMS.meat, amount: 15000 }, { item: ITEMS.wood, amount: 12000 }, { item: ITEMS.iron, amount: 7500 }, { item: ITEMS.bone, amount: 1500 }],
    sprite: resourcesSprites.m_rune,
    id: Items.I_MASTER_RUNE
  },
  [Items.I_BASIC_SPELL]: {
    name: 'Basic Spell',
    sellPrice: 0,
    buyPrice: 9999,
    withMana: false,
    // craftCost: [{ item: ITEMS.meat, amount: 50 }, { item: ITEMS.wood, amount: 50 }, { item: ITEMS.iron, amount: 50 }],
    sprite: resourcesSprites.b_spell,
    id: Items.I_BASIC_SPELL
  },
  [Items.I_ADV_SPELL]: {
    name: 'Advanced Spell',
    sellPrice: 0,
    buyPrice: 9999,
    withMana: false,
    // craftCost: [{ item: ITEMS.meat, amount: 5000 }, { item: ITEMS.wood, amount: 4000 }, { item: ITEMS.iron, amount: 2500 }, { item: ITEMS.bone, amount: 500 }],
    sprite: resourcesSprites.a_spell,
    id: Items.I_ADV_SPELL
  },
  [Items.I_MASTER_SPELL]: {
    name: 'Master Spell',
    sellPrice: 0,
    buyPrice: 9999,
    withMana: false,
    // craftCost: [{ item: ITEMS.meat, amount: 15000 }, { item: ITEMS.wood, amount: 12000 }, { item: ITEMS.iron, amount: 7500 }, { item: ITEMS.bone, amount: 1500 }],
    sprite: resourcesSprites.m_spell,
    id: Items.I_MASTER_SPELL
  },
  [Items.I_BASIC_SCROLL]: {
    name: 'Basic Scroll',
    sellPrice: 0,
    buyPrice: 9999,
    withMana: false,
    // craftCost: [{ item: ITEMS.meat, amount: 50 }, { item: ITEMS.wood, amount: 50 }, { item: ITEMS.iron, amount: 50 }],
    sprite: resourcesSprites.b_scroll,
    id: Items.I_BASIC_SCROLL
  },
  [Items.I_ADV_SCROLL]: {
    name: 'Advanced Scroll',
    sellPrice: 0,
    buyPrice: 9999,
    withMana: false,
    // craftCost: [{ item: ITEMS.meat, amount: 5000 }, { item: ITEMS.wood, amount: 4000 }, { item: ITEMS.iron, amount: 2500 }, { item: ITEMS.bone, amount: 500 }],
    sprite: resourcesSprites.a_scroll,
    id: Items.I_ADV_SCROLL
  },
  [Items.I_MASTER_SCROLL]: {
    name: 'Master Scroll',
    sellPrice: 0,
    buyPrice: 9999,
    withMana: false,
    // craftCost: [{ item: ITEMS.meat, amount: 15000 }, { item: ITEMS.wood, amount: 12000 }, { item: ITEMS.iron, amount: 7500 }, { item: ITEMS.bone, amount: 1500 }],
    sprite: resourcesSprites.m_scroll,
    id: Items.I_MASTER_SCROLL
  }
}

export const RESOURCES_INVENTORY: InventoryItem[] = [
  { item: ITEMS.berry, amount: 10 },
  { item: ITEMS.bone, amount: 5 }
]

export const RESOURCES_MARKET: InventoryItem[] = [
  { item: ITEMS.berry },
  { item: ITEMS.bone, amount: 9999 },
  { item: ITEMS.token, amount: 9999 },
  { item: ITEMS.coins, amount: 9999 }
]

export type CraftCost = {
  item: Item
  amount: number
}

export type Item = {
  name: string
  sellPrice: number
  buyPrice: number
  withMana: boolean
  sprite: Sprite
  id: string
  craftCost?: CraftCost[]
}

export type InventoryItem = {
  item: Item
  amount?: number
}

export type ResourcesMarketProps = {
  isVisible: boolean
  balance: number
  tradeClicked: boolean
  isSelling: boolean
  itemsArray: InventoryItem[]
  totalPrice: number
  buttonMaxSprite: Sprite
  selectedQuantity: number
  selectedItem: InventoryItem | undefined
  changeVisibility: () => void
  selectItem: (arg: InventoryItem) => void
  updatePrice: (arg: string) => void
  mouseDownMax: () => void
  mouseUpMax: (arg: InventoryItem) => void
  setSelling: (arg: boolean) => void
  tradeDown: () => void
  tradeUp: () => void
  isUnavailable: () => boolean
}

export const ASPECT_RATIO = 0.7
export const WIDTH_FACTOR = 0.5
export const HEIGTH_FACTOR = WIDTH_FACTOR * ASPECT_RATIO
export const SIZE_ITEM_FACTOR = 0.1
