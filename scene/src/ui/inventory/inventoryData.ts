import { type Sprite } from '../../utils/ui-utils'

export const CHARACTER_WEARABLES_TO_SHOW = 5

export const inventorySprites = {
  inventoryButton: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 0,
    y: 0,
    w: 328,
    h: 70
  },
  inventoryButtonSelected: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 328,
    y: 0,
    w: 328,
    h: 70
  },
  professionsButton: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 662,
    y: 0,
    w: 328,
    h: 70
  },
  professionsButtonSelected: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 992,
    y: 0,
    w: 328,
    h: 70
  },
  armorFilter: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 1320,
    y: 0,
    w: 303,
    h: 65
  },
  armorFilterSelected: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 1320,
    y: 65,
    w: 303,
    h: 65
  },
  commonItemFrame: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 1623,
    y: 0,
    w: 84,
    h: 84
  },
  epicItemFrame: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 1771,
    y: 64,
    w: 84,
    h: 84
  },
  companionsButton: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 0,
    y: 84,
    w: 328,
    h: 70
  },
  companionsButtonSelected: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 332,
    y: 84,
    w: 328,
    h: 70
  },
  skillsButton: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 662,
    y: 84,
    w: 328,
    h: 70
  },
  skillsButtonSelected: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 992,
    y: 84,
    w: 328,
    h: 70
  },
  downArrow: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 1707,
    y: 0,
    w: 64,
    h: 64
  },
  downArrowClicked: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 1771,
    y: 0,
    w: 64,
    h: 64
  },
  downArrowUnavailable: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 1707,
    y: 64,
    w: 64,
    h: 64
  },

  exitButton: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 1835,
    y: 0,
    w: 40,
    h: 40
  },

  inventoryPageFrame: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 0,
    y: 154,
    w: 1886,
    h: 963
  },

  leftArrowButton: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 0,
    y: 1117,
    w: 90,
    h: 90
  },

  leftArrowButtonUnavailable: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 90,
    y: 1117,
    w: 90,
    h: 90
  },

  leftArrowButtonClicked: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 180,
    y: 1117,
    w: 90,
    h: 90
  },

  leftArrow: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 270,
    y: 1117,
    w: 64,
    h: 64
  },

  leftArrowUnavailable: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 334,
    y: 1117,
    w: 64,
    h: 64
  },

  leftArrowClicked: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 398,
    y: 1117,
    w: 64,
    h: 64
  },

  legendaryItemFrame: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 462,
    y: 1117,
    w: 84,
    h: 84
  },

  professionFilterButton: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 546,
    y: 1117,
    w: 303,
    h: 65
  },

  professionFilterButtonClicked: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 849,
    y: 1117,
    w: 303,
    h: 65
  },

  rareItemFrame: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 1152,
    y: 1117,
    w: 84,
    h: 84
  },

  resourcesFilterButton: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 1236,
    y: 1117,
    w: 303,
    h: 65
  },

  resourcesFilterButtonClicked: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 1539,
    y: 1117,
    w: 303,
    h: 65
  },

  rightArrowButton: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 270,
    y: 1182,
    w: 90,
    h: 90
  },

  rightArrowButtonUnavail: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 360,
    y: 1182,
    w: 64,
    h: 64
  },

  rightArrowButtonUnavailable: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 546,
    y: 1182,
    w: 90,
    h: 90
  },

  rightArrowButtonClicked: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 636,
    y: 1182,
    w: 90,
    h: 90
  },

  rightArrow: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 726,
    y: 1182,
    w: 64,
    h: 64
  },

  rightArrowClicked: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 790,
    y: 1182,
    w: 64,
    h: 64
  },

  skillsButton2: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 660,
    y: 84,
    w: 330,
    h: 70
  },

  skillsButtonSelected2: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 990,
    y: 84,
    w: 330,
    h: 70
  },

  skillsButtonUnavailable2: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 1236,
    y: 1182,
    w: 329,
    h: 68
  },

  stat: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 726,
    y: 1250,
    w: 350,
    h: 146
  },

  topNavBarFrame: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 0,
    y: 1396,
    w: 1365,
    h: 84
  },

  uncommonItemFrame: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 1565,
    y: 1182,
    w: 84,
    h: 84
  },

  upArrow: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 854,
    y: 1182,
    w: 64,
    h: 64
  },

  upArrowUnavailable: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 918,
    y: 1182,
    w: 64,
    h: 64
  },

  upArrowClicked: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 982,
    y: 1182,
    w: 64,
    h: 64
  },

  weaponsFilterButton: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 1076,
    y: 1266,
    w: 303,
    h: 65
  },

  weaponsFilterButtonClicked: {
    atlasSrc: 'assets/images/inventory_spritesheet.png',
    atlasSize: { x: 1886, y: 1480 },
    x: 1379,
    y: 1266,
    w: 303,
    h: 65
  }
}

export const skillsPageSprites = {
  disableButton: {
    atlasSrc: 'assets/images/skillpage_spritesheet.png',
    atlasSize: { x: 3751, y: 956 },
    x: 0,
    y: 0,
    w: 250,
    h: 54
  },

  disableUnavailableButton: {
    atlasSrc: 'assets/images/skillpage_spritesheet.png',
    atlasSize: { x: 3751, y: 956 },
    x: 250,
    y: 0,
    w: 250,
    h: 54
  },
  equipButton: {
    atlasSrc: 'assets/images/skillpage_spritesheet.png',
    atlasSize: { x: 3751, y: 956 },
    x: 500,
    y: 0,
    w: 250,
    h: 54
  },
  lockedSkill: {
    atlasSrc: 'assets/images/skillpage_spritesheet.png',
    atlasSize: { x: 3751, y: 956 },
    x: 750,
    y: 0,
    w: 613,
    h: 679
  },

  skillsPageFrame: {
    atlasSrc: 'assets/images/skillpage_spritesheet.png',
    atlasSize: { x: 3751, y: 956 },
    x: 1363,
    y: 0,
    w: 1882,
    h: 956
  },

  equipUnavailableButton: {
    atlasSrc: 'assets/images/skillpage_spritesheet.png',
    atlasSize: { x: 3751, y: 956 },
    x: 3245,
    y: 0,
    w: 250,
    h: 54
  },
  leftArrowReg: {
    atlasSrc: 'assets/images/skillpage_spritesheet.png',
    atlasSize: { x: 3751, y: 956 },
    x: 3495,
    y: 0,
    w: 64,
    h: 64
  },
  leftArrowUnavail: {
    atlasSrc: 'assets/images/skillpage_spritesheet.png',
    atlasSize: { x: 3751, y: 956 },
    x: 3559,
    y: 0,
    w: 64,
    h: 64
  },
  leftArrowWhileClicked: {
    atlasSrc: 'assets/images/skillpage_spritesheet.png',
    atlasSize: { x: 3751, y: 956 },
    x: 3623,
    y: 0,
    w: 64,
    h: 64
  },
  rightArrowUnavail: {
    atlasSrc: 'assets/images/skillpage_spritesheet.png',
    atlasSize: { x: 3751, y: 956 },
    x: 3687,
    y: 0,
    w: 64,
    h: 64
  },
  rightArrowReg: {
    atlasSrc: 'assets/images/skillpage_spritesheet.png',
    atlasSize: { x: 3751, y: 956 },
    x: 0,
    y: 64,
    w: 64,
    h: 64
  },
  rightArrowWhileClicked: {
    atlasSrc: 'assets/images/skillpage_spritesheet.png',
    atlasSize: { x: 3751, y: 956 },
    x: 64,
    y: 64,
    w: 64,
    h: 64
  },
  selectionFrame: {
    atlasSrc: 'assets/images/skillpage_spritesheet.png',
    atlasSize: { x: 3751, y: 956 },
    x: 128,
    y: 64,
    w: 160,
    h: 160
  },
  skillslotNumber: {
    atlasSrc: 'assets/images/skillpage_spritesheet.png',
    atlasSize: { x: 3751, y: 956 },
    x: 288,
    y: 64,
    w: 40,
    h: 40
  }
}

export const wearablesSprite = {
  ABHelm_128x128: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },

    x: 0,
    y: 0,
    w: 128,
    h: 128
  },
  ABSuit_128x128: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 128,
    y: 0,
    w: 128,
    h: 128
  },
  ABSword_128x128: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 256,
    y: 0,
    w: 128,
    h: 128
  },
  AMHat_128x128: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 384,
    y: 0,
    w: 128,
    h: 128
  },
  AMMage_128x128: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 512,
    y: 0,
    w: 128,
    h: 128
  },
  AMStaff_128x128: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 640,
    y: 0,
    w: 128,
    h: 128
  },
  ARBow_128x128: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 768,
    y: 0,
    w: 128,
    h: 128
  },
  ARHood_128x128: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 0,
    y: 128,
    w: 128,
    h: 128
  },
  ARSuit_128x128: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 128,
    y: 128,
    w: 128,
    h: 128
  },
  BronzeCrown: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 256,
    y: 128,
    w: 128,
    h: 128
  },
  CallanCrown: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 384,
    y: 128,
    w: 128,
    h: 128
  },
  CarnageBlade: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 512,
    y: 128,
    w: 128,
    h: 128
  },
  CrystalCrown: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 640,
    y: 128,
    w: 128,
    h: 128
  },
  DeathWhisperDagger: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 768,
    y: 128,
    w: 128,
    h: 128
  },
  attack: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 0,
    y: 256,
    w: 128,
    h: 128
  },
  critr: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 128,
    y: 256,
    w: 128,
    h: 128
  },
  luck: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 256,
    y: 256,
    w: 128,
    h: 128
  },
  def: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 384,
    y: 256,
    w: 128,
    h: 128
  },
  health: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 512,
    y: 256,
    w: 128,
    h: 128
  },
  critd: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 640,
    y: 256,
    w: 128,
    h: 128
  },
  GLDSHLD: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 768,
    y: 256,
    w: 128,
    h: 128
  },
  GLDSWD: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 0,
    y: 384,
    w: 128,
    h: 128
  },
  HWHELM: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 128,
    y: 384,
    w: 128,
    h: 128
  },
  HWTRW: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 256,
    y: 384,
    w: 128,
    h: 128
  },
  HWUB: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 384,
    y: 384,
    w: 128,
    h: 128
  },
  ICECrown: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 512,
    y: 384,
    w: 128,
    h: 128
  },
  ICEScepter: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 640,
    y: 384,
    w: 128,
    h: 128
  },
  LeatherBoots: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 768,
    y: 384,
    w: 128,
    h: 128
  },
  LumberJack: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 0,
    y: 512,
    w: 128,
    h: 128
  },
  MGAXE: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 128,
    y: 512,
    w: 128,
    h: 128
  },
  MGBOW: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 256,
    y: 512,
    w: 128,
    h: 128
  },
  MGSWD: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 384,
    y: 512,
    w: 128,
    h: 128
  },
  NightmareBow: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 512,
    y: 512,
    w: 128,
    h: 128
  },
  ROYALARMOR: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 640,
    y: 512,
    w: 128,
    h: 128
  },
  ROYALHELM: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 768,
    y: 512,
    w: 128,
    h: 128
  },
  ROYALTROW: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 0,
    y: 640,
    w: 128,
    h: 128
  },
  RoyalMageBoots: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 128,
    y: 640,
    w: 128,
    h: 128
  },
  RoyalMageCloak: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 256,
    y: 640,
    w: 128,
    h: 128
  },
  RoyalMageRobe: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 384,
    y: 640,
    w: 128,
    h: 128
  },
  RoyalMageStaff: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 512,
    y: 640,
    w: 128,
    h: 128
  },
  RudolphRampage: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 640,
    y: 640,
    w: 128,
    h: 128
  },
  VikingFeet: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 768,
    y: 640,
    w: 128,
    h: 128
  },
  VikingHammer: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 0,
    y: 768,
    w: 128,
    h: 128
  },
  VikingHelm: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 128,
    y: 768,
    w: 128,
    h: 128
  },
  VikingLB: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 256,
    y: 768,
    w: 128,
    h: 128
  },
  VikingUB: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 384,
    y: 768,
    w: 128,
    h: 128
  },
  butcher: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 512,
    y: 768,
    w: 128,
    h: 128
  },
  candycover: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 640,
    y: 768,
    w: 128,
    h: 128
  },
  coin_couture: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 768,
    y: 768,
    w: 128,
    h: 128
  },
  doubleHackets: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 896,
    y: 0,
    w: 128,
    h: 128
  },
  eros_body: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 896,
    y: 128,
    w: 128,
    h: 128
  },
  eros_bow: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 896,
    y: 256,
    w: 128,
    h: 128
  },
  eros_head: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 896,
    y: 384,
    w: 128,
    h: 128
  },
  frostMonarchShield: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 896,
    y: 512,
    w: 128,
    h: 128
  },
  miner: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 896,
    y: 640,
    w: 128,
    h: 128
  },
  montra_axe: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 896,
    y: 768,
    w: 128,
    h: 128
  },
  montra_shield: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 0,
    y: 896,
    w: 128,
    h: 128
  },
  woodenSwordNFT: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 128,
    y: 896,
    w: 128,
    h: 128
  },
  yule: {
    atlasSrc: 'assets/images/wearables_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 256,
    y: 896,
    w: 128,
    h: 128
  }
}

export type WearableType = {
  name: string
  sprite: Sprite
}

export type BodyPart =
  | 'head'
  | 'body'
  | 'legs'
  | 'feet'
  | 'mainhand'
  | 'offhand'
  | 'extra'
  | 'crown'

export type Stats = {
  luckBuff?: number
  attackBuff?: number
  defBuff?: number
  health?: number
  distance?: number
  critRate?: number
  critDamage?: number
  magicBuff?: number
}

export type WearableItem = {
  label: string
  urn: string
  stats: Stats
  dStats?: Stats
  duplicates?: number
}

export const WEARABLES_MAPPING: Record<WearableString, WearableItem> = {
  DoubleHackets: {
    label: 'Double Hatchets',
    urn: 'urn:decentraland:matic:collections-v2:0xa5d8a8c3454aa003ad72c3f814e52ad6bea69e57:0',
    stats: {
      luckBuff: 3,
      attackBuff: 1400,
      critDamage: 30
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      attackBuff: 10
    }
  },
  RoyalSword: {
    label: 'Royal Sword',
    urn: 'urn:decentraland:matic:collections-v2:0x86bc8866c8902b2f7b88947c1b6e6ee2d6425a48:0',
    stats: {
      luckBuff: 5,
      attackBuff: 1500,
      defBuff: 0.03
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      luckBuff: 0.6,
      attackBuff: 8
    }
  },
  RoyalShield: {
    label: 'Royal Shield',
    urn: 'urn:decentraland:matic:collections-v2:0x86bc8866c8902b2f7b88947c1b6e6ee2d6425a48:1',
    stats: {
      health: 10000,
      magicBuff: 800,
      defBuff: 0.06
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      defBuff: 0.01,
      health: 100
    }
  },
  FrostMonarchShield: {
    label: 'Frost Monarch Shield',
    urn: 'urn:decentraland:matic:collections-v2:0x0897430acd7bfc81bdcf51e815db8f0f53c94878:0',
    stats: {
      health: 5500,
      magicBuff: 350,
      defBuff: 0.06
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      health: 55
    }
  },
  FrostMonarchHead: {
    label: 'Frost Monarch Head',
    urn: 'urn:decentraland:matic:collections-v2:0x0e9663c4b53ed79b343739b5bafab89666ee8ba3:0',
    stats: {
      health: 10000,
      attackBuff: 600,
      luckBuff: 6
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      health: 70,
      attackBuff: 7
    }
  },

  FrostMonarchBody: {
    label: 'Frost Monarch Body',
    urn: 'urn:decentraland:matic:collections-v2:0x0e9663c4b53ed79b343739b5bafab89666ee8ba3:1',
    stats: {
      health: 10000,
      attackBuff: 600,
      luckBuff: 6
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      health: 70,
      attackBuff: 7
    }
  },

  CoinAura: {
    label: 'Coin Aura',
    urn: 'urn:decentraland:matic:collections-v2:0x844a933934fba88434dfade0b04b1d211e92d7c4:0',
    stats: {
      luckBuff: 0,
      attackBuff: 0,
      defBuff: 0
    }
  },
  Lumberjack: {
    label: 'Lumberjack',
    urn: 'urn:decentraland:matic:collections-v2:0x844a933934fba88434dfade0b04b1d211e92d7c4:1',
    stats: {
      luckBuff: 0,
      attackBuff: 0,
      defBuff: 0
    }
  },
  Butcher: {
    label: 'Butcher',
    urn: 'urn:decentraland:matic:collections-v2:0x855ec57cc60c28187a021a3757a80ac4758e0b06:0',
    stats: {
      luckBuff: 0,
      attackBuff: 0,
      defBuff: 0
    }
  },
  Miner: {
    label: 'Miner',
    urn: 'urn:decentraland:matic:collections-v2:0xf0b49e0f1b6ac8d06808d9e7c5b5ef91700b1f7d:0',
    stats: {
      luckBuff: 0,
      attackBuff: 0,
      defBuff: 0
    }
  },

  MontraHelm: {
    label: 'Montra Helm',
    urn: 'urn:decentraland:matic:collections-v2:0x332c7801fd892d62156403b86e659ea3bc204dbc:0',
    stats: {
      attackBuff: 1800,
      defBuff: 0.2,
      critRate: 20,
      luckBuff: 6
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      attackBuff: 1800,
      defBuff: 0.2,
      critRate: 20,
      luckBuff: 6
    }
  },
  MontraArmor: {
    label: 'Montra Armor',
    urn: 'urn:decentraland:matic:collections-v2:0x332c7801fd892d62156403b86e659ea3bc204dbc:2',
    stats: {
      attackBuff: 2200,
      critRate: 10,
      health: 18000,
      defBuff: 0.05
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      attackBuff: 2200,
      critRate: 10,
      health: 18000,
      defBuff: 0.05
    }
  },
  MontraTrousers: {
    label: 'Montra Trousers',
    urn: 'urn:decentraland:matic:collections-v2:0x332c7801fd892d62156403b86e659ea3bc204dbc:1',
    stats: {
      luckBuff: 20,
      attackBuff: 2600,
      health: 16000,
      defBuff: 0.05
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      luckBuff: 20,
      attackBuff: 2600,
      health: 16000,
      defBuff: 0.05
    }
  },
  CandyCaneCover: {
    label: 'Candy Cane Cover',
    urn: 'urn:decentraland:matic:collections-v2:0x0d40513b35c8f4510615476c26187f511e6ec4c5:1',
    stats: {
      defBuff: 0.06,
      health: 30000,
      attackBuff: 1250,
      luckBuff: 25
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      defBuff: 0.06,
      health: 30000,
      attackBuff: 1250,
      luckBuff: 25
    }
  },
  RudolphRampage: {
    label: "Rudolph's Rampage",
    urn: 'urn:decentraland:matic:collections-v2:0x0d40513b35c8f4510615476c26187f511e6ec4c5:4',
    stats: {
      luckBuff: 10,
      defBuff: 0.02,
      health: 25000,
      attackBuff: 2200
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      luckBuff: 10,
      defBuff: 0.02,
      health: 25000,
      attackBuff: 2200
    }
  },
  YuleTideSlayer: {
    label: 'Yule Tide Slayer',
    urn: 'urn:decentraland:matic:collections-v2:0x0d40513b35c8f4510615476c26187f511e6ec4c5:0',
    stats: {
      attackBuff: 2500,
      luckBuff: 6,
      critRate: 20,
      health: 12000
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      attackBuff: 2500,
      luckBuff: 6,
      critRate: 20,
      health: 12000
    }
  },
  RoyalHelm: {
    label: 'Royal Helm',
    urn: 'urn:decentraland:matic:collections-v2:0x2c9bebf5ece6abc2060b7ee842b31d9cd7bb742b:0',
    stats: {
      luckBuff: 20,
      defBuff: 0.06,
      health: 21000,
      attackBuff: 2000
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      luckBuff: 20,
      defBuff: 0.06,
      health: 21000,
      attackBuff: 2000
    }
  },
  RoyalArmor: {
    label: 'Royal Armor',
    urn: 'urn:decentraland:matic:collections-v2:0x2c9bebf5ece6abc2060b7ee842b31d9cd7bb742b:2',
    stats: {
      luckBuff: 20,
      defBuff: 0.05,
      health: 22000,
      attackBuff: 400
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      luckBuff: 20,
      defBuff: 0.05,
      health: 22000,
      attackBuff: 400
    }
  },
  RoyalTrousers: {
    label: 'Royal Trousers',
    urn: 'urn:decentraland:matic:collections-v2:0x2c9bebf5ece6abc2060b7ee842b31d9cd7bb742b:1',
    stats: {
      attackBuff: 600,
      defBuff: 0.08,
      health: 14000,
      luckBuff: 20
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      attackBuff: 600,
      defBuff: 0.08,
      health: 14000,
      luckBuff: 20
    }
  },
  PromoWoodenSword: {
    label: 'Wooden Sword',
    urn: 'urn:decentraland:matic:collections-v2:0x6dfc2c7f137edd0218f5d8e5d47322c431a9fc3d:0',
    stats: {
      attackBuff: 40,
      critRate: 5
    },
    dStats: {
      attackBuff: 1
    }
    // onHas: () => {
    //     const DEF_BUFF = 0.05
    //     player.defBuff += DEF_BUFF
    // },
  },
  CoinCouture: {
    label: 'Coin Couture',
    urn: 'urn:decentraland:matic:collections-v2:0x8f69e4a278e3451b8a93b52cca27b25798658fc0:0',
    stats: {
      luckBuff: 0,
      attackBuff: 0,
      defBuff: 0
    }
  },

  MageRobe: {
    label: 'Apprentice Mage Robe',
    urn: 'urn:decentraland:matic:collections-v2:0x477d5780511ce18379056c3f4e6b4712a47d171c:0',
    stats: {
      health: 100,
      magicBuff: 30
    },
    dStats: {
      magicBuff: 1,
      health: 2
    }
  },
  BerserkerSuit: {
    label: 'Apprentice Berserker Garb',
    urn: 'urn:decentraland:matic:collections-v2:0xd81dcebc0769f1f055352f4588bbcc55e08d1c60:0',
    stats: {
      health: 100,
      attackBuff: 30
    },
    dStats: {
      health: 1,
      attackBuff: 1
    }
  },
  RangerSuit: {
    label: 'Apprentice Ranger Suit',
    urn: 'urn:decentraland:matic:collections-v2:0xc032771f2be2b5f31d62186e720f0f455d3aaa19:0',
    stats: {
      health: 100,
      critRate: 1
    },
    dStats: {
      health: 1,
      critRate: 0.05
    }
  },
  MageHat: {
    label: 'Apprentice Mage Hat',
    urn: 'urn:decentraland:matic:collections-v2:0x477d5780511ce18379056c3f4e6b4712a47d171c:1',
    stats: {
      luckBuff: 10,
      magicBuff: 30
    },
    dStats: {
      magicBuff: 1
    }
  },
  BerserkerHelmet: {
    label: 'Apprentice Berserker Helmet',
    urn: 'urn:decentraland:matic:collections-v2:0xd81dcebc0769f1f055352f4588bbcc55e08d1c60:1',
    stats: {
      luckBuff: 10,
      attackBuff: 30
    },
    dStats: {
      attackBuff: 1
    }
  },
  RangerHood: {
    label: 'Apprentice Ranger Hood',
    urn: 'urn:decentraland:matic:collections-v2:0xc032771f2be2b5f31d62186e720f0f455d3aaa19:1',
    stats: {
      luckBuff: 10,
      critRate: 1
    },
    dStats: {
      critRate: 0.05
    }
  },
  MageSceptre: {
    label: 'Apprentice Mage Sceptre',
    urn: 'urn:decentraland:matic:collections-v2:0x477d5780511ce18379056c3f4e6b4712a47d171c:2',
    stats: {
      magicBuff: 32,
      attackBuff: 30
    },
    dStats: {
      magicBuff: 1
    }
  },
  BerserkerAxe: {
    label: 'Apprentice Berserker Axe',
    urn: 'urn:decentraland:matic:collections-v2:0xd81dcebc0769f1f055352f4588bbcc55e08d1c60:2',
    stats: {
      attackBuff: 40,
      critDamage: 10
    },
    dStats: {
      attackBuff: 1
    }
  },
  RangerBow: {
    label: 'Apprentice Ranger Bow',
    urn: 'urn:decentraland:matic:collections-v2:0xc032771f2be2b5f31d62186e720f0f455d3aaa19:2',
    stats: {
      critRate: 1,
      attackBuff: 8
    },
    dStats: {
      critRate: 0.05
    }
  },

  MageRobe_level_1: {
    label: 'Crimson Mage Robe',
    urn: 'urn:decentraland:matic:collections-v2:0x561adea4961ca4ed6336a6a67a8e340b1c3350bc:0',
    stats: {
      health: 650,
      magicBuff: 130
    },
    dStats: {
      magicBuff: 3,
      health: 10
    }
  },
  BerserkerSuit_level_1: {
    label: 'Crimson Berserker Garb',
    urn: 'urn:decentraland:matic:collections-v2:0x5672e431800a9681efe14cedbc6581e57d297025:0',
    stats: {
      health: 400,
      attackBuff: 180
    },
    dStats: {
      health: 20,
      attackBuff: 3
    }
  },
  RangerSuit_level_1: {
    label: 'Crimson Ranger Suit',
    urn: 'urn:decentraland:matic:collections-v2:0x46c21f6d46e1a8854c7a305e214796121dd98b44:0',
    stats: {
      health: 550,
      critRate: 5
    },
    dStats: {
      health: 15,
      critRate: 0.07
    }
  },
  MageHat_level_1: {
    label: 'Crimson Mage Hat',
    urn: 'urn:decentraland:matic:collections-v2:0x561adea4961ca4ed6336a6a67a8e340b1c3350bc:1',
    stats: {
      luckBuff: 15,
      magicBuff: 150
    },
    dStats: {
      magicBuff: 3
    }
  },
  BerserkerHelmet_level_1: {
    label: 'Crimson Berserker Helmet',
    urn: 'urn:decentraland:matic:collections-v2:0x5672e431800a9681efe14cedbc6581e57d297025:2',
    stats: {
      luckBuff: 15,
      attackBuff: 200
    },
    dStats: {
      attackBuff: 3
    }
  },
  RangerHood_level_1: {
    label: 'Crimson Ranger Hood',
    urn: 'urn:decentraland:matic:collections-v2:0x46c21f6d46e1a8854c7a305e214796121dd98b44:1',
    stats: {
      luckBuff: 15,
      critRate: 5
    },
    dStats: {
      critRate: 0.07
    }
  },
  MageSceptre_level_1: {
    label: 'Crimson Mage Sceptre',
    urn: 'urn:decentraland:matic:collections-v2:0x561adea4961ca4ed6336a6a67a8e340b1c3350bc:2',
    stats: {
      magicBuff: 152,
      attackBuff: 60
    },
    dStats: {
      magicBuff: 3
    }
  },
  BerserkerAxe_level_1: {
    label: 'Crimson Berserker Axe',
    urn: 'urn:decentraland:matic:collections-v2:0x5672e431800a9681efe14cedbc6581e57d297025:1',
    stats: {
      attackBuff: 190,
      critDamage: 15
    },
    dStats: {
      attackBuff: 3
    }
  },
  RangerBow_level_1: {
    label: 'Crimson Ranger Bow',
    urn: 'urn:decentraland:matic:collections-v2:0x46c21f6d46e1a8854c7a305e214796121dd98b44:2',
    stats: {
      critRate: 4,
      attackBuff: 20
    },
    dStats: {
      critRate: 0.05,
      attackBuff: 2
    }
  },

  MageRobe_level_2: {
    label: 'Emerald Mage Robe',
    urn: 'urn:decentraland:matic:collections-v2:0x13a330af04443f302f3da36dbe10e5c4be5b216c:0',
    stats: {
      health: 7500,
      magicBuff: 430
    },
    dStats: {
      magicBuff: 5,
      health: 30
    }
  },
  BerserkerSuit_level_2: {
    label: 'Emerald Berserker Garb',
    urn: 'urn:decentraland:matic:collections-v2:0x8ba28b533378a384ade9b497511fcecfcfa1449e:0',
    stats: {
      health: 4000,
      attackBuff: 500
    },
    dStats: {
      health: 40,
      attackBuff: 6
    }
  },
  RangerSuit_level_2: {
    label: 'Emerald Ranger Suit',
    urn: 'urn:decentraland:matic:collections-v2:0xc5f4fdb0aa66250490b1e0aa2a8ae3a3e27070a2:0',
    stats: {
      health: 6000,
      critRate: 7
    },
    dStats: {
      health: 60,
      critRate: 0.08
    }
  },
  MageHat_level_2: {
    label: 'Emerald Mage Hat',
    urn: 'urn:decentraland:matic:collections-v2:0x13a330af04443f302f3da36dbe10e5c4be5b216c:1',
    stats: {
      luckBuff: 20,
      magicBuff: 450
    },
    dStats: {
      magicBuff: 6
    }
  },
  BerserkerHelmet_level_2: {
    label: 'Emerald Berserker Helmet',
    urn: 'urn:decentraland:matic:collections-v2:0x8ba28b533378a384ade9b497511fcecfcfa1449e:1',
    stats: {
      luckBuff: 20,
      attackBuff: 560
    },
    dStats: {
      attackBuff: 6
    }
  },
  RangerHood_level_2: {
    label: 'Emerald Ranger Hood',
    urn: 'urn:decentraland:matic:collections-v2:0xc5f4fdb0aa66250490b1e0aa2a8ae3a3e27070a2:1',
    stats: {
      luckBuff: 20,
      critRate: 15
    },
    dStats: {
      critRate: 0.08
    }
  },
  MageSceptre_level_2: {
    label: 'Emerald Mage Sceptre',
    urn: 'urn:decentraland:matic:collections-v2:0x13a330af04443f302f3da36dbe10e5c4be5b216c:2',
    stats: {
      magicBuff: 510,
      attackBuff: 120
    },
    dStats: {
      magicBuff: 6
    }
  },
  BerserkerAxe_level_2: {
    label: 'Emerald Berserker Axe',
    urn: 'urn:decentraland:matic:collections-v2:0x8ba28b533378a384ade9b497511fcecfcfa1449e:2',
    stats: {
      attackBuff: 580,
      critDamage: 25
    },
    dStats: {
      attackBuff: 5
    }
  },
  RangerBow_level_2: {
    label: 'Emerald Ranger Bow',
    urn: 'urn:decentraland:matic:collections-v2:0xc5f4fdb0aa66250490b1e0aa2a8ae3a3e27070a2:2',
    stats: {
      critRate: 9,
      attackBuff: 250
    },
    dStats: {
      critRate: 0.08,
      attackBuff: 5
    }
  },

  MageRobe_level_3: {
    label: 'Celestial Mage Robe',
    urn: 'urn:decentraland:matic:collections-v2:0xb8527c3c244b9bafeee8bd4048d1b297975db691:2',
    stats: {
      health: 11000,
      magicBuff: 1015,
      defBuff: 0.05
    },
    dStats: {
      magicBuff: 10,
      health: 100
    }
  },
  BerserkerSuit_level_3: {
    label: 'Celestial Berserker Garb',
    urn: 'urn:decentraland:matic:collections-v2:0x2929bbb4f18b40ac52a7f0b91629c695e3f96504:0',
    stats: {
      health: 8000,
      attackBuff: 1250,
      critRate: 10
    },
    dStats: {
      health: 70,
      attackBuff: 10
    }
  },
  RangerSuit_level_3: {
    label: 'Celestial Ranger Suit',
    urn: 'urn:decentraland:matic:collections-v2:0x66481caf6ff840491660617e3aecfd40ab59e49f:0',
    stats: {
      health: 14000,
      critRate: 17,
      magicBuff: 200
    },
    dStats: {
      health: 80,
      critRate: 0.09
    }
  },
  MageHat_level_3: {
    label: 'Celestial Mage Hat',
    urn: 'urn:decentraland:matic:collections-v2:0xb8527c3c244b9bafeee8bd4048d1b297975db691:1',
    stats: {
      luckBuff: 25,
      magicBuff: 1100,
      attackBuff: 500
    },
    dStats: {
      magicBuff: 10,
      defBuff: 0.05
    }
  },
  BerserkerHelmet_level_3: {
    label: 'Celestial Berserker Helmet',
    urn: 'urn:decentraland:matic:collections-v2:0x2929bbb4f18b40ac52a7f0b91629c695e3f96504:1',
    stats: {
      luckBuff: 30,
      attackBuff: 1380,
      defBuff: 0.04
    },
    dStats: {
      attackBuff: 9,
      luckBuff: 0.02
    }
  },
  RangerHood_level_3: {
    label: 'Celestial Ranger Hood',
    urn: 'urn:decentraland:matic:collections-v2:0x66481caf6ff840491660617e3aecfd40ab59e49f:2',
    stats: {
      luckBuff: 30,
      critRate: 23,
      critDamage: 20
    },
    dStats: {
      critRate: 0.09,
      critDamage: 1
    }
  },
  MageSceptre_level_3: {
    label: 'Celestial Mage Sceptre',
    urn: 'urn:decentraland:matic:collections-v2:0xb8527c3c244b9bafeee8bd4048d1b297975db691:0',
    stats: {
      magicBuff: 1330,
      attackBuff: 300,
      health: 3000
    },
    dStats: {
      health: 100,
      magicBuff: 8
    }
  },
  BerserkerAxe_level_3: {
    label: 'Celestial Berserker Axe',
    urn: 'urn:decentraland:matic:collections-v2:0x2929bbb4f18b40ac52a7f0b91629c695e3f96504:2',
    stats: {
      attackBuff: 1200,
      critDamage: 25,
      critRate: 20
    },
    dStats: {
      attackBuff: 9,
      critRate: 0.07
    }
  },
  RangerBow_level_3: {
    label: 'Celestial Ranger Bow',
    urn: 'urn:decentraland:matic:collections-v2:0x66481caf6ff840491660617e3aecfd40ab59e49f:2',
    stats: {
      critRate: 20,
      attackBuff: 700,
      critDamage: 30
    },
    dStats: {
      critRate: 0.08,
      attackBuff: 8
    }
  },

  MagicBow: {
    label: 'Magic Bow',
    urn: 'urn:decentraland:matic:collections-v2:0x574a529da5eb7d5877f54e47a88b9bd55de8881c:0',
    stats: {
      magicBuff: 80,
      health: 50,
      distance: 7
    },
    dStats: {
      magicBuff: 2,
      health: 5
    }
  },
  MagicSword: {
    label: 'Magic Sword',
    urn: 'urn:decentraland:matic:collections-v2:0x574a529da5eb7d5877f54e47a88b9bd55de8881c:1',
    stats: {
      magicBuff: 80,
      defBuff: 0.04
    },
    dStats: {
      magicBuff: 2,
      defBuff: 0.01
    }
  },
  MagicAxe: {
    label: 'Magic Axe',
    urn: 'urn:decentraland:matic:collections-v2:0x574a529da5eb7d5877f54e47a88b9bd55de8881c:2',
    stats: {
      critRate: 5,
      magicBuff: 80
    },
    dStats: {
      magicBuff: 2,
      critRate: 0.05
    }
  },
  FireBow: {
    label: 'Flame Bow',
    urn: 'urn:decentraland:matic:collections-v2:0x3b8f5b62ddd10c1af0f31665c5ab09b2bf85cacc:2',
    stats: {
      attackBuff: 120,
      health: 50,
      distance: 7
    },
    dStats: {
      attackBuff: 3,
      health: 1
    }
  },
  FireSword: {
    label: 'Flame Sword',
    urn: 'urn:decentraland:matic:collections-v2:0x3b8f5b62ddd10c1af0f31665c5ab09b2bf85cacc:0',
    stats: {
      attackBuff: 160,
      defBuff: 0.02
    },
    dStats: {
      attackBuff: 2,
      defBuff: 0.01
    }
  },
  FireAxe: {
    label: 'Flame Axe',
    urn: 'urn:decentraland:matic:collections-v2:0x3b8f5b62ddd10c1af0f31665c5ab09b2bf85cacc:1',
    stats: {
      attackBuff: 200,
      critRate: 5
    },
    dStats: {
      attackBuff: 1,
      critRate: 0.05
    }
  },
  ErosHead: {
    label: 'Eros Head',
    urn: 'urn:decentraland:matic:collections-v2:0x3da9e56ce30dc83f6415ce35acdcc71c236e1829:1',
    stats: {
      defBuff: 0.1,
      critRate: 25,
      health: 14000
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      defBuff: 0.03,
      critRate: 0.07,
      health: 100
    }
  },
  ErosBody: {
    label: 'Eros Body',
    urn: 'urn:decentraland:matic:collections-v2:0x3da9e56ce30dc83f6415ce35acdcc71c236e1829:0',
    stats: {
      defBuff: 0.1,
      critRate: 25,
      health: 14000
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      defBuff: 0.03,
      critRate: 0.07,
      health: 100
    }
  },
  ErosBow: {
    label: 'Eros Bow',
    urn: 'urn:decentraland:matic:collections-v2:0x3da9e56ce30dc83f6415ce35acdcc71c236e1829:2',
    stats: {
      luckBuff: 5,
      critRate: 13,
      attackBuff: 1250,
      distance: 10
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      luckBuff: 1,
      critRate: 0.09,
      attackBuff: 40
    }
  },
  VikingUB1: {
    label: 'Fenris Quilt',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:10',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingUB2: {
    label: 'Fenris Quilt',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:11',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingUB3: {
    label: 'Fenris Quilt',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:12',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingUB4: {
    label: 'Fenris Quilt',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:13',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingUB5: {
    label: 'Fenris Quilt',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:14',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingLB1: {
    label: 'Rune Garments',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:15',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingLB2: {
    label: 'Rune Garments',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:16',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingLB3: {
    label: 'Rune Garments',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:17',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingLB4: {
    label: 'Rune Garments',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:18',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingLB5: {
    label: 'Rune Garments',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:19',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingHelm1: {
    label: 'Berserker Helmet',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:5',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingHelm2: {
    label: 'Berserker Helmet',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:6',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingHelm3: {
    label: 'Berserker Helmet',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:7',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingHelm4: {
    label: 'Berserker Helmet',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:8',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingHelm5: {
    label: 'Berserker Helmet',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:9',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingHelmTopHead1: {
    label: 'Mjolnir',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:0',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingHelmTopHead2: {
    label: 'Mjolnir',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:1',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingHelmTopHead3: {
    label: 'Mjolnir',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:2',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingHelmTopHead4: {
    label: 'Mjolnir',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:3',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingHelmTopHead5: {
    label: 'Mjolnir',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:4',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingFeet1: {
    label: 'Raven Boots',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:20',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingFeet2: {
    label: 'Raven Boots',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:21',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingFeet3: {
    label: 'Raven Boots',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:22',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingFeet4: {
    label: 'Raven Boots',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:23',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  VikingFeet5: {
    label: 'Raven Boots',
    urn: 'urn:decentraland:matic:collections-v2:0x62340bf727c536400a15bd41f62b4c684232c57a:24',
    stats: {
      luckBuff: 0,
      attackBuff: 2,
      defBuff: 0
    }
  },
  ICEScepter: {
    label: 'High Roller Scepter',
    urn: 'urn:decentraland:matic:collections-v2:0x4557a56a6f2e7a7920cbb79dedf98b9fef05e713:0',
    stats: {
      luckBuff: 0,
      attackBuff: 3,
      defBuff: 0.01
    }
  },
  ICECrown: {
    label: 'High Roller Crown',
    urn: 'urn:decentraland:matic:collections-v2:0x08247a63a38c52bf5612ebf6fada5bb8f494e8b8:0',
    stats: {
      luckBuff: 2,
      attackBuff: 0,
      defBuff: 0.01
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      luckBuff: 1,
      defBuff: 0.01
    }
  },
  MontraAxe: {
    label: 'Legacy Souls',
    urn: 'urn:decentraland:matic:collections-v2:0xf795818dba5721ef903ad9a610077ff870ac318c:0',
    stats: {
      attackBuff: 1280,
      critRate: 19
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      attackBuff: 8,
      critRate: 0.06
    }
  },
  MontraShield: {
    label: 'Montra Shield',
    urn: 'urn:decentraland:matic:collections-v2:0xb055cc2916bf8857ad1ae19b0c8a4d128180c4a9:0',
    stats: {
      attackBuff: 430,
      critRate: 5
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      attackBuff: 5,
      critRate: 0.04
    }
  },
  CarnageBlade: {
    label: 'Carnage Blade',
    urn: 'urn:decentraland:matic:collections-v2:0x2b5e68e51dd54fe100150a6f52547f4f0b3d32aa:6',
    stats: {
      attackBuff: 50,
      health: 100,
      critDamage: 15
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      attackBuff: 1,
      health: 1
    }
  },
  EnigmaStaff: {
    label: 'Druid Staff',
    urn: 'urn:decentraland:matic:collections-v2:0x2b5e68e51dd54fe100150a6f52547f4f0b3d32aa:5',
    stats: {
      magicBuff: 550,
      health: 300,
      luckBuff: 10
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      magicBuff: 4,
      health: 4
    }
  },
  DeathwhisperDagger: {
    label: 'Deathwhisper Daggers',
    urn: 'urn:decentraland:matic:collections-v2:0x2b5e68e51dd54fe100150a6f52547f4f0b3d32aa:4',
    stats: {
      critDamage: 35,
      health: 100,
      defBuff: 0.08
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      health: 1,
      critDamage: 1
    }
  },
  NightmareBow: {
    label: 'Nightmare Bow',
    urn: 'urn:decentraland:matic:collections-v2:0x2b5e68e51dd54fe100150a6f52547f4f0b3d32aa:3',
    stats: {
      critDamage: 15,
      health: 200,
      critRate: 6
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      critRate: 0.07,
      health: 2
    }
  },
  RoyalMageStaff: {
    label: 'Royal Mage Staff',
    urn: 'urn:decentraland:matic:collections-v2:0xd48a73c9bb4ccd57b7e31f9695c4237df6e246d5:1',
    stats: {
      luckBuff: 10,
      magicBuff: 3000,
      defBuff: 0.08,
      critDamage: 50
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      luckBuff: 10,
      magicBuff: 3000,
      defBuff: 0.08,
      critDamage: 50
    }
  },
  LeatherBoots: {
    label: 'Leather Boots',
    urn: 'urn:decentraland:matic:collections-v2:0x2b5e68e51dd54fe100150a6f52547f4f0b3d32aa:1',
    stats: {
      luckBuff: 4,
      critDamage: 20,
      defBuff: 0.03
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      defBuff: 0.03
    }
  },
  RoyalMageBoots: {
    label: 'Royal Mage Boots',
    urn: 'urn:decentraland:matic:collections-v2:0x2b5e68e51dd54fe100150a6f52547f4f0b3d32aa:2',
    stats: {
      luckBuff: 10,
      magicBuff: 2100,
      defBuff: 0.08,
      critDamage: 50
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      luckBuff: 10,
      magicBuff: 2100,
      defBuff: 0.08,
      critDamage: 50
    }
  },
  RoyalMageRobe: {
    label: 'Royal Mage Robe',
    urn: 'urn:decentraland:matic:collections-v2:0xd48a73c9bb4ccd57b7e31f9695c4237df6e246d5:0',
    stats: {
      luckBuff: 15,
      magicBuff: 2500,
      defBuff: 0.1,
      critRate: 29
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      luckBuff: 15,
      magicBuff: 2500,
      defBuff: 0.1,
      critRate: 15
    }
  },
  BronzeCrown: {
    label: 'Bronze Crown',
    urn: 'urn:decentraland:matic:collections-v2:0x7d65d7ca3d44814c697aea3a1db45da330546e7b:0',
    stats: {
      attackBuff: 1200,
      critRate: 3,
      defBuff: 0.03
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      attackBuff: 7
    }
  },
  CrystalCrown: {
    label: 'Crystal Crown',
    urn: 'urn:decentraland:matic:collections-v2:0x7d65d7ca3d44814c697aea3a1db45da330546e7b:1',
    stats: {
      attackBuff: 2400,
      health: 18000,
      defBuff: 0.03,
      critDamage: 30
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      attackBuff: 2400,
      health: 18000,
      defBuff: 0.03,
      critDamage: 30
    }
  },
  CallanCrown: {
    label: 'Callan Crown',
    urn: 'urn:decentraland:matic:collections-v2:0x7d65d7ca3d44814c697aea3a1db45da330546e7b:2',
    stats: {
      attackBuff: 3000,
      luckBuff: 21,
      defBuff: 0.03,
      health: 30000,
      critDamage: 21,
      magicBuff: 3000,
      critRate: 9
    }
  },

  RoyalMageCloak: {
    label: 'Royal Mage Cloak',
    urn: 'urn:decentraland:matic:collections-v2:0x2b5e68e51dd54fe100150a6f52547f4f0b3d32aa:0',
    stats: {
      luckBuff: 12,
      magicBuff: 1900,
      defBuff: 0.06,
      critDamage: 20
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      luckBuff: 12,
      magicBuff: 1900,
      defBuff: 0.06,
      critDamage: 20
    }
  },
  GodricsRevenge: {
    label: 'Godrics Revenge',
    urn: 'urn:decentraland:matic:collections-v2:0x34f266ed68b877dd98ee2697f09bc0481be828bd:0',
    stats: {
      attackBuff: 1000,
      health: 12900,
      critDamage: 15
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      health: 90,
      critDamage: 1
    }
  },
  BugHunters: {
    label: 'Bug Hunters',
    urn: 'urn:decentraland:matic:collections-v2:0x9969d983e993941c95a44e045f7fd9849a6023fd:0',
    stats: {
      health: 13000,
      critRate: 23,
      defBuff: 0.05
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      health: 70
    }
  },
  IceSword: {
    label: 'Ice Sword',
    urn: 'urn:decentraland:matic:collections-v2:0xa3927ce9f272d56c423e15020202f5461dc5f07b:2',
    stats: {
      attackBuff: 100,
      critRate: 5
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      attackBuff: 2
    }
  },
  FlightByKnight: {
    label: 'Flight By Knight',
    urn: 'urn:decentraland:matic:collections-v2:0xc310120b36d9ecdca1e318497254e204cd21c70f:0',
    stats: {
      attackBuff: 100,
      critRate: 5,
      health: 600
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      health: 5
    }
  },
  OligarHalberd: {
    label: 'Hell Halberd',
    urn: 'urn:decentraland:matic:collections-v2:0x55217e2c99d0deb540dbf142df90bace4bedb2ee:0',
    stats: {
      magicBuff: 2600,
      critRate: 6,
      health: 15000,
      critDamage: 60
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      magicBuff: 2600,
      critRate: 6,
      health: 15000,
      critDamage: 60
    }
  },
  ButchersMask: {
    label: 'Butchers Mask',
    urn: 'urn:decentraland:matic:collections-v2:0xf3df68b5748f1955f68b4fefda3f65b2e0250325:0',
    stats: {
      luckBuff: 7,
      health: 400
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      luckBuff: 1
    }
  },
  Legionnaire: {
    label: 'Pinnacle of Echoes',
    urn: 'urn:decentraland:matic:collections-v2:0x0367d0e78505732d531b5e2755ae751167a05263:0',
    stats: {
      luckBuff: 15,
      attackBuff: 4000,
      critRate: 20,
      health: -4000
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      luckBuff: 15,
      attackBuff: 4000,
      critRate: 20,
      health: -4000
    }
  },
  Lute: {
    label: 'Lute of Antrom',
    urn: 'urn:decentraland:matic:collections-v2:0x2ff26b63653c4d390472a0b263822965ce923f0d:0',
    stats: {
      defBuff: 0.01,
      magicBuff: 300
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      defBuff: 0.001
    }
  },
  // Wasteland Collection
  WastelandArmor: {
    label: 'Wasteland Armor',
    urn: 'urn:decentraland:matic:collections-v2:0xa83c8951dd73843bf5f7e9936e72a345a3e79874:0',
    stats: {
      health: 600,
      magicBuff: 420
    },
    dStats: {
      magicBuff: 8
    }
  },
  WastelandHelm: {
    label: 'Wasteland Helmet',
    urn: 'urn:decentraland:matic:collections-v2:0xa83c8951dd73843bf5f7e9936e72a345a3e79874:2',
    stats: {
      health: 600,
      defBuff: 0.01
    },
    dStats: {
      defBuff: 0.001
    }
  },
  WastelandPants: {
    label: 'Wasteland Pants',
    urn: 'urn:decentraland:matic:collections-v2:0xa83c8951dd73843bf5f7e9936e72a345a3e79874:1',
    stats: {
      health: 600,
      luckBuff: 3
    },
    dStats: {
      health: 10
    }
  },
  WastelandMageArmor: {
    label: 'Wasteland Mage Armor',
    urn: 'urn:decentraland:matic:collections-v2:0xa83c8951dd73843bf5f7e9936e72a345a3e79874:3',
    stats: {
      health: 1400,
      magicBuff: 500,
      defBuff: 0.05
    },
    dStats: {
      magicBuff: 20,
      health: 100
    }
  },
  WastelandMageHelm: {
    label: 'Wasteland Mage Helmet',
    urn: 'urn:decentraland:matic:collections-v2:0xa83c8951dd73843bf5f7e9936e72a345a3e79874:5',
    stats: {
      health: 1400,
      magicBuff: 500,
      defBuff: 0.05
    },
    dStats: {
      magicBuff: 20,
      health: 100
    }
  },
  WastelandMagePants: {
    label: 'Wasteland Mage Pants',
    urn: 'urn:decentraland:matic:collections-v2:0xa83c8951dd73843bf5f7e9936e72a345a3e79874:4',
    stats: {
      health: 1400,
      magicBuff: 500,
      defBuff: 0.05
    },
    dStats: {
      magicBuff: 20,
      health: 100
    }
  },
  WastelandApexArmor: {
    label: 'Wasteland Apex Armor',
    urn: 'urn:decentraland:matic:collections-v2:0xa83c8951dd73843bf5f7e9936e72a345a3e79874:8',
    stats: {
      health: 14000,
      magicBuff: 1200,
      defBuff: 0.06
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      defBuff: 0.01,
      health: 100
    }
  },
  WastelandApexHelm: {
    label: 'Wasteland Apex Helmet',
    urn: 'urn:decentraland:matic:collections-v2:0xa83c8951dd73843bf5f7e9936e72a345a3e79874:6',
    stats: {
      health: 14000,
      magicBuff: 1200,
      defBuff: 0.06
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      defBuff: 0.01,
      health: 100
    }
  },
  WastelandApexPants: {
    label: 'Wasteland Apex Pants',
    urn: 'urn:decentraland:matic:collections-v2:0xa83c8951dd73843bf5f7e9936e72a345a3e79874:7',
    stats: {
      health: 14000,
      magicBuff: 1200,
      defBuff: 0.06
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      defBuff: 0.01,
      health: 100
    }
  },
  // WastelandApexSet: {
  //     label: "Wasteland Apex Set",
  //     urn:
  //         "urn:decentraland:matic:collections-v2:0xa83c8951dd73843bf5f7e9936e72a345a3e79874:7" &&
  //         "urn:decentraland:matic:collections-v2:0xa83c8951dd73843bf5f7e9936e72a345a3e79874:6" &&
  //         "urn:decentraland:matic:collections-v2:0xa83c8951dd73843bf5f7e9936e72a345a3e79874:8",
  //     stats: {
  //         health: 5000,
  //         magicBuff: 1200,
  //         defBuff: 0.06,
  //     },
  // },
  WastelandMonarchHelm: {
    label: 'Wasteland Monarch Helmet',
    urn: 'urn:decentraland:matic:collections-v2:0xf8a87150ca602dbeb2e748ad7c9c790d55d10528:0',
    stats: {
      attackBuff: 700,
      critDamage: 20,
      health: 35000,
      magicBuff: 1300
    },
    dStats: {
      attackBuff: 700,
      critDamage: 20,
      health: 35000,
      magicBuff: 1300
    }
  },
  WastelandMonarchUpper: {
    label: 'Wasteland Monarch Armor',
    urn: 'urn:decentraland:matic:collections-v2:0xf8a87150ca602dbeb2e748ad7c9c790d55d10528:2',
    stats: {
      luckBuff: 10,
      critDamage: 20,
      health: 35000,
      magicBuff: 800
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      luckBuff: 10,
      critDamage: 20,
      health: 35000,
      magicBuff: 800
    }
  },
  WastelandMonarchLower: {
    label: 'Wasteland Monarch Pants',
    urn: 'urn:decentraland:matic:collections-v2:0xf8a87150ca602dbeb2e748ad7c9c790d55d10528:1',
    stats: {
      defBuff: 0.06,
      critDamage: 20,
      health: 35000,
      magicBuff: 600
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      defBuff: 0.06,
      critDamage: 20,
      health: 35000,
      magicBuff: 600
    }
  },
  ScalyGloves: {
    label: 'Scaly Gauntlets',
    urn: 'urn:decentraland:matic:collections-v2:0x89dd5ee70e4fa4400b02bac1145f5260bb827a24:0',
    stats: {
      attackBuff: 3200,
      critRate: 25,
      luckBuff: 12,
      health: 7000
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      attackBuff: 6400,
      critRate: 25,
      luckBuff: 12,
      health: 14000
    }
  },
  LavaGloves: {
    label: 'Lava Gauntlets',
    urn: 'urn:decentraland:matic:collections-v2:0x6e78e8aacddbf96296dbcc9a1cb682a4b16b60de:1',
    stats: {
      attackBuff: 1200,
      health: 1200,
      critRate: 20
    },
    dStats: {
      attackBuff: 32
      // health: 100,
    }
  },
  WastelandWrathblade: {
    label: 'Wasteland Wrathblade',
    urn: 'urn:decentraland:matic:collections-v2:0x0538e98fa989a273ec42ce43d29ae729d0b7c6fc:0',
    stats: {
      attackBuff: 2000,
      luckBuff: 6,
      health: 14000,
      critDamage: 10
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      attackBuff: 3500,
      luckBuff: 3,
      health: 20000,
      critDamage: 15
    }
  },
  WastelandMonarchSet: {
    label: 'Wasteland Monarch Set',
    urn: 'urn:decentraland:matic:collections-v2:0xf8a87150ca602dbeb2e748ad7c9c790d55d10528:0',
    // && TODO
    // 'urn:decentraland:matic:collections-v2:0xf8a87150ca602dbeb2e748ad7c9c790d55d10528:1' &&
    // 'urn:decentraland:matic:collections-v2:0xf8a87150ca602dbeb2e748ad7c9c790d55d10528:2',
    stats: {
      health: 10000,
      attackBuff: 1000,
      magicBuff: 1000
    }
  },
  RoyalGauntlets: {
    label: 'Royal Gauntlets',
    urn: 'urn:decentraland:matic:collections-v2:0x6e78e8aacddbf96296dbcc9a1cb682a4b16b60de:2',
    stats: {
      luckBuff: 4,
      health: 10000
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      luckBuff: 2
    }
  },
  WastelandCape: {
    label: 'Wasteland Cape',
    urn: 'urn:decentraland:matic:collections-v2:0x6e78e8aacddbf96296dbcc9a1cb682a4b16b60de:0',
    stats: {
      health: 7000,
      defBuff: 0.06
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      defBuff: 0.02
    }
  },
  MontraDeathGlare: {
    label: 'Montra Death Glare',
    urn: 'urn:decentraland:matic:collections-v2:0x6e78e8aacddbf96296dbcc9a1cb682a4b16b60de:3',
    stats: {
      health: 12000,
      attackBuff: 1400
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      attackBuff: 50
    }
  },
  CitadelGauntlets: {
    label: 'Citadel Gauntlets',
    urn: 'urn:decentraland:matic:collections-v2:0xddc05f2ca687ae48d4efc013b41f21284605327e:0',
    stats: {
      luckBuff: 6,
      health: 12000,
      critDamage: 40
    },
    dStats: {
      // Duplicate stats example, this is multiplied by the number of duplicates
      luckBuff: 4
    }
  }
}

export type WearableString =
  | 'DoubleHackets'
  | 'RoyalSword'
  | 'RoyalShield'
  | 'FrostMonarchShield'
  | 'FrostMonarchHead'
  | 'FrostMonarchBody'
  | 'CoinAura'
  | 'Lumberjack'
  | 'Butcher'
  | 'Miner'
  | 'MontraHelm'
  | 'MontraArmor'
  | 'MontraTrousers'
  | 'CandyCaneCover'
  | 'RudolphRampage'
  | 'YuleTideSlayer'
  | 'RoyalHelm'
  | 'RoyalArmor'
  | 'RoyalTrousers'
  | 'PromoWoodenSword'
  | 'CoinCouture'
  | 'MageRobe'
  | 'BerserkerSuit'
  | 'RangerSuit'
  | 'MageHat'
  | 'BerserkerHelmet'
  | 'RangerHood'
  | 'MageSceptre'
  | 'BerserkerAxe'
  | 'RangerBow'
  | 'MageRobe_level_1'
  | 'BerserkerSuit_level_1'
  | 'RangerSuit_level_1'
  | 'MageHat_level_1'
  | 'BerserkerHelmet_level_1'
  | 'RangerHood_level_1'
  | 'MageSceptre_level_1'
  | 'BerserkerAxe_level_1'
  | 'RangerBow_level_1'
  | 'MageRobe_level_2'
  | 'BerserkerSuit_level_2'
  | 'RangerSuit_level_2'
  | 'MageHat_level_2'
  | 'BerserkerHelmet_level_2'
  | 'RangerHood_level_2'
  | 'MageSceptre_level_2'
  | 'BerserkerAxe_level_2'
  | 'RangerBow_level_2'
  | 'MageRobe_level_3'
  | 'BerserkerSuit_level_3'
  | 'RangerSuit_level_3'
  | 'MageHat_level_3'
  | 'BerserkerHelmet_level_3'
  | 'RangerHood_level_3'
  | 'MageSceptre_level_3'
  | 'BerserkerAxe_level_3'
  | 'RangerBow_level_3'
  | 'MagicBow'
  | 'MagicSword'
  | 'MagicAxe'
  | 'FireBow'
  | 'FireSword'
  | 'FireAxe'
  | 'ErosHead'
  | 'ErosBody'
  | 'ErosBow'
  | 'VikingUB1'
  | 'VikingUB2'
  | 'VikingUB3'
  | 'VikingUB4'
  | 'VikingUB5'
  | 'VikingLB1'
  | 'VikingLB2'
  | 'VikingLB3'
  | 'VikingLB4'
  | 'VikingLB5'
  | 'VikingHelm1'
  | 'VikingHelm2'
  | 'VikingHelm3'
  | 'VikingHelm4'
  | 'VikingHelm5'
  | 'VikingHelmTopHead1'
  | 'VikingHelmTopHead2'
  | 'VikingHelmTopHead3'
  | 'VikingHelmTopHead4'
  | 'VikingHelmTopHead5'
  | 'VikingFeet1'
  | 'VikingFeet2'
  | 'VikingFeet3'
  | 'VikingFeet4'
  | 'VikingFeet5'
  | 'ICEScepter'
  | 'ICECrown'
  | 'MontraAxe'
  | 'MontraShield'
  | 'CarnageBlade'
  | 'EnigmaStaff'
  | 'DeathwhisperDagger'
  | 'NightmareBow'
  | 'RoyalMageStaff'
  | 'LeatherBoots'
  | 'RoyalMageBoots'
  | 'RoyalMageRobe'
  | 'BronzeCrown'
  | 'CrystalCrown'
  | 'CallanCrown'
  | 'RoyalMageCloak'
  | 'GodricsRevenge'
  | 'BugHunters'
  | 'IceSword'
  | 'FlightByKnight'
  | 'OligarHalberd'
  | 'ButchersMask'
  | 'Legionnaire'
  | 'Lute'
  | 'WastelandArmor'
  | 'WastelandHelm'
  | 'WastelandPants'
  | 'WastelandMageArmor'
  | 'WastelandMageHelm'
  | 'WastelandMagePants'
  | 'WastelandApexArmor'
  | 'WastelandApexHelm'
  | 'WastelandApexPants'
  | 'WastelandMonarchHelm'
  | 'WastelandMonarchUpper'
  | 'WastelandMonarchLower'
  | 'ScalyGloves'
  | 'LavaGloves'
  | 'WastelandWrathblade'
  | 'WastelandMonarchSet'
  | 'RoyalGauntlets'
  | 'WastelandCape'
  | 'MontraDeathGlare'
  | 'CitadelGauntlets'
