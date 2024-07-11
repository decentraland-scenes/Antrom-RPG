import { InputAction } from '@dcl/sdk/ecs'
import type { Sprite, slotsInputs } from '../../utils/ui-utils'
import { bottomBarSprites } from './bottomBarData'

export type skillSlotData = {
  skill: { cooldown: number; name: string; sprite: Sprite } | undefined
  hotKey: slotsInputs
  cooldownTime: number
  isCooling: boolean
  index: number
}

export type bottomBarProps = {
  slotsData: skillSlotData[] | undefined
  isVisible: boolean
  currentXp: number
  levelXp: number
  currentHpPercent: number
  level: number
  onClickSlot: (arg: number) => void
}

export type skillSlotProps = {
  slotsData: skillSlotData[] | undefined
  onClick: (arg: number) => void
  index: number
}

export const exampleSkill = {
  cooldown: 3,
  name: 'Example Skill',
  sprite: bottomBarSprites.exampleSkill
}

export const exampleSkill2 = {
  cooldown: 6,
  name: 'Example Skill',
  sprite: bottomBarSprites.exampleSkill
}

export const slotsDataToTest: skillSlotData[] = [
  {
    skill: exampleSkill,
    hotKey: InputAction.IA_ACTION_3,
    cooldownTime: 0,
    isCooling: false,
    index: 0
  },
  {
    skill: exampleSkill2,
    hotKey: InputAction.IA_PRIMARY,
    cooldownTime: 0,
    isCooling: false,
    index: 1
  },
  {
    skill: undefined,
    hotKey: InputAction.IA_SECONDARY,
    cooldownTime: 0,
    isCooling: false,
    index: 2
  },
  {
    skill: undefined,
    hotKey: InputAction.IA_ACTION_4,
    cooldownTime: 0,
    isCooling: false,
    index: 3
  },
  {
    skill: undefined,
    hotKey: InputAction.IA_ACTION_5,
    cooldownTime: 0,
    isCooling: false,
    index: 4
  },
  {
    skill: undefined,
    hotKey: InputAction.IA_ACTION_6,
    cooldownTime: 0,
    isCooling: false,
    index: 5
  }
]
