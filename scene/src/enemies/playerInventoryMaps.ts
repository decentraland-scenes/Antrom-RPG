export enum ITEM_TYPES {
  BERRY = 'berry',
  BONE = 'bone',
  CHICKEN = 'chicken',
  CRYSTAL = 'crystal',
  COIN = 'coin',
  STEEL = 'steel',
  PLANK = 'plank',
  EGG = 'egg',
  BOAT = 'boat',
  ICEHEART = 'ice-heart',
  ICESHARD = 'ice-shard',
  ROCK = 'rock',
  TREE = 'tree',
  POTION = 'potion',
  XPPOTION = 'xp-potion',
  GEM1 = 'gem1',
  GEM2 = 'gem2',
  GEM3 = 'gem3',
  GEM4 = 'gem4',
  HOME = 'home',
  DRAGON = 'dragon',
  // bbd quest items
  FIND_DOLLIE = 'find_dollie',
  HEART = 'hearts',
  DOLLIE_THANKS = 'dollie_thanks',
  BBDBOSSDEFEAT = 'bbdbossdefeat',
  // dweller quest items
  FIND_ALARA = 'find_alara',
  CRYSTALS = 'crystals',
  THANK_ALARA = 'thank_alara',
  DWELLER = 'dweller',
  FINAL_ALARA = 'final_alara',
  // Oligar
  OLIGAR_HEAD = 'oligar_head'
}

export const INVENTORY_CONFIG = {
  [ITEM_TYPES.OLIGAR_HEAD]: {
    name: 'OLIGAR_HEAD',
    image: 'assets/images/berries.png',
    sprite: 'Berrys.png',
    type: ITEM_TYPES.OLIGAR_HEAD
  },
  [ITEM_TYPES.THANK_ALARA]: {
    name: 'THANK_ALARA',
    image: 'assets/images/berries.png',
    sprite: 'Berrys.png',
    type: ITEM_TYPES.THANK_ALARA
  },
  [ITEM_TYPES.CRYSTALS]: {
    name: 'CRYSTALS',
    image: 'assets/images/berries.png',
    sprite: 'Berrys.png',
    type: ITEM_TYPES.CRYSTALS
  },
  [ITEM_TYPES.FIND_ALARA]: {
    name: 'FIND_ALARA',
    image: 'assets/images/berries.png',
    sprite: 'Berrys.png',
    type: ITEM_TYPES.FIND_ALARA
  },
  [ITEM_TYPES.DWELLER]: {
    name: 'DWELLER',
    image: 'assets/images/berries.png',
    sprite: 'Berrys.png',
    type: ITEM_TYPES.DWELLER
  },
  [ITEM_TYPES.FIND_DOLLIE]: {
    name: 'FIND_DOLLIE',
    image: 'assets/images/berries.png',
    sprite: 'Berrys.png',
    type: ITEM_TYPES.FIND_DOLLIE
  },
  [ITEM_TYPES.DOLLIE_THANKS]: {
    name: 'DOLLIE_THANKS',
    image: 'assets/images/berries.png',
    sprite: 'Berrys.png',
    type: ITEM_TYPES.DOLLIE_THANKS
  },
  [ITEM_TYPES.BBDBOSSDEFEAT]: {
    name: 'BBDBOSSDEFEAT',
    image: 'assets/images/berries.png',
    sprite: 'Berrys.png',
    type: ITEM_TYPES.BBDBOSSDEFEAT
  },
  [ITEM_TYPES.HEART]: {
    name: 'Heart',
    image: 'assets/images/berries.png',
    sprite: 'Berrys.png',
    type: ITEM_TYPES.HEART
  },
  [ITEM_TYPES.BERRY]: {
    name: 'Berry',
    image: 'assets/images/berries.png',
    sprite: 'Berrys.png',
    type: ITEM_TYPES.BERRY
  },
  [ITEM_TYPES.BONE]: {
    name: 'Bone',
    image: 'assets/images/monster.png',
    sprite: 'Bone.png',
    type: ITEM_TYPES.BONE
  },
  [ITEM_TYPES.CHICKEN]: {
    name: 'Chicken',
    image: 'assets/images/chicken.png',
    sprite: 'Meat.png',
    type: ITEM_TYPES.CHICKEN
  },
  [ITEM_TYPES.CRYSTAL]: {
    name: 'Crystal',
    image: 'assets/images/crystal.png',
    sprite: 'Crystal.png',
    type: ITEM_TYPES.CRYSTAL
  },
  [ITEM_TYPES.COIN]: {
    name: 'Coin',
    image: 'assets/images/coin.png',
    sprite: 'Coins.png',
    type: ITEM_TYPES.COIN
  },
  [ITEM_TYPES.STEEL]: {
    name: 'Steel',
    image: 'assets/images/rock.png',
    sprite: 'Steel.png',
    type: ITEM_TYPES.STEEL
  },
  [ITEM_TYPES.PLANK]: {
    name: 'Plank',
    image: 'assets/images/plank.png',
    sprite: 'Planks.png',
    type: ITEM_TYPES.PLANK
  },
  [ITEM_TYPES.EGG]: {
    name: 'Egg',
    image: 'assets/images/egg.png',
    sprite: 'Eggs.png',
    type: ITEM_TYPES.EGG
  },
  [ITEM_TYPES.BOAT]: {
    name: 'Boat',
    image: 'assets/images/boat.png',
    sprite: 'boat.png',
    type: ITEM_TYPES.BOAT
  },
  [ITEM_TYPES.ICEHEART]: {
    name: 'Ice Heart',
    image: 'assets/images/iceSkull.png',
    sprite: 'iceSkull.png',
    type: ITEM_TYPES.ICEHEART
  },
  [ITEM_TYPES.ICESHARD]: {
    name: 'Ice Shard',
    image: 'assets/images/IceShard.png',
    sprite: 'iceShard.png',
    type: ITEM_TYPES.ICESHARD
  },
  // [ITEM_TYPES.BOAT]: {
  //     name: "Boat",
  //     image: "assets/images/boat.png",
  //     sprite: "",
  //     type: ITEM_TYPES.BOAT,
  // },
  // [ITEM_TYPES.ICEHEART]: {
  //     name: "Ice Heart",
  //     image: "assets/images/IceShard.png",
  //     sprite: "",
  //     type: ITEM_TYPES.ICEHEART,
  // },
  // [ITEM_TYPES.ICESHARD]: {
  //     name: "Ice Shard",
  //     image: "assets/images/iceSkull.png",
  //     sprite: "",
  //     type: ITEM_TYPES.ICESHARD,
  // },
  [ITEM_TYPES.ROCK]: {
    name: 'Rock',
    image: 'assets/images/ore.png',
    sprite: 'IronOre.png',
    type: ITEM_TYPES.ROCK
  },
  [ITEM_TYPES.TREE]: {
    name: 'Tree',
    image: 'assets/images/tree.png',
    sprite: 'Logs.png',
    type: ITEM_TYPES.TREE
  },
  [ITEM_TYPES.POTION]: {
    name: 'Potion',
    image: 'assets/images/potion.png',
    sprite: 'healthPotion.png',
    type: ITEM_TYPES.POTION
  },
  // [ITEM_TYPES.XPPOTION]: {
  //     name: "XP Potion",
  //     image: "assets/images/xPpotion.png",
  //     sprite: "",
  //     type: ITEM_TYPES.XPPOTION,
  // },
  [ITEM_TYPES.GEM1]: {
    name: 'Gem 1',
    image: 'assets/images/PurpGemThmb.png',
    sprite: 'Gem1.png',
    type: ITEM_TYPES.GEM1
  },
  [ITEM_TYPES.GEM2]: {
    name: 'Gem 2',
    image: 'assets/images/RedGemThmb.png',
    sprite: 'Gem2.png',
    type: ITEM_TYPES.GEM2
  },
  [ITEM_TYPES.GEM3]: {
    name: 'Gem 3',
    image: 'assets/images/YellowGemThmb.png',
    sprite: 'Gem3.png',
    type: ITEM_TYPES.GEM3
  },
  [ITEM_TYPES.GEM4]: {
    name: 'Gem 4',
    image: 'assets/images/GreenGemThmb.png',
    sprite: 'Gem4.png',
    type: ITEM_TYPES.GEM4
  }
  // [ITEM_TYPES.HOME]: {
  //     name: "Home",
  //     image: "assets/images/key.png",
  //     sprite: "",
  //     type: ITEM_TYPES.HOME,
  // },
}

export const INVENTORY_ITEMS = [
  ITEM_TYPES.ROCK,
  ITEM_TYPES.STEEL,
  ITEM_TYPES.BERRY,
  ITEM_TYPES.TREE,
  ITEM_TYPES.PLANK,
  ITEM_TYPES.CHICKEN,
  ITEM_TYPES.EGG,
  ITEM_TYPES.CRYSTAL,
  ITEM_TYPES.POTION,
  ITEM_TYPES.BONE,
  ITEM_TYPES.GEM1,
  ITEM_TYPES.GEM2,
  ITEM_TYPES.GEM3,
  ITEM_TYPES.GEM4,
  ITEM_TYPES.COIN
]

// ITEM_TYPES.HOME
// ITEM_TYPES.ICEHEART
// ITEM_TYPES.BOAT
// ITEM_TYPES.ICESHARD
// ITEM_TYPES.XPPOTION
