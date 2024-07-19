import {
  type SkillDefinition,
  type MaybeSkill,
  type PlayerSkill
} from '../../player/skills'
import { type SlotsInputs } from '../../utils/ui-utils'

export const GENERAL_SKILLS_TO_SHOW = 24
export const CLASS_SKILLS_TO_SHOW = 8

export type BottomBarProps = {
  slotsData: PlayerSkill
  currentXp: number
  levelXp: number
  currentHpPercent: number
  level: number
}

export type SkillSlotProps = {
  slot: MaybeSkill
  hotKey: SlotsInputs
}

const skillsPlayerSprites = {
  clericSkill: {
    atlasSrc: 'assets/images/skills/cleric.png',
    atlasSize: { x: 128, y: 128 },
    x: 0,
    y: 0,
    w: 128,
    h: 128
  },
  thiefSkill: {
    atlasSrc: 'assets/images/skills/thief.png',
    atlasSize: { x: 128, y: 128 },
    x: 0,
    y: 0,
    w: 128,
    h: 128
  },
  berserkerSkill: {
    atlasSrc: 'assets/images/skills/berserker.png',
    atlasSize: { x: 128, y: 128 },
    x: 0,
    y: 0,
    w: 128,
    h: 128
  },
  rangerSkill: {
    atlasSrc: 'assets/images/skills/ranger.png',
    atlasSize: { x: 128, y: 128 },
    x: 0,
    y: 0,
    w: 128,
    h: 128
  },
  mageSkill: {
    atlasSrc: 'assets/images/skills/mage.png',
    atlasSize: { x: 128, y: 128 },
    x: 0,
    y: 0,
    w: 128,
    h: 128
  },
  shield: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 0,
    y: 0,
    w: 256,
    h: 256
  },
  axe: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 256,
    y: 0,
    w: 256,
    h: 256
  },
  bow_shot: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 512,
    y: 0,
    w: 256,
    h: 256
  },
  wand_shot: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 768,
    y: 0,
    w: 256,
    h: 256
  },

  Archerskill_03: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1024,
    y: 0,
    w: 256,
    h: 256
  },

  Archerskill_07: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1280,
    y: 0,
    w: 256,
    h: 256
  },

  Archerskill_08: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1536,
    y: 0,
    w: 256,
    h: 256
  },

  Archerskill_11: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 0,
    y: 256,
    w: 256,
    h: 256
  },

  Archerskill_26: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 256,
    y: 256,
    w: 256,
    h: 256
  },

  Archerskill_34: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 512,
    y: 256,
    w: 256,
    h: 256
  },

  Archerskill_50: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 768,
    y: 256,
    w: 256,
    h: 256
  },

  Assassinskill_00: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1024,
    y: 256,
    w: 256,
    h: 256
  },

  Assassinskill_01: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1280,
    y: 256,
    w: 256,
    h: 256
  },

  Assassinskill_05: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1536,
    y: 256,
    w: 256,
    h: 256
  },

  Assassinskill_07: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 0,
    y: 512,
    w: 256,
    h: 256
  },

  Assassinskill_09: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 256,
    y: 512,
    w: 256,
    h: 256
  },

  Assassinskill_17: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 512,
    y: 512,
    w: 256,
    h: 256
  },

  Assassinskill_37: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 768,
    y: 512,
    w: 256,
    h: 256
  },

  Assassinskill_46: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1024,
    y: 512,
    w: 256,
    h: 256
  },

  Engineerskill_27: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1280,
    y: 512,
    w: 256,
    h: 256
  },

  Mageskill_00: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1536,
    y: 512,
    w: 256,
    h: 256
  },

  Mageskill_08: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 0,
    y: 768,
    w: 256,
    h: 256
  },

  Mageskill_09: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 256,
    y: 768,
    w: 256,
    h: 256
  },

  Mageskill_19: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 512,
    y: 768,
    w: 256,
    h: 256
  },

  Mageskill_23: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 768,
    y: 768,
    w: 256,
    h: 256
  },

  Mageskill_27: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1024,
    y: 768,
    w: 256,
    h: 256
  },

  Mageskill_28: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1280,
    y: 768,
    w: 256,
    h: 256
  },

  Mageskill_41: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1536,
    y: 768,
    w: 256,
    h: 256
  },

  Paladinskill_15: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 0,
    y: 1024,
    w: 256,
    h: 256
  },

  Priestskill_00: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 256,
    y: 1024,
    w: 256,
    h: 256
  },

  Priestskill_02: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 512,
    y: 1024,
    w: 256,
    h: 256
  },

  Priestskill_04: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 768,
    y: 1024,
    w: 256,
    h: 256
  },

  Priestskill_06: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1024,
    y: 1024,
    w: 256,
    h: 256
  },

  priestSkill_24: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1280,
    y: 1024,
    w: 256,
    h: 256
  },

  Priestskill_30: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1536,
    y: 1024,
    w: 256,
    h: 256
  },

  Priestskill_49: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 0,
    y: 1280,
    w: 256,
    h: 256
  },

  Shamanskill_21: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 256,
    y: 1280,
    w: 256,
    h: 256
  },

  skill_282: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 512,
    y: 1280,
    w: 256,
    h: 256
  },

  skill_294: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 768,
    y: 1280,
    w: 256,
    h: 256
  },

  skill_322: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1024,
    y: 1280,
    w: 256,
    h: 256
  },

  skill_328: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1280,
    y: 1280,
    w: 256,
    h: 256
  },

  skill_481: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1536,
    y: 1280,
    w: 256,
    h: 256
  },

  Warriorskill_05: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 0,
    y: 1536,
    w: 256,
    h: 256
  },

  Warriorskill_30: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 256,
    y: 1536,
    w: 256,
    h: 256
  },

  Warriorskill_33: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 512,
    y: 1536,
    w: 256,
    h: 256
  },

  Warriorskill_41: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 768,
    y: 1536,
    w: 256,
    h: 256
  },

  Warriorskill_42: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1024,
    y: 1536,
    w: 256,
    h: 256
  },

  Warriorskill_44: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1280,
    y: 1536,
    w: 256,
    h: 256
  },

  Warriorskill_50: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1536,
    y: 1536,
    w: 256,
    h: 256
  },

  cooldown: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1792,
    y: 0,
    w: 256,
    h: 256
  },

  skill_114: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1792,
    y: 256,
    w: 256,
    h: 256
  },

  skill_124: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1792,
    y: 512,
    w: 256,
    h: 256
  },

  skill_128: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1792,
    y: 768,
    w: 256,
    h: 256
  },

  skill_188: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1792,
    y: 1024,
    w: 256,
    h: 256
  },

  skill_189: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1792,
    y: 1280,
    w: 256,
    h: 256
  },

  skill_27: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 1792,
    y: 1536,
    w: 256,
    h: 256
  },

  skill_44: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 0,
    y: 1792,
    w: 256,
    h: 256
  },

  skill_74: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 256,
    y: 1792,
    w: 256,
    h: 256
  },

  skill_8: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 512,
    y: 1792,
    w: 256,
    h: 256
  },

  skill_80: {
    atlasSrc: 'assets/images/skills/player_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 768,
    y: 1792,
    w: 256,
    h: 256
  }
}
const skillsGeneralSprites = {
  '13_summon_raven': {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 0,
    y: 0,
    w: 256,
    h: 256
  },
  '18_shield': {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 256,
    y: 0,
    w: 256,
    h: 256
  },
  '21_axe': {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 512,
    y: 0,
    w: 256,
    h: 256
  },
  '23_axe': {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 768,
    y: 0,
    w: 256,
    h: 256
  },
  '33_wand_shot': {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1024,
    y: 0,
    w: 256,
    h: 256
  },
  '35_wand_shot': {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1280,
    y: 0,
    w: 256,
    h: 256
  },
  skill_238: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1536,
    y: 0,
    w: 256,
    h: 256
  },
  skill_243: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 0,
    y: 256,
    w: 256,
    h: 256
  },
  skill_279: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 256,
    y: 256,
    w: 256,
    h: 256
  },
  skill_319: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 512,
    y: 256,
    w: 256,
    h: 256
  },
  skill_329: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 768,
    y: 256,
    w: 256,
    h: 256
  },
  skill_354: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1024,
    y: 256,
    w: 256,
    h: 256
  },
  skill_393: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1280,
    y: 256,
    w: 256,
    h: 256
  },
  skill_395: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1536,
    y: 256,
    w: 256,
    h: 256
  },
  skill_407: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 0,
    y: 512,
    w: 256,
    h: 256
  },
  skill_408: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 256,
    y: 512,
    w: 256,
    h: 256
  },
  skill_483: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 512,
    y: 512,
    w: 256,
    h: 256
  },
  Warriorskill_40: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 768,
    y: 512,
    w: 256,
    h: 256
  },
  Warriorskill_42: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1024,
    y: 512,
    w: 256,
    h: 256
  },
  Warriorskill_45: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1280,
    y: 512,
    w: 256,
    h: 256
  },
  cooldown: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1536,
    y: 512,
    w: 256,
    h: 256
  },
  skill_100: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 0,
    y: 768,
    w: 256,
    h: 256
  },
  skill_110: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 256,
    y: 768,
    w: 256,
    h: 256
  },
  skill_114: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 512,
    y: 768,
    w: 256,
    h: 256
  },
  skill_123: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 768,
    y: 768,
    w: 256,
    h: 256
  },
  skill_131: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1024,
    y: 768,
    w: 256,
    h: 256
  },
  skill_133: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1280,
    y: 768,
    w: 256,
    h: 256
  },
  skill_134: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1536,
    y: 768,
    w: 256,
    h: 256
  },
  skill_140: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 0,
    y: 1024,
    w: 256,
    h: 256
  },
  skill_15: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 256,
    y: 1024,
    w: 256,
    h: 256
  },
  skill_151: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 512,
    y: 1024,
    w: 256,
    h: 256
  },
  skill_154: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 768,
    y: 1024,
    w: 256,
    h: 256
  },
  skill_156: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1024,
    y: 1024,
    w: 256,
    h: 256
  },
  skill_162: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1280,
    y: 1024,
    w: 256,
    h: 256
  },
  skill_164: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1536,
    y: 1024,
    w: 256,
    h: 256
  },
  skill_166: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 0,
    y: 1280,
    w: 256,
    h: 256
  },
  skill_167: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 256,
    y: 1280,
    w: 256,
    h: 256
  },
  skill_175: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 512,
    y: 1280,
    w: 256,
    h: 256
  },
  skill_185: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 768,
    y: 1280,
    w: 256,
    h: 256
  },
  skill_199: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1024,
    y: 1280,
    w: 256,
    h: 256
  },
  skill_24: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1280,
    y: 1280,
    w: 256,
    h: 256
  },
  skill_254: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1536,
    y: 1280,
    w: 256,
    h: 256
  },
  skill_29: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 0,
    y: 1536,
    w: 256,
    h: 256
  },
  skill_34: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 256,
    y: 1536,
    w: 256,
    h: 256
  },
  skill_35: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 512,
    y: 1536,
    w: 256,
    h: 256
  },
  skill_38: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 768,
    y: 1536,
    w: 256,
    h: 256
  },
  skill_41: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1024,
    y: 1536,
    w: 256,
    h: 256
  },
  skill_43: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1280,
    y: 1536,
    w: 256,
    h: 256
  },
  skill_451: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1536,
    y: 1536,
    w: 256,
    h: 256
  },
  skill_54: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1792,
    y: 0,
    w: 256,
    h: 256
  },
  skill_65: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1792,
    y: 256,
    w: 256,
    h: 256
  },
  skill_66: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1792,
    y: 512,
    w: 256,
    h: 256
  },
  skill_72: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1792,
    y: 768,
    w: 256,
    h: 256
  },
  skill_98: {
    atlasSrc: 'assets/images/skills/general_skills/spritesheet.png',
    atlasSize: { x: 2048, y: 1792 },
    x: 1792,
    y: 1024,
    w: 256,
    h: 256
  },
  rotated: false,
  trimmed: false,
  spriteSourceSize: {
    x: 0,
    y: 0,
    w: 256,
    h: 256
  },
  sourceSize: {
    w: 256,
    h: 256
  }
}

export const SKILL_DATA = {
  clericSkill: {
    name: 'Healing Touch',
    sprite: skillsPlayerSprites.clericSkill,
    cooldown: 8
  },
  thiefSkill: {
    name: `Assasin's Ambition`,
    sprite: skillsPlayerSprites.thiefSkill,
    cooldown: 12
  },
  rangerSkill: {
    name: 'Keen Eye',
    sprite: skillsPlayerSprites.rangerSkill,
    cooldown: 12
  },
  berserkerSkill: {
    name: 'Big Swing',
    sprite: skillsPlayerSprites.berserkerSkill,
    cooldown: 6
  },
  mageSkill: {
    name: 'Smoke Screen',
    sprite: skillsPlayerSprites.mageSkill,
    cooldown: 12
  },
  geraldsBlessing: {
    name: `Gerald's Blessing`,
    sprite: skillsPlayerSprites.Priestskill_49,
    cooldown: 10,
    minLevel: 10
  },
  protectorBlessing: {
    name: `Protector's Blessing`,
    sprite: skillsPlayerSprites.skill_189,
    cooldown: 10,
    minLevel: 20
  },
  healingTouch: {
    name: 'Healing Touch',
    sprite: skillsPlayerSprites.Paladinskill_15,
    cooldown: 4,
    minLevel: 30
  },
  sacredBarrier: {
    name: 'Sacred Barrier',
    sprite: skillsPlayerSprites.shield,
    cooldown: 10,
    minLevel: 40
  },
  holyRetribution: {
    name: 'Holy Retribution',
    sprite: skillsPlayerSprites.Shamanskill_21,
    cooldown: 15,
    minLevel: 50
  },
  smiteEvil: {
    name: 'Smite Evil',
    sprite: skillsPlayerSprites.Mageskill_23,
    cooldown: 8,
    minLevel: 60
  },
  arcaneMissile: {
    name: 'Arcane Missile',
    sprite: skillsPlayerSprites.Engineerskill_27,
    cooldown: 6,
    minLevel: 10
  },
  shadowChains: {
    name: 'Shadow Chains',
    sprite: skillsPlayerSprites.skill_27,
    cooldown: 20,
    minLevel: 20
  },
  armorSap: {
    name: 'Armor Sap',
    sprite: skillsPlayerSprites.skill_8,
    cooldown: 30,
    minLevel: 30
  },
  etherProtection: {
    name: 'Ether Protection',
    sprite: skillsPlayerSprites.skill_322,
    cooldown: 20,
    minLevel: 40
  },
  restoration: {
    name: 'Restoration',
    sprite: skillsPlayerSprites.priestSkill_24,
    cooldown: 15,
    minLevel: 50
  },
  fireball: {
    name: 'Fireball Aura',
    sprite: skillsPlayerSprites.Mageskill_19,
    cooldown: 10,
    minLevel: 60
  },
  Swiftfoot: {
    name: 'Swiftfoot',
    sprite: skillsPlayerSprites.skill_128,
    cooldown: 14,
    minLevel: 10
  },
  shadowstrike: {
    name: 'Shadowstrike',
    sprite: skillsPlayerSprites.skill_188,
    cooldown: 8,
    minLevel: 20
  },
  fortunesFavor: {
    name: 'Fortunes Favor',
    sprite: skillsPlayerSprites.skill_44,
    cooldown: 12,
    minLevel: 30
  },
  stoneheart: {
    name: 'Stoneheart',
    sprite: skillsPlayerSprites.skill_114,
    cooldown: 12,
    minLevel: 40
  },
  bleedForMe: {
    name: 'Bleed For Me',
    sprite: skillsPlayerSprites.skill_124,
    minLevel: 50,
    description:
      'Increase Attack by your LUCK% multiplied by 30 after each successful attack for 20 s. ',
    cooldown: 25
  },
  // Luck and Attack buff lvl 4
  lastBlow: {
    name: 'Last Blow',
    sprite: skillsPlayerSprites.wand_shot,
    minLevel: 60,
    description: 'Gain 1500 Attack and 100% Luck for 16 s THEN lose 50% HP.',
    cooldown: 16
  },

  // RANGER
  // Support lvl 1 crit rate gain 30% crit rate
  deadlyPrecision: {
    name: 'Deadly Precision',
    sprite: skillsPlayerSprites.skill_80,
    minLevel: 10,
    description: 'Gain 30% Critical chance for 12 s',
    cooldown: 12
  },
  // Support lvl 1 crit dmg gain 200% crit dmg
  savageStrike: {
    name: 'Savage Strike',
    sprite: skillsPlayerSprites.skill_74,
    minLevel: 20,
    description: 'Gain 200% Damage on your critical attacks for 12 s',
    cooldown: 12
  },
  // Attack lvl 2 50% attack dmg
  RANGER_MIGHTY_SHOT: {
    name: 'Mighty Shot',
    sprite: skillsPlayerSprites.skill_328,
    minLevel: 30,
    description: 'Your Attacks deal 300% more damage for for 9 s',
    cooldown: 9
  },
  // Attack lvl 2 POISON attack dmg
  RANGER_POISON_ARROWS: {
    name: 'Poison Arrows',
    sprite: skillsPlayerSprites.bow_shot,
    minLevel: 40,
    description:
      "If the next attack is successful, decrease your opponents' HP by player ATTACK every 2 seconds for 20 seconds.",
    cooldown: 20
  },
  // Support lvl 1 heal 100 when crit dmg
  RANGER_VITAL_SHOT: {
    name: 'Vital Shot',
    sprite: skillsPlayerSprites.skill_481,
    minLevel: 50,
    description:
      'Heal 100% of your max HP when you deal critical damage for 20 s',
    cooldown: 20
  },
  // Attack lvl 4 100% counter
  RANGER_RECOIL_SHOT: {
    name: 'Recoil Shot',
    minLevel: 60,
    description:
      'Deal 150% of your inflicted damage back to the enemy for for 15 s',
    sprite: skillsPlayerSprites.skill_282,
    cooldown: 15
  },

  // Berserker
  // Support Heal lvl 1
  BERSERKER_BLOOD_FURY: {
    name: 'Blood Fury',
    minLevel: 10,
    description: 'Gain HP equal to the 10% of your attack damage for 9 s',
    sprite: skillsPlayerSprites.Assassinskill_37,
    cooldown: 9
  },
  // Attack lvl 1 gain 100%
  BERSERKER_DEATH_STRIKE: {
    name: 'Death Strike',
    minLevel: 20,
    description:
      'Lose 15% of your current HP and gain 100% more Attack for 6 s',
    sprite: skillsPlayerSprites.axe,
    cooldown: 6
  },
  // Support Crit Rate lvl 1 50%
  BERSERKER_SAVAGE_PRECISION: {
    name: 'Savage Precision',
    minLevel: 30,
    description: 'Lose 8% Luck and gain 50% Critical Rate for 9 s',
    sprite: skillsPlayerSprites.Archerskill_50,
    cooldown: 9
  },
  // Attack lvl 3
  BERSERKER_RAMPAGE: {
    name: 'Rampage',
    minLevel: 40,
    description:
      'Increase your Attack by 100 for every successful attack for 15 s',
    sprite: skillsPlayerSprites.Warriorskill_30,
    cooldown: 15
  },
  // Attack lvl 3
  BERSERKER_BLOOD_DANCE: {
    name: 'Blood Dance',
    minLevel: 50,
    description: 'Increase your attack by 400% of your missing HP for 12 s',
    sprite: skillsPlayerSprites.Assassinskill_17,
    cooldown: 12
  },
  // Support Luck lvl 4
  BERSERKER_FURYS_MOMENTUM: {
    name: "Fury's Momentum",
    minLevel: 60,
    description: 'LUCK increases by 7% for every successful attack for 15 s',
    sprite: skillsPlayerSprites.Assassinskill_09,
    cooldown: 15
  },

  // GENERAL
  // Attack buffer lvl 1 25 attack
  GENERAL_DISRUPTIVE_BLOW: {
    name: 'Disruptive Blow',
    minLevel: 1,
    description:
      'Strike your opponents with a disruptive force! \n\nAttack increase by 50 for 6s.\n\ncooldown: 9 s \n\n*If the next attack is unsuccessful, inflict bleeding damage of 60 every 2 seconds for 30 seconds if you are wearing Double Hatchets.',
    sprite: skillsPlayerSprites.axe, // skillsConfig.json["skill_113,
    cooldown: 9 // Adjust the cooldown as needed
  },
  // Support Healing lvl 1 25%
  GENERAL_FIRST_AID_KIT: {
    name: 'First Aid Kit',
    minLevel: 2,
    description: 'Heal the 25% of your missing HP. \n\ncooldown: 4 s',
    sprite: skillsGeneralSprites.skill_407, // "FirstAidKit.png", substitute
    cooldown: 4
  },
  // AOE Attack lvl 1 Single player attack
  GENERAL_FIREBALL: {
    name: 'Fireball',
    minLevel: 3,
    description: `Deal ATTACK damage to all enemies. \n\ncooldown: 5 s \n\n*Damage increases to +300 if you are wearing Legionnaire, Pinnacle of Echoes.`,
    sprite: skillsGeneralSprites.skill_279,
    cooldown: 5
  },
  GENERAL_STORM: {
    name: 'Sanctified Storm',
    minLevel: 4,
    description: `Deal MAGIC damage to all enemies. \n\ncooldown: 5 s`,
    sprite: skillsGeneralSprites.skill_72,
    cooldown: 5
  },

  // Support Luck lvl 1 20%
  GENERAL_LUCKY_CHARM: {
    name: 'Lucky Charm',
    minLevel: 5,
    description: 'Luck is increased by 10%. \n\ncooldown: 9 s ',
    sprite: skillsGeneralSprites.skill_254,
    cooldown: 9 // 40 seconds in milliseconds
  },
  // Support Crit Rate lvl 1 30%
  GENERAL_PRECISION_FOCUS: {
    name: 'Precision Focus',
    minLevel: 10,
    description: 'Critical rate is increased by 30%. \n\ncooldown: 9 s ',
    sprite: skillsGeneralSprites.skill_29,
    cooldown: 9 // 25 seconds in milliseconds
  },
  // Support Defense lvl 2 - enemy attack by 50%
  GENERAL_DEFENSIVE_POSTURE: {
    name: 'Quake!',
    minLevel: 15,
    description: 'Deal ATTACK damage to all enemies. \n\ncooldown: 2 s ',
    sprite: skillsGeneralSprites.skill_54,
    cooldown: 2
  },
  // Support Defense lvl 1 25%
  GENERAL_STRIKE: {
    name: 'Thunder Strike',
    minLevel: 20,
    description: 'Deal ranged MAGIC damage to all enemies! \n\ncooldown: 3 s ',
    sprite: skillsGeneralSprites.skill_100,
    cooldown: 3
  },
  GENERAL_IRON_DEFENSE: {
    name: 'Iron Defense',
    minLevel: 20,
    description: 'Defense is increased by 25%. \n\ncooldown: 6 s ',
    sprite: skillsGeneralSprites.skill_133,
    cooldown: 6 // 30 seconds in milliseconds
  },
  // Support Heal lvl 2 MAX +50%
  GENERAL_VITALITY_SURGE: {
    name: 'Vitality Surge',
    minLevel: 25,
    description: 'Maximum health is increased by 10%. \n\ncooldown: 15 s ',
    sprite: skillsGeneralSprites.skill_175,
    cooldown: 15 // 45 seconds in milliseconds
  },
  // Attack buffer lvl 2 25% of MAX HP
  GENERAL_VITALITY_BOOST: {
    name: 'Vitality Boost',
    minLevel: 30,
    description: 'Gain Attack equal to 25% of your MAX HP. \n\ncooldown: 15 s ',
    sprite: skillsPlayerSprites.Warriorskill_42,
    cooldown: 15
  },

  // Support Defense lvl 2 50%
  GENERAL_SHIELD_WALL: {
    name: 'Shield Wall',
    minLevel: 35,
    description: 'Gain 50% Defense. \n\ncooldown: 12 s ',
    sprite: skillsGeneralSprites.Warriorskill_40,
    cooldown: 12
  },
  // AOE Attack lvl 2 Double player attack
  GENERAL_HAMMER_SHOT: {
    name: 'Double Hammer Shot',
    minLevel: 40,
    description: 'Deal ATTACK damage to all enemies twice. \n\ncooldown: 3 s ',
    sprite: skillsGeneralSprites.Warriorskill_45, // "9_club_attack.png", substitute
    cooldown: 3
  },
  // Support Defense lvl 2 - enemy attack by 50% (DUPE)
  GENERAL_DEFENSIVE_AURA: {
    name: 'Magic Aura',
    minLevel: 45,
    description:
      'Increase MAGIC by double (triple for MAGEs). \n\ncooldown: 12 s ',
    sprite: skillsGeneralSprites.skill_15,
    cooldown: 12
  },

  GENERAL_SOULRELEASE: {
    name: 'Soul Release',
    minLevel: 45,
    description: 'Gain Magic equal to 5% of your MAX HP. \n\ncooldown: 15 s ',
    sprite: skillsPlayerSprites.wand_shot,
    cooldown: 15
  },

  // Attack buffer lvl 3 30% attack
  GENERAL_MIGHTY_ASSAULT: {
    name: 'Mighty Assault',
    minLevel: 50,
    description: 'Attacks deal 30% increased damage. \n\ncooldown: 8 s ',
    sprite: skillsGeneralSprites.skill_65,
    cooldown: 8 // 20 seconds in milliseconds
  },

  // Support Defense lvl 3 10% for each unsuccessful roll
  GENERAL_FORTRESS_OF_RESILIENCE: {
    name: 'Big Red Resilience',
    minLevel: 60,
    description:
      'Increase your HP instantly using a potion. \n\ncooldown: 0 s ',
    sprite: skillsGeneralSprites.skill_451, // Replace with the actual icon filename
    cooldown: 0 // 25 seconds cooldown
  },
  // Support Special missing hp
  GENERAL_OATH_TO_DEMON_KING: {
    name: 'Oath to the King',
    minLevel: 65,
    description:
      'Pledge allegiance to the power of the Demon King decrease your health by 90% \n\ncooldown: 5 s ',
    sprite: skillsGeneralSprites.skill_185,
    cooldown: 5 // 25 seconds cooldown
  },
  // Support Special no luck
  GENERAL_GODRICS_BLESSING: {
    name: "Godric's Blessing",
    minLevel: 70,
    description:
      'Receive the divine blessing of Godric, but at a cost... your LUCK decreases by 90%.  \n\ncooldown: 30 s ',
    sprite: skillsPlayerSprites.wand_shot,
    cooldown: 5 // 5 seconds cooldown
  },
  // Attack lvl 4 counter
  GENERAL_CONFUSING_BLADES: {
    name: 'Confusing Blades',
    minLevel: 75,
    description:
      'Deal 70% of your inflicted damage back to the enemy. \n\ncooldown: 12 s ',
    sprite: skillsGeneralSprites.skill_38,
    cooldown: 12
  },

  // Attack lvl 3 poison
  GENERAL_VENOMOUS_BLADE: {
    name: 'Venomous Blade',
    minLevel: 80,
    description: 'POISON enemy. \n\ncooldown: 6 s ',
    sprite: skillsGeneralSprites.skill_24,
    cooldown: 6 // Adjust the cooldown as needed
  },

  GENERAL_SPELL_CANCEL: {
    name: 'Intimidation',
    minLevel: 90,
    description: 'Block Enemy skills. \n\ncooldown: 15 s',
    sprite: skillsGeneralSprites.skill_123,
    cooldown: 15
  },

  GENERAL_Vampiric_Transfusion: {
    name: 'Vampiric Transfusion',
    minLevel: 110,
    description:
      'Remove all ATTACK and add it to your MAGIC for 30 seconds. Additionally, absorb 100% of the damage dealt by your magic attacks as health. \n\ncooldown: 20 s',
    sprite: skillsGeneralSprites.skill_354,
    cooldown: 30
  },

  GENERAL_Celestial_Retribution: {
    name: 'Celestial Retribution',
    minLevel: 120,
    description:
      'Deal 150% of your inflicted damage back to the enemy for 15 seconds. Additionally, for every instance of damage reflected, gain a stack of Celestial Essence increasing all stats by 5% per stack for the duration.',
    sprite: skillsGeneralSprites.skill_151,
    cooldown: 15
  },

  GENERAL_FORTUNES_FAVOR: {
    name: 'Fortunes Benediction',
    minLevel: 130,
    description:
      'If your next roll is successful gain a stack of Fortune, increasing all stats by 5% per stack for the duration. for 20 s',
    sprite: skillsGeneralSprites.skill_43,
    cooldown: 20
  }
}

export const arrayOfSkills: SkillDefinition[] = Object.values(SKILL_DATA)
