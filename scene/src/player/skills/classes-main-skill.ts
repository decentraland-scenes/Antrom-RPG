import { SkillController } from '.'
import { SKILL_DATA } from '../../ui/bottom-bar/skillsData'
import { CharacterClasses } from '../../ui/creation-player/creationPlayerData'
import { setTimeout } from '../../utils/lib'
import { LEVEL_TYPES } from '../LevelManager'
import { Player } from '../player'

export const CLASS_MAIN_SKILL: Record<CharacterClasses, () => SkillController> =
  {
    [CharacterClasses.CC_CLERIC]: () => new ClericMainSkill(),
    [CharacterClasses.CC_THIEF]: () => new ThiefMainSkill(),
    [CharacterClasses.CC_RANGER]: () => new RangerMainSkill(),
    [CharacterClasses.CC_BERSERKER]: () => new BerserkerMainSkill(),
    [CharacterClasses.CC_MAGE]: () => new MageMainSkill()
  }

export class ClericMainSkill extends SkillController {
  constructor() {
    super(SKILL_DATA.clericSkill)
  }

  effect(): void {
    // heal 25%
    if (Player.getInstance().levels.getLevel(LEVEL_TYPES.PLAYER) <= 20) {
      Player.getInstance().refillHealthBar(0.25)
    } else {
      Player.getInstance().refillHealthBar(1)
    }
  }
}

export class ThiefMainSkill extends SkillController {
  constructor() {
    super(SKILL_DATA.thiefSkill)
  }

  effect(): void {
    // +2 atk, +2 luck for 15 sec
    const ATTACK_BUFF = 15
    const LUCK_BUFF = 20
    const LEVEL_20_ATTACK_BUFF = 40
    const LEVEL_20_LUCK_BUFF = 30

    if (Player.getInstance().levels.getLevel(LEVEL_TYPES.PLAYER) <= 20) {
      Player.getInstance().updateAtkBuff(ATTACK_BUFF)
      // TODO
      // Player.getInstance().updateLuckBuff(LUCK_BUFF)
    } else {
      Player.getInstance().updateAtkBuff(LEVEL_20_ATTACK_BUFF)
      // TODO
      // Player.getInstance().updateLuckBuff(LEVEL_20_LUCK_BUFF)
    }

    setTimeout(() => {
      if (Player.getInstance().levels.getLevel(LEVEL_TYPES.PLAYER) <= 20) {
        Player.getInstance().updateAtkBuff(-ATTACK_BUFF)
        Player.getInstance().updateLuckBuff(-LUCK_BUFF)
      } else {
        Player.getInstance().updateAtkBuff(-LEVEL_20_ATTACK_BUFF)
        Player.getInstance().updateLuckBuff(-LEVEL_20_LUCK_BUFF)
      }
    }, 12 * 1000)
  }
}

export class RangerMainSkill extends SkillController {
  constructor() {
    super(SKILL_DATA.rangerSkill)
  }

  effect(): void {
    // +4 luck for 10 sec
    const LUCK_BUFF = 8
    const LEVEL_20_LUCK_BUFF = 16
    const CRIT_BUFF = 10

    if (Player.getInstance().levels.getLevel(LEVEL_TYPES.PLAYER) <= 20) {
      Player.getInstance().updateLuckBuff(LUCK_BUFF)
    } else {
      Player.getInstance().updateLuckBuff(LEVEL_20_LUCK_BUFF)
      Player.getInstance().updateCritRate(CRIT_BUFF)
    }

    setTimeout(() => {
      if (Player.getInstance().levels.getLevel(LEVEL_TYPES.PLAYER) <= 20) {
        Player.getInstance().updateLuckBuff(-LUCK_BUFF)
      } else {
        Player.getInstance().updateLuckBuff(-LEVEL_20_LUCK_BUFF)
        Player.getInstance().updateCritRate(-CRIT_BUFF)
      }
    }, 12 * 1000)
  }
}

export class BerserkerMainSkill extends SkillController {
  constructor() {
    super(SKILL_DATA.berserkerSkill)
  }

  effect(): void {
    // +8 atk for 5 sec
    const ATTACK_BUFF =
      Player.getInstance().levels.getLevel(LEVEL_TYPES.PLAYER) * 10
    const LEVEL_20_ATTACK_BUFF =
      Player.getInstance().levels.getLevel(LEVEL_TYPES.PLAYER) * 5 + 120

    if (Player.getInstance().levels.getLevel(LEVEL_TYPES.PLAYER) <= 20) {
      Player.getInstance().updateAtkBuff(ATTACK_BUFF)
    } else {
      Player.getInstance().updateAtkBuff(LEVEL_20_ATTACK_BUFF)
    }

    setTimeout(() => {
      if (Player.getInstance().levels.getLevel(LEVEL_TYPES.PLAYER) <= 20) {
        Player.getInstance().updateAtkBuff(-ATTACK_BUFF)
      } else {
        Player.getInstance().updateAtkBuff(-LEVEL_20_ATTACK_BUFF)
      }
    }, 6 * 1000)
  }
}

export class MageMainSkill extends SkillController {
  constructor() {
    super(SKILL_DATA.mageSkill)
  }

  effect(): void {
    // +50% def for 5 sec
    const MAGIC_BUFF = 50
    const LEVEL_20_MAGIC_BUFF = 150

    if (Player.getInstance().levels.getLevel(LEVEL_TYPES.PLAYER) <= 20) {
      Player.getInstance().updateMagic(MAGIC_BUFF)
    } else {
      Player.getInstance().updateMagic(LEVEL_20_MAGIC_BUFF)
    }

    setTimeout(() => {
      if (Player.getInstance().levels.getLevel(LEVEL_TYPES.PLAYER) <= 20) {
        Player.getInstance().updateMagic(-MAGIC_BUFF)
      } else {
        Player.getInstance().updateMagic(-LEVEL_20_MAGIC_BUFF)
        Player.getInstance().refillHealthBar(0.2)
      }
    }, 12 * 1000)
  }
}

// addClassSkill(c: Class) {
//   let onButton: any
//   let offButton: any
//   let skillEffect: Function
//   let cooldown: number = 8
//   switch (c) {
//       case Class.CLERIC:
//           onButton = SkillsConfig.playerJson["Priestskill_00.png"]
//           // offButton = "clericskillsmiconbw.png"
//           skillEffect = () => {
//               // heal 25%
//               if (
//                   Player.getInstance().levels.getLevel(
//                       LEVEL_TYPES.PLAYER
//                   ) <= 20
//               ) {
//                   Player.getInstance().refillHealthBar(0.25)
//               } else {
//                   Player.getInstance().refillHealthBar(1)
//               }
//           }
//           break
//       case Class.THIEF:
//           onButton = SkillsConfig.playerJson["Assassinskill_00.png"]
//           // offButton = "thiefskillsmiconbw.png"
//           skillEffect = () => {
//               // +2 atk, +2 luck for 15 sec
//               const ATTACK_BUFF = 15
//               const LUCK_BUFF = 20
//               const LEVEL_20_ATTACK_BUFF = 40
//               const LEVEL_20_LUCK_BUFF = 30

//               if (
//                   Player.getInstance().levels.getLevel(
//                       LEVEL_TYPES.PLAYER
//                   ) <= 20
//               ) {
//                   Player.getInstance().updateAtkBuff(ATTACK_BUFF)
//                   Player.getInstance().updateLuckBuff(LUCK_BUFF)
//               } else {
//                   Player.getInstance().updateAtkBuff(LEVEL_20_ATTACK_BUFF)
//                   Player.getInstance().updateLuckBuff(LEVEL_20_LUCK_BUFF)
//               }

//               setTimeout(12 * 1000, () => {
//                   if (
//                       Player.getInstance().levels.getLevel(
//                           LEVEL_TYPES.PLAYER
//                       ) <= 20
//                   ) {
//                       Player.getInstance().updateAtkBuff(-ATTACK_BUFF)
//                       Player.getInstance().updateLuckBuff(-LUCK_BUFF)
//                   } else {
//                       Player.getInstance().updateAtkBuff(
//                           -LEVEL_20_ATTACK_BUFF
//                       )
//                       Player.getInstance().updateLuckBuff(
//                           -LEVEL_20_LUCK_BUFF
//                       )
//                   }
//               })
//           }
//           break
//       case Class.RANGER:
//           onButton = SkillsConfig.playerJson["Archerskill_07.png"] // "rangerskillsmicon.png"
//           // offButton = "rangerskillsmiconbw.png"
//           skillEffect = () => {
//               // +4 luck for 10 sec
//               const LUCK_BUFF = 8
//               const LEVEL_20_LUCK_BUFF = 16
//               const CRIT_BUFF = 10

//               if (
//                   Player.getInstance().levels.getLevel(
//                       LEVEL_TYPES.PLAYER
//                   ) <= 20
//               ) {
//                   Player.getInstance().updateLuckBuff(LUCK_BUFF)
//               } else {
//                   Player.getInstance().updateLuckBuff(LEVEL_20_LUCK_BUFF)
//                   Player.getInstance().updateCritRate(CRIT_BUFF)
//               }

//               setTimeout(12 * 1000, () => {
//                   if (
//                       Player.getInstance().levels.getLevel(
//                           LEVEL_TYPES.PLAYER
//                       ) <= 20
//                   ) {
//                       Player.getInstance().updateLuckBuff(-LUCK_BUFF)
//                   } else {
//                       Player.getInstance().updateLuckBuff(
//                           -LEVEL_20_LUCK_BUFF
//                       )
//                       Player.getInstance().updateCritRate(-CRIT_BUFF)
//                   }
//               })
//           }
//           break
//       case Class.BERSERKER:
//           onButton = SkillsConfig.playerJson["Warriorskill_50.png"]
//           // offButton = "berserkerskillsmiconbw.png"
//           skillEffect = () => {
//               // +8 atk for 5 sec
//               const ATTACK_BUFF =
//                   Player.getInstance().levels.getLevel(
//                       LEVEL_TYPES.PLAYER
//                   ) * 10

//               const LEVEL_20_ATTACK_BUFF =
//                   Player.getInstance().levels.getLevel(
//                       LEVEL_TYPES.PLAYER
//                   ) *
//                       5 +
//                   120

//               if (
//                   Player.getInstance().levels.getLevel(
//                       LEVEL_TYPES.PLAYER
//                   ) <= 20
//               ) {
//                   Player.getInstance().updateAtkBuff(ATTACK_BUFF)
//               } else {
//                   Player.getInstance().updateAtkBuff(LEVEL_20_ATTACK_BUFF)
//               }

//               setTimeout(6 * 1000, () => {
//                   if (
//                       Player.getInstance().levels.getLevel(
//                           LEVEL_TYPES.PLAYER
//                       ) <= 20
//                   ) {
//                       Player.getInstance().updateAtkBuff(-ATTACK_BUFF)
//                   } else {
//                       Player.getInstance().updateAtkBuff(
//                           -LEVEL_20_ATTACK_BUFF
//                       )
//                   }
//               })
//           }
//           break
//       case Class.MAGE:
//           onButton = SkillsConfig.playerJson["Mageskill_00.png"]
//           // offButton = "mageskillsmiconbw.png"
//           skillEffect = () => {
//               // +50% def for 5 sec
//               const MAGIC_BUFF = 50

//               const LEVEL_20_MAGIC_BUFF = 150
//               //const LEVEL_20_LUCK_BUFF = 20

//               if (
//                   Player.getInstance().levels.getLevel(
//                       LEVEL_TYPES.PLAYER
//                   ) <= 20
//               ) {
//                   Player.getInstance().updateMagic(MAGIC_BUFF)
//               } else {
//                   Player.getInstance().updateMagic(LEVEL_20_MAGIC_BUFF)
//                   //Player.getInstance().updateLuckBuff(LEVEL_20_LUCK_BUFF)
//               }

//               setTimeout(12 * 1000, () => {
//                   if (
//                       Player.getInstance().levels.getLevel(
//                           LEVEL_TYPES.PLAYER
//                       ) <= 20
//                   ) {
//                       Player.getInstance().updateMagic(-MAGIC_BUFF)
//                   } else {
//                       Player.getInstance().updateMagic(
//                           -LEVEL_20_MAGIC_BUFF
//                       )

//                       Player.getInstance().refillHealthBar(0.2)
//                   }
//               })
//           }
//           break
//       case Class.DOLLIE:
//           let canSplashAttack = true
//           onButton = SkillsConfig.playerJson["Skill_294.png"]
//           // offButton = "TransformUnav.png"
//           skillEffect = () => {
//               if (canSplashAttack) {
//                   // Splash Attack all engaged enemies
//                   for (let entity of engagedMonsters.entities) {
//                       if (entity instanceof Monster) {
//                           entity.performAttack(
//                               Player.getInstance().getPlayerAttack(),
//                               false
//                           )
//                       }
//                   }
//                   Player.getInstance().attackAnimation()
//                   canSplashAttack = false

//                   applyRedSkillEffectToLocation(
//                       Camera.instance.feetPosition,
//                       2000
//                   )
//               }

//               setTimeout(5 * 1000, () => {
//                   canSplashAttack = true
//               })
//           }

//           cooldown = 5
//           break
//   }
