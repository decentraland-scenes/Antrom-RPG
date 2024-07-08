import type { Item } from '../resources-market/resourcesData'
import { ITEMS } from '../resources-market/resourcesData'
import type { Sprite } from '../../utils/ui-utils'

export const magicalItemsMarketSprites: Record<string, Sprite> = {
  background: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 99,
    y: 162,
    w: 1201,
    h: 672
  },
  exit_icon: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 179,
    y: 0,
    w: 40,
    h: 40
  },
  selected_frame: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 0,
    y: 934,
    w: 160,
    h: 161
  },
  purchase: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 220,
    y: 0,
    w: 280,
    h: 60
  },
  purchase_unavailable: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 500,
    y: 0,
    w: 280,
    h: 60
  },
  purchase_clicked: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 780,
    y: 0,
    w: 280,
    h: 60
  },
  left: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 0,
    y: 0,
    w: 60,
    h: 60
  },
  left_unavailable: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 60,
    y: 0,
    w: 60,
    h: 60
  },
  left_clicked: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 120,
    y: 0,
    w: 60,
    h: 60
  },
  right: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 1060,
    y: 0,
    w: 60,
    h: 60
  },
  right_unavailable: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 1120,
    y: 0,
    w: 60,
    h: 60
  },
  right_clicked: {
    atlasSrc: 'assets/images/magicalitemsmarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1096 },
    x: 1180,
    y: 0,
    w: 60,
    h: 60
  }
}

export const MAGICAL_ITEMS_MARKET: Item[] = [
  ITEMS.b_rune,
  ITEMS.a_rune,
  ITEMS.m_rune,
  ITEMS.b_spell,
  ITEMS.a_spell,
  ITEMS.m_spell,
  ITEMS.b_scroll,
  ITEMS.a_scroll,
  ITEMS.m_scroll
]

export const ASPECT_RATIO = 0.56
export const WIDTH_FACTOR = 0.5
export const HEIGTH_FACTOR = WIDTH_FACTOR * ASPECT_RATIO
export const ITEM_SIZE_FACTOR = 0.12
export const MAGICAL_ITEMS_TO_SHOW = 9
export const PURCHASE_SPRITE: Sprite = magicalItemsMarketSprites.purchase
export const CLICKED_PURCHASE_SPRITE: Sprite =
  magicalItemsMarketSprites.purchase_clicked

export type MagicalItemsMarketProp = {
  isVisible: boolean
  selectedMagicalItem: Item | undefined
  backgroundSprite: Sprite
  leftButton: Sprite
  rightButton: Sprite
  buttonSprite: Sprite
  scrollPosition: number
  magicalItemsToShow: Item[]
  changeVisibility: () => void
  scrollLeft: () => void
  scrollRight: () => void
  upScrollButtons: () => void
  tradeDown: () => void
  tradeUp: () => void
  selectMagicalItem: (arg: Item) => void
}
