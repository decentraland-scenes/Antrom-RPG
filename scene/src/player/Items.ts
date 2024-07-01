export enum itemTypes {
  SWORD = 'sword',
  HELMET = 'helmet',
  SHIELD = 'shield'
}

export enum buffTypes {
  ATTACK = 'attack',
  DEFENSE = 'defense',
  LUCK = 'luck'
}

export type buffItem = {
  type: buffTypes
  value: number
}

export class Item {
  id: number
  name: string
  type: itemTypes
  image: string
  buff: buffItem[] | buffItem
  needs?: number[]
  constructor(
    id: number,
    name: string,
    type: itemTypes,
    buff: buffItem | buffItem[],
    image: string = ''
  ) {
    this.id = id
    this.name = name
    this.type = type
    this.buff = buff
    this.image = image
  }
}
export const ItemTree = {
  0: {
    name: 'Basic Rune',
    type: itemTypes.SWORD,
    image: 'images/basic_rune.png',
    sprite: 'basic_rune.png',
    buff: {
      type: buffTypes.ATTACK,
      value: 60
    },
    craftingMaterials: {
      wood: 50,
      chicken: 50,
      rock: 50,
      bone: 0
    }
  },
  1: {
    name: 'Adv. Rune',
    type: itemTypes.SWORD,
    image: 'images/adv_rune.png',
    sprite: 'adv_rune.png',
    buff: {
      type: buffTypes.ATTACK,
      value: 600
    },
    craftingMaterials: {
      wood: 4000,
      chicken: 5000,
      rock: 2500,
      bone: 500
    },
    needs: [0]
  },
  2: {
    name: 'Master Rune',
    type: itemTypes.SWORD,
    image: 'images/master_rune.png',
    sprite: 'master_rune.png',
    buff: {
      type: buffTypes.ATTACK,
      value: 1500
    },
    craftingMaterials: {
      wood: 12000,
      chicken: 15000,
      rock: 7500,
      bone: 1500
    },
    needs: [1]
  },
  3: {
    name: 'Basic Scroll',
    type: itemTypes.HELMET,
    image: 'images/basic_scroll.png',
    sprite: 'basic_scroll.png',
    buff: {
      type: buffTypes.LUCK,
      value: 2
    },
    craftingMaterials: {
      wood: 50,
      chicken: 50,
      rock: 50,
      bone: 0
    }
  },
  4: {
    name: 'Adv. Scroll',
    type: itemTypes.HELMET,
    image: 'images/adv_scroll.png',
    sprite: 'adv_scroll.png',
    buff: {
      type: buffTypes.LUCK,
      value: 4
    },
    craftingMaterials: {
      wood: 4000,
      chicken: 5000,
      rock: 2500,
      bone: 500
    },
    needs: [3]
  },
  5: {
    name: 'Master Scroll',
    type: itemTypes.HELMET,
    image: 'images/master_scroll.png',
    sprite: 'master_scroll.png',
    buff: {
      type: buffTypes.LUCK,
      value: 6
    },
    craftingMaterials: {
      wood: 12000,
      chicken: 15000,
      rock: 7500,
      bone: 1500
    },
    needs: [4]
  },
  6: {
    name: 'Basic Spell',
    type: itemTypes.SHIELD,
    image: 'images/basic_spell.png',
    sprite: 'basic_spell.png',
    buff: {
      type: buffTypes.DEFENSE,
      value: 0.05
    },
    craftingMaterials: {
      wood: 50,
      chicken: 50,
      rock: 50,
      bone: 0
    }
  },
  7: {
    name: 'Adv. Spell',
    type: itemTypes.SHIELD,
    image: 'images/adv_spell.png',
    sprite: 'adv_spell.png',
    buff: {
      type: buffTypes.DEFENSE,
      value: 0.1
    },
    craftingMaterials: {
      wood: 4000,
      chicken: 5000,
      rock: 2500,
      bone: 500
    },
    needs: [6]
  },
  8: {
    name: 'Master Spell',
    type: itemTypes.SHIELD,
    image: 'images/master_spell.png',
    sprite: 'master_spell.png',
    buff: {
      type: buffTypes.DEFENSE,
      value: 0.15
    },
    craftingMaterials: {
      wood: 12000,
      chicken: 15000,
      rock: 7500,
      bone: 1500
    },
    needs: [7]
  }
}

export const dailyRewards = [
  { image: 'images/ore.png', name: 'ore', value: 0 },
  { image: 'images/chicken.png', name: 'chicken', value: 0 },
  { image: 'images/berries.png', name: 'berries', value: 0 },
  { image: 'images/tree.png', name: 'tree', value: 0 },
  { image: 'images/monster.png', name: 'bone', value: 0 },
  { image: 'images/coin.png', name: 'coin', value: 0 },
  { image: 'images/ore.png', name: 'ore', value: 0 },
  { image: 'images/chicken.png', name: 'chicken', value: 0 },
  { image: 'images/berries.png', name: 'berries', value: 0 },
  { image: 'images/tree.png', name: 'tree', value: 0 },
  { image: 'images/monster.png', name: 'bone', value: 0 },
  { image: 'images/coin.png', name: 'coin', value: 0 },
  { image: 'images/ore.png', name: 'ore', value: 0 },
  { image: 'images/chicken.png', name: 'chicken', value: 0 },
  { image: 'images/berries.png', name: 'berries', value: 0 },
  { image: 'images/tree.png', name: 'tree', value: 0 },
  { image: 'images/monster.png', name: 'bone', value: 0 },
  { image: 'images/coin.png', name: 'coin', value: 0 },
  { image: 'images/ore.png', name: 'ore', value: 0 },
  { image: 'images/chicken.png', name: 'chicken', value: 0 },
  { image: 'images/berries.png', name: 'berries', value: 0 },
  { image: 'images/tree.png', name: 'tree', value: 0 },
  { image: 'images/monster.png', name: 'bone', value: 0 },
  { image: 'images/coin.png', name: 'coin', value: 0 },
  { image: 'images/ore.png', name: 'ore', value: 0 },
  { image: 'images/chicken.png', name: 'chicken', value: 0 },
  { image: 'images/berries.png', name: 'berries', value: 0 },
  { image: 'images/tree.png', name: 'tree', value: 0 },
  { image: 'images/monster.png', name: 'bone', value: 0 },
  { image: 'images/coin.png', name: 'coin', value: 0 },
  { image: 'images/ore.png', name: 'ore', value: 0 },
  { image: 'images/chicken.png', name: 'chicken', value: 0 },
  { image: 'images/berries.png', name: 'berries', value: 0 },
  { image: 'images/tree.png', name: 'tree', value: 0 },
  { image: 'images/monster.png', name: 'bone', value: 0 },
  { image: 'images/coin.png', name: 'coin', value: 0 }
]
