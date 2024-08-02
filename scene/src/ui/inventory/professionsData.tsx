import { LEVEL_TYPES } from '../../player/LevelManager'
import { type Sprite } from '../../utils/ui-utils'

const ATLAS_SRC = 'assets/images/professions_spritesheet.png'
const ATLAS_SIZE = { x: 2166, y: 1656 }

export const professionsPageSprites = {
  xp_gem_100: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 0,
    y: 0,
    w: 40,
    h: 40
  },

  xp_gem_25: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 40,
    y: 0,
    w: 40,
    h: 40
  },

  xp_gem_50: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 80,
    y: 0,
    w: 40,
    h: 40
  },

  TBDWearableIcon: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 120,
    y: 0,
    w: 300,
    h: 300
  },

  assassinProfFrame: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 420,
    y: 0,
    w: 289,
    h: 350
  },

  blankProfessionFrame: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 0,
    y: 350,
    w: 1877,
    h: 956
  },

  butcherUnowned: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 709,
    y: 0,
    w: 300,
    h: 300
  },

  butcherWearableIcon: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 1009,
    y: 0,
    w: 300,
    h: 300
  },

  butcherProfFrame: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 1309,
    y: 0,
    w: 289,
    h: 350
  },

  gemcutterProfFrame: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 0,
    y: 1306,
    w: 289,
    h: 350
  },

  leftArrowReg: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 1598,
    y: 0,
    w: 64,
    h: 64
  },

  leftArrowUnavail: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 1662,
    y: 0,
    w: 64,
    h: 64
  },

  leftArrowWhileClicked: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 1726,
    y: 0,
    w: 64,
    h: 64
  },

  lumberjackUnowned: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 289,
    y: 1306,
    w: 300,
    h: 300
  },

  lumberjackWearableIcon: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 589,
    y: 1306,
    w: 300,
    h: 300
  },

  lumberjackProfFrame: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 889,
    y: 1306,
    w: 289,
    h: 350
  },

  minerUnowned: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 1178,
    y: 1306,
    w: 300,
    h: 300
  },

  minerWearableIcon: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 1478,
    y: 1306,
    w: 300,
    h: 300
  },

  minerProfFrame: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 1790,
    y: 0,
    w: 289,
    h: 350
  },

  professorProfFrame: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 1877,
    y: 350,
    w: 289,
    h: 350
  },

  rightArrowBtnUnavail: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 2079,
    y: 0,
    w: 64,
    h: 64
  },

  rightArrowReg: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 0,
    y: 64,
    w: 64,
    h: 64
  },

  rightArrowWhileClicked: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 1598,
    y: 64,
    w: 64,
    h: 64
  },

  selectionTool: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 1877,
    y: 700,
    w: 211,
    h: 125
  },

  wearableOwnedGem: {
    atlasSrc: ATLAS_SRC,
    atlasSize: ATLAS_SIZE,
    x: 64,
    y: 64,
    w: 40,
    h: 40
  }
}

export type ProfessionType = {
  frame: Sprite
  owned: Sprite
  unowned: Sprite
  type: LEVEL_TYPES
  hasWearable: boolean
  bonus: string
}

export const professions: Record<string, ProfessionType> = {
  Lumberjack: {
    frame: professionsPageSprites.lumberjackProfFrame,
    owned: professionsPageSprites.lumberjackWearableIcon,
    unowned: professionsPageSprites.lumberjackUnowned,
    type: LEVEL_TYPES.TREE,
    hasWearable: false,
    bonus: '+3'
  },
  Miner: {
    frame: professionsPageSprites.minerProfFrame,
    owned: professionsPageSprites.minerWearableIcon,
    unowned: professionsPageSprites.minerUnowned,
    type: LEVEL_TYPES.ROCK,
    hasWearable: false,
    bonus: '+2'
  },
  Butcher: {
    frame: professionsPageSprites.butcherProfFrame,
    owned: professionsPageSprites.butcherWearableIcon,
    unowned: professionsPageSprites.butcherUnowned,
    type: LEVEL_TYPES.MEAT,
    hasWearable: false,
    bonus: 'x2'
  },
  Assassin: {
    frame: professionsPageSprites.assassinProfFrame,
    owned: professionsPageSprites.TBDWearableIcon,
    unowned: professionsPageSprites.TBDWearableIcon,
    type: LEVEL_TYPES.ENEMY,
    hasWearable: false,
    bonus: '+?'
  },
  Gemcutter: {
    frame: professionsPageSprites.gemcutterProfFrame,
    owned: professionsPageSprites.TBDWearableIcon,
    unowned: professionsPageSprites.TBDWearableIcon,
    type: LEVEL_TYPES.GEM,
    hasWearable: false,
    bonus: '+?'
  },
  Professor: {
    frame: professionsPageSprites.professorProfFrame,
    owned: professionsPageSprites.TBDWearableIcon,
    unowned: professionsPageSprites.TBDWearableIcon,
    type: LEVEL_TYPES.KNOWLEDGE,
    hasWearable: false,
    bonus: '+?'
  }
}
