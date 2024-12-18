import type { Sprite } from '../../utils/ui-utils'

export type DialogButton = {
  label: string
  triggeredAction?: unknown
  goToDialog: string
  disabled?: boolean
  action?: 'primary' | 'secondary'
}

export type Dialog = {
  id: string
  text: string
  portraitSource: string
  isQuestion: boolean
  buttons: DialogButton[]
  isEndOfDialog?: boolean
}

export const BONE_TRADER_DIALOGS: Dialog[] = [
  {
    id: 'bone-trader-1',
    text: `My son said I'm a hoarder, and I have way too much BONES.`,
    portraitSource: 'assets/images/pfp/advBoneTrader.png',
    isQuestion: false,
    buttons: []
  },
  {
    id: 'bone-trader-2',
    text: `Might you be interested in making a purchase?`,
    portraitSource: 'assets/images/pfp/advBoneTrader.png',
    isQuestion: true,
    buttons: [
      {
        label: 'Yes',
        goToDialog: 'bone-trader-yes',
        action: 'primary'
      },
      { label: 'No', goToDialog: 'bone-trader-no' },
      {
        label: 'Disabled',
        goToDialog: 'bone-trader-no',
        disabled: true,
        action: 'secondary'
      }
    ]
  },
  {
    id: 'bone-trader-yes',
    text: `Thank you!`,
    portraitSource: 'assets/images/pfp/advBoneTrader.png',
    isQuestion: false,
    buttons: [],
    isEndOfDialog: true
  },
  {
    id: 'bone-trader-no',
    text: `Have a great day!`,
    portraitSource: 'assets/images/pfp/advBoneTrader.png',
    buttons: [],
    isQuestion: false,
    isEndOfDialog: true
  }
]

export const npcDialogsSprites: Record<string, Sprite> = {
  background: {
    atlasSrc: 'assets/images/NPC_dialogue_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 22,
    y: 756,
    w: 764,
    h: 246
  },
  click_on_bg_icon: {
    atlasSrc: 'assets/images/NPC_dialogue_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 792,
    y: 383,
    w: 45,
    h: 60
  },
  available_button: {
    atlasSrc: 'assets/images/NPC_dialogue_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 509,
    y: 611,
    w: 176,
    h: 46
  },
  unavailable_button: {
    atlasSrc: 'assets/images/NPC_dialogue_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 509,
    y: 661,
    w: 176,
    h: 46
  },
  f_icon_avaialable: {
    atlasSrc: 'assets/images/NPC_dialogue_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 730,
    y: 610,
    w: 27,
    h: 26
  },
  e_icon_avaialable: {
    atlasSrc: 'assets/images/NPC_dialogue_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 695,
    y: 610,
    w: 27,
    h: 26
  },
  f_icon_unavaialable: {
    atlasSrc: 'assets/images/NPC_dialogue_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 800,
    y: 610,
    w: 27,
    h: 26
  },
  e_icon_unavaialable: {
    atlasSrc: 'assets/images/NPC_dialogue_spritesheet.png',
    atlasSize: { x: 1024, y: 1024 },
    x: 765,
    y: 610,
    w: 27,
    h: 26
  }
}

export const DIALOG_WIDTH_FACTOR = 0.4
export const DIALOG_ASPECT_RATIO = 0.3
export const DIALOG_HEIGHT_FACTOR = DIALOG_WIDTH_FACTOR * DIALOG_ASPECT_RATIO

export const BUTTON_WIDTH_FACTOR = DIALOG_WIDTH_FACTOR * 0.2
export const BUTTON_ASPECT_RATIO = 0.26
export const BUTTON_HEIGHT_FACTOR = BUTTON_WIDTH_FACTOR * BUTTON_ASPECT_RATIO
