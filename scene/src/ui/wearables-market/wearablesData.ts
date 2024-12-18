import type { Item } from '../resources-market/resourcesData'
import { ITEMS } from '../resources-market/resourcesData'
import type { Sprite } from '../../utils/ui-utils'

export type Wearable = {
  name: string
  craftCost?: CraftCost[]
  sprite: Sprite
  id: string
}

export type CraftCost = {
  item: Item
  amount: number
}

export enum Wearables {
  W_MAGE = 'mage',
  W_MAGE_HAT = 'mage_hat',
  W_MAGE_STAFF = 'mage_staff',
  W_RANGER = 'ranger',
  W_RANGER_HOOD = 'ranger_hood',
  W_RANGER_BOW = 'ranger_bow',
  W_BERSERKER = 'berserker',
  W_BERSERKER_AXE = 'berserker_axe',
  W_BERSERKER_HELM = 'berserker_helm'
}

export const wearablesSprites: Record<Wearables, Sprite> = {
  [Wearables.W_MAGE]: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 512,
    y: 0,
    w: 128,
    h: 128
  },
  [Wearables.W_MAGE_HAT]: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 384,
    y: 0,
    w: 128,
    h: 128
  },
  [Wearables.W_MAGE_STAFF]: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 640,
    y: 0,
    w: 128,
    h: 128
  },
  [Wearables.W_RANGER]: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 128,
    y: 128,
    w: 128,
    h: 128
  },
  [Wearables.W_RANGER_HOOD]: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 0,
    y: 128,
    w: 128,
    h: 128
  },
  [Wearables.W_RANGER_BOW]: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 768,
    y: 0,
    w: 128,
    h: 128
  },
  [Wearables.W_BERSERKER]: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 128,
    y: 0,
    w: 128,
    h: 128
  },
  [Wearables.W_BERSERKER_AXE]: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 256,
    y: 0,
    w: 128,
    h: 128
  },
  [Wearables.W_BERSERKER_HELM]: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 0,
    y: 0,
    w: 128,
    h: 128
  }
}

export const wearablesMarketSprites: Record<string, Sprite> = {
  background: {
    atlasSrc: 'assets/images/apprenticemarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1044 },
    x: 95,
    y: 100,
    w: 1210,
    h: 685
  },
  exit_icon: {
    atlasSrc: 'assets/images/apprenticemarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1044 },
    x: 180,
    y: 888,
    w: 38,
    h: 38
  },
  selected_frame: {
    atlasSrc: 'assets/images/apprenticemarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1044 },
    x: 1237,
    y: 883,
    w: 164,
    h: 160
  },
  purchase: {
    atlasSrc: 'assets/images/apprenticemarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1044 },
    x: 219,
    y: 883,
    w: 280,
    h: 60
  },
  purchase_unavailable: {
    atlasSrc: 'assets/images/apprenticemarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1044 },
    x: 499,
    y: 883,
    w: 280,
    h: 60
  },
  purchase_clicked: {
    atlasSrc: 'assets/images/apprenticemarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1044 },
    x: 779,
    y: 883,
    w: 280,
    h: 60
  },
  left: {
    atlasSrc: 'assets/images/apprenticemarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1044 },
    x: 0,
    y: 883,
    w: 60,
    h: 60
  },
  left_unavailable: {
    atlasSrc: 'assets/images/apprenticemarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1044 },
    x: 60,
    y: 883,
    w: 60,
    h: 60
  },
  left_clicked: {
    atlasSrc: 'assets/images/apprenticemarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1044 },
    x: 120,
    y: 883,
    w: 60,
    h: 60
  },
  right: {
    atlasSrc: 'assets/images/apprenticemarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1044 },
    x: 1059,
    y: 883,
    w: 60,
    h: 60
  },
  right_unavailable: {
    atlasSrc: 'assets/images/apprenticemarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1044 },
    x: 1119,
    y: 883,
    w: 60,
    h: 60
  },
  right_clicked: {
    atlasSrc: 'assets/images/apprenticemarket_spritesheet.png',
    atlasSize: { x: 1402, y: 1044 },
    x: 1179,
    y: 883,
    w: 60,
    h: 60
  }
}

export const WEARABLES: Record<Wearables, Wearable> = {
  [Wearables.W_MAGE]: {
    name: 'Mage',
    craftCost: [
      { item: ITEMS.meat, amount: 250 },
      { item: ITEMS.wood, amount: 250 },
      { item: ITEMS.iron, amount: 250 }
    ],
    sprite: wearablesSprites.mage,
    id: Wearables.W_MAGE
  },
  [Wearables.W_MAGE_HAT]: {
    name: 'Mage Hat',
    craftCost: [
      { item: ITEMS.meat, amount: 250 },
      { item: ITEMS.wood, amount: 250 },
      { item: ITEMS.iron, amount: 250 }
    ],
    sprite: wearablesSprites.mage_hat,
    id: Wearables.W_MAGE_HAT
  },
  [Wearables.W_MAGE_STAFF]: {
    name: 'Mage Staff',
    craftCost: [
      { item: ITEMS.meat, amount: 250 },
      { item: ITEMS.wood, amount: 250 },
      { item: ITEMS.iron, amount: 250 }
    ],
    sprite: wearablesSprites.mage_staff,
    id: Wearables.W_MAGE_STAFF
  },
  [Wearables.W_RANGER]: {
    name: 'Ranger',
    craftCost: [
      { item: ITEMS.meat, amount: 250 },
      { item: ITEMS.wood, amount: 250 },
      { item: ITEMS.iron, amount: 250 }
    ],
    sprite: wearablesSprites.ranger,
    id: Wearables.W_RANGER
  },
  [Wearables.W_RANGER_HOOD]: {
    name: 'Ranger Hood',
    craftCost: [
      { item: ITEMS.meat, amount: 250 },
      { item: ITEMS.wood, amount: 250 },
      { item: ITEMS.iron, amount: 250 }
    ],
    sprite: wearablesSprites.ranger_hood,
    id: Wearables.W_RANGER_HOOD
  },
  [Wearables.W_RANGER_BOW]: {
    name: 'Ranger Bow',
    craftCost: [
      { item: ITEMS.meat, amount: 250 },
      { item: ITEMS.wood, amount: 250 },
      { item: ITEMS.iron, amount: 250 }
    ],
    sprite: wearablesSprites.ranger_bow,
    id: Wearables.W_RANGER_BOW
  },
  [Wearables.W_BERSERKER]: {
    name: 'Berserker',
    craftCost: [
      { item: ITEMS.meat, amount: 250 },
      { item: ITEMS.wood, amount: 250 },
      { item: ITEMS.iron, amount: 250 }
    ],
    sprite: wearablesSprites.berserker,
    id: Wearables.W_BERSERKER
  },
  [Wearables.W_BERSERKER_AXE]: {
    name: 'Berserker Axe',
    craftCost: [
      { item: ITEMS.meat, amount: 250 },
      { item: ITEMS.wood, amount: 250 },
      { item: ITEMS.iron, amount: 250 }
    ],
    sprite: wearablesSprites.berserker_axe,
    id: Wearables.W_BERSERKER_AXE
  },
  [Wearables.W_BERSERKER_HELM]: {
    name: 'Berserker Helm',
    craftCost: [
      { item: ITEMS.meat, amount: 250 },
      { item: ITEMS.wood, amount: 250 },
      { item: ITEMS.iron, amount: 250 }
    ],
    sprite: wearablesSprites.berserker_helm,
    id: Wearables.W_BERSERKER_HELM
  }
}

export const APPRENTICE_WEARABLES: Wearable[] = [
  WEARABLES.mage,
  WEARABLES.mage_hat,
  WEARABLES.mage_staff,
  WEARABLES.ranger,
  WEARABLES.ranger_bow,
  WEARABLES.ranger_hood,
  WEARABLES.berserker,
  WEARABLES.berserker_axe,
  WEARABLES.berserker_helm
]

export const ASPECT_RATIO = 0.57
export const WIDTH_FACTOR = 0.5
export const HEIGTH_FACTOR = WIDTH_FACTOR * ASPECT_RATIO
export const ITEM_SIZE_FACTOR = 0.12
export const WEARABLES_TO_SHOW = 9
export const PURCHASE_SPRITE: Sprite = wearablesMarketSprites.purchase
export const CLICKED_PURCHASE_SPRITE: Sprite =
  wearablesMarketSprites.purchase_clicked

export type WearablesMarketProps = {
  isVisible: boolean
  selectedWearable: Wearable | undefined
  backgroundSprite: Sprite
  leftButton: Sprite
  rightButton: Sprite
  buttonSprite: Sprite
  scrollPosition: number
  wearablesToShow: Wearable[]
  changeVisibility: () => void
  scrollLeft: () => void
  scrollRight: () => void
  upScrollButtons: () => void
  tradeDown: () => void
  tradeUp: () => void
  selectWearable: (arg: Wearable) => void
}

export type WearableButtonProp = {
  wearable: Wearable
  selectedWearable: Wearable | undefined
  selectWearable: (arg: Wearable) => void
}
