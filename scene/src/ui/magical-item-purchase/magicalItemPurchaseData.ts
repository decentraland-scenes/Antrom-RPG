import type { Item } from '../resources-market/resourcesData'
import { ITEMS } from '../resources-market/resourcesData'
import type { Sprite } from '../utils/utils'

export type MagicalItem = {
  name: string
  craftCost?: CraftCost[]
  sprite: Sprite
  id: string
}

export type CraftCost = {
  item: Item
  amount: number
}

export enum MagicalItems {
  W_UNSELECTED = 'unselected',
  
}

export const magicalItemsSprites: Record<MagicalItems, Sprite> = {
  [MagicalItems.W_UNSELECTED]: {
    atlasSrc: '',
    atlasSize: { x: 0, y: 0 },
    x: 0,
    y: 0,
    w: 0,
    h: 0
  }
}

export const magicalItemsMarketSprites: Record<string, Sprite> = {
  background: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 95,
    y: 100,
    w: 1210,
    h: 685
  },
  exit_icon: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 180,
    y: 888,
    w: 38,
    h: 38
  },
  selected_frame: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 1237,
    y: 883,
    w: 164,
    h: 160
  },
  purchase: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 219,
    y: 883,
    w: 280,
    h: 60
  },
  purchase_unavailable: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 499,
    y: 883,
    w: 280,
    h: 60
  },
  purchase_clicked: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 779,
    y: 883,
    w: 280,
    h: 60
  },
  left: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 0,
    y: 883,
    w: 60,
    h: 60
  },
  left_unavailable: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 60,
    y: 883,
    w: 60,
    h: 60
  },
  left_clicked: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 120,
    y: 883,
    w: 60,
    h: 60
  },
  right: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 1059,
    y: 883,
    w: 60,
    h: 60
  },
  right_unavailable: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 1119,
    y: 883,
    w: 60,
    h: 60
  },
  right_clicked: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 1179,
    y: 883,
    w: 60,
    h: 60
  }
}

export const MAGICAL_ITEMS: Record<MagicalItems, MagicalItem> = {
  [MagicalItems.W_UNSELECTED]: {
    name: '',
    craftCost: [{ item: ITEMS.unselected, amount: 0 }],
    sprite: magicalItemsSprites.unselected,
    id: ''
  }
}

export const MAGICAL_ITEMS_MARKET: MagicalItem[] = [
  MAGICAL_ITEMS.unselected
]

export const ASPECT_RATIO = 0.57
export const WIDTH_FACTOR = 0.5
export const HEIGTH_FACTOR = WIDTH_FACTOR * ASPECT_RATIO
export const ITEM_SIZE_FACTOR = 0.12
export const WEARABLES_TO_SHOW = 9
export const PURCHASE_SPRITE: Sprite = magicalItemsMarketSprites.purchase
export const CLICKED_PURCHASE_SPRITE: Sprite =
  magicalItemsMarketSprites.purchase_clicked

export type MagicalItemsMarketProp = {
  isVisible: boolean
  selectedMagicalItem: MagicalItem | undefined
  backgroundSprite: Sprite
  leftButton: Sprite
  rightButton: Sprite
  buttonSprite: Sprite
  scrollPosition: number
  magicalItemsToShow: MagicalItem[]
  changeVisibility: () => void
  scrollLeft: () => void
  scrollRight: () => void
  upScrollButtons: () => void
  tradeDown: () => void
  tradeUp: () => void
  selectMagicalItem: (arg: MagicalItemButtonProp) => void
}

export type MagicalItemButtonProp = {
  magicalItem: MagicalItem
}
