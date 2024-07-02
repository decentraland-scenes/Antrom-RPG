import { type Sprite } from '../utils/utils'

export const bottomBarSprites: Record<string, Sprite> = {
  background: {
    atlasSrc: 'assets/images/skillbar_spritesheet.png',
    atlasSize: { x: 645, y: 462 },
    x: 0,
    y: 160,
    w: 637,
    h: 130
  },
  hpBackground: {
    atlasSrc: 'assets/images/skillbar_spritesheet.png',
    atlasSize: { x: 645, y: 462 },
    x: 0,
    y: 0,
    w: 100,
    h: 100
  },
  hpFrame: {
    atlasSrc: 'assets/images/skillbar_spritesheet.png',
    atlasSize: { x: 645, y: 462 },
    x: 139,
    y: 0,
    w: 177,
    h: 159
  },
  xpBackground: {
    atlasSrc: 'assets/images/skillbar_spritesheet.png',
    atlasSize: { x: 645, y: 462 },
    x: 0,
    y: 305,
    w: 624,
    h: 10
  },
  xpFrame: {
    atlasSrc: 'assets/images/skillbar_spritesheet.png',
    atlasSize: { x: 645, y: 462 },
    x: 10,
    y: 386,
    w: 625,
    h: 13
  },
  exampleSkill: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 0,
    y: 0,
    w: 256,
    h: 256
  }
}

export const ASPECT_RATIO = 0.2
export const WIDTH_FACTOR = 0.35
export const HEIGTH_FACTOR = WIDTH_FACTOR * ASPECT_RATIO
export const HP_BACKGROUND_FACTOR =
  bottomBarSprites.hpBackground.w / bottomBarSprites.background.w
export const HP_W_FRAME_FACTOR =
  bottomBarSprites.hpFrame.w / bottomBarSprites.background.w
export const HP_FRAME_ASPECT_RATIO =
  bottomBarSprites.hpFrame.h / bottomBarSprites.hpFrame.w
export const XP_BACKGROUND_FACTOR =
  bottomBarSprites.xpBackground.w / bottomBarSprites.background.w
export const XP_BACKGROUND_ASPECT_RATIO =
  bottomBarSprites.xpBackground.h / bottomBarSprites.xpBackground.w
export const XP_W_FRAME_FACTOR =
  bottomBarSprites.xpFrame.w / bottomBarSprites.background.w
export const XP_FRAME_ASPECT_RATIO =
  bottomBarSprites.xpFrame.h / bottomBarSprites.xpFrame.w

//  "hp fill.png": {
//             frame: {
//                 x: 0,
//                 y: 0,
//                 w: 100,
//                 h: 100,
//             },
//             rotated: false,
//             trimmed: false,
//             spriteSourceSize: {
//                 x: 0,
//                 y: 0,
//                 w: 100,
//                 h: 100,
//             },
//             sourceSize: {
//                 w: 100,
//                 h: 100,
//             },
//         },
//         "hp frame (1).png": {
//             frame: {
//                 x: 100,
//                 y: 0,
//                 w: 255,
//                 h: 160,
//             },
//             rotated: false,
//             trimmed: false,
//             spriteSourceSize: {
//                 x: 0,
//                 y: 0,
//                 w: 255,
//                 h: 160,
//             },
//             sourceSize: {
//                 w: 255,
//                 h: 160,
//             },
//         },
//         "skillbar background.png": {
//             frame: {
//                 x: 0,
//                 y: 160,
//                 w: 637,
//                 h: 130,
//             },
//             rotated: false,
//             trimmed: false,
//             spriteSourceSize: {
//                 x: 0,
//                 y: 0,
//                 w: 637,
//                 h: 130,
//             },
//             sourceSize: {
//                 w: 637,
//                 h: 130,
//             },
//         },
//         "skillbar xp fill.png": {
//             frame: {
//                 x: 0,
//                 y: 290,
//                 w: 624,
//                 h: 40,
//             },
//             rotated: false,
//             trimmed: false,
//             spriteSourceSize: {
//                 x: 0,
//                 y: 0,
//                 w: 624,
//                 h: 40,
//             },
//             sourceSize: {
//                 w: 624,
//                 h: 40,
//             },
//         },
//         "skillbar xp frame.png": {
//             frame: {
//                 x: 0,
//                 y: 330,
//                 w: 645,
//                 h: 132,
//             },
//             rotated: false,
//             trimmed: false,
//             spriteSourceSize: {
//                 x: 0,
//                 y: 0,
//                 w: 645,
//                 h: 132,
//             },
//             sourceSize: {
//                 w: 645,
//                 h: 132,
//             },
//         },
//         "tiny health potion.png": {
//             frame: {
//                 x: 355,
//                 y: 0,
//                 w: 40,
//                 h: 40,
//             },
//             rotated: false,
//             trimmed: false,
//             spriteSourceSize: {
//                 x: 0,
//                 y: 0,
//                 w: 40,
//                 h: 40,
//             },
//             sourceSize: {
//                 w: 40,
//                 h: 40,
//             },
//         },
//         "tiny health potion bw.png": {
//             frame: {
//                 x: 395,
//                 y: 0,
//                 w: 40,
//                 h: 40,
//             },
//             rotated: false,
//             trimmed: false,
//             spriteSourceSize: {
//                 x: 0,
//                 y: 0,
//                 w: 40,
//                 h: 40,
//             },
//             sourceSize: {
//                 w: 40,
//                 h: 40,
//             },
//         },
