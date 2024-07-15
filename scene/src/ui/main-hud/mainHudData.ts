import { type Sprite } from '../../utils/ui-utils'

export const mainHudSprites: Record<string, Sprite> = {
  playerRoll: {
    atlasSrc: 'assets/images/main_spritesheet.png',
    atlasSize: { x: 1261, y: 727 },
    x: 100,
    y: 102,
    w: 224,
    h: 525
  },
  changeAvatarIcon: {
    atlasSrc: 'assets/images/main_spritesheet.png',
    atlasSize: { x: 1261, y: 727 },
    x: 425,
    y: 0,
    w: 64,
    h: 64
  },
  dailyDutiesIcon: {
    atlasSrc: 'assets/images/main_spritesheet.png',
    atlasSize: { x: 1261, y: 727 },
    x: 489,
    y: 0,
    w: 64,
    h: 64
  },
  exitButton: {
    atlasSrc: 'assets/images/main_spritesheet.png',
    atlasSize: { x: 1261, y: 727 },
    x: 629,
    y: 0,
    w: 40,
    h: 40
  },
  infoMenuIcon: {
    atlasSrc: 'assets/images/main_spritesheet.png',
    atlasSize: { x: 1261, y: 727 },
    x: 674,
    y: 5,
    w: 30,
    h: 30
  },
  infoMenuIconPressed: {
    atlasSrc: 'assets/images/main_spritesheet.png',
    atlasSize: { x: 1261, y: 727 },
    x: 709,
    y: 0,
    w: 40,
    h: 40
  },
  infoPanel: {
    atlasSrc: 'assets/images/main_spritesheet.png',
    atlasSize: { x: 1261, y: 727 },
    x: 749,
    y: 0,
    w: 512,
    h: 512
  },
  inventoryIcon: {
    atlasSrc: 'assets/images/main_spritesheet.png',
    atlasSize: { x: 1261, y: 727 },
    x: 425,
    y: 512,
    w: 64,
    h: 64
  },
  inventoryIconPressed: {
    atlasSrc: 'assets/images/main_spritesheet.png',
    atlasSize: { x: 1261, y: 727 },
    x: 489,
    y: 512,
    w: 64,
    h: 64
  },
  leaderIcon: {
    atlasSrc: 'assets/images/main_spritesheet.png',
    atlasSize: { x: 1261, y: 727 },
    x: 558,
    y: 517,
    w: 30,
    h: 30
  },
  leaderIconPressed: {
    atlasSrc: 'assets/images/main_spritesheet.png',
    atlasSize: { x: 1261, y: 727 },
    x: 593,
    y: 512,
    w: 40,
    h: 40
  },
  quickMenuIconOpen: {
    atlasSrc: 'assets/images/main_spritesheet.png',
    atlasSize: { x: 1261, y: 727 },
    x: 633,
    y: 512,
    w: 64,
    h: 64
  },
  quickMenuIconClose: {
    atlasSrc: 'assets/images/main_spritesheet.png',
    atlasSize: { x: 1261, y: 727 },
    x: 697,
    y: 512,
    w: 64,
    h: 64
  },
  quickMenuIconPressed: {
    atlasSrc: 'assets/images/main_spritesheet.png',
    atlasSize: { x: 1261, y: 727 },
    x: 761,
    y: 512,
    w: 64,
    h: 64
  },
  discordLogo: {
    atlasSrc: 'assets/images/main_spritesheet.png',
    atlasSize: { x: 1261, y: 727 },
    x: 561,
    y: 0,
    w: 60,
    h: 60
  },
  twitterLogo: {
    atlasSrc: 'assets/images/main_spritesheet.png',
    atlasSize: { x: 1261, y: 727 },
    x: 833,
    y: 512,
    w: 60,
    h: 60
  }
}

export const DISCORD_URL: string = 'https://discord.gg/Q9ztapgEAA'
export const TWITTER_URL:string = 'https://twitter.com/KnightsOfAntrom'