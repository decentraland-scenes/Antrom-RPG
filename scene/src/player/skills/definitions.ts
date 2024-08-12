import { engine, Transform } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { SkillController } from '.'
import {
  applyAttackedEnemyEffectToLocation,
  applyDefSkillEffectToLocation,
  applyFlameAuraToLocation,
  applyFullBlueSkillEffectToLocation,
  applyFullWhiteSkillEffectToLocation,
  applyGeneralSkillEffectToLocation,
  applyHealToLocation,
  applyPlayerSkillBladesEffectToLocation,
  applyPurpleSwirlToLocation,
  applyRainbowSwirlToLocation,
  applyRedSkillEffectToLocation,
  applyRedSwirlToLocation,
  applySphereEnergyToLocation,
  applyWhiteSwirlToLocation
} from '../../effects/allEffects'
import MonsterOligar from '../../enemies/monster'
import { shootArrow } from '../../enemies/monsterAttackRanged'
import { monsterModifiers } from '../../enemies/skillEffects'
import { ITEM_TYPES } from '../../inventory/playerInventoryMap'
import { SKILL_DATA } from '../../ui/bottom-bar/skillsData'
import { CharacterClasses } from '../../ui/creation-player/creationPlayerData'
import { setTimeout } from '../../utils/lib'
import { Player } from '../player'
import { currentlyAttackingMontserList } from '../../enemies/splashAttack'

export let activeSkillsCount = 0

export class BerserkerBloodDance extends SkillController {
  constructor() {
    super(SKILL_DATA.BERSERKER_BLOOD_DANCE)
  }

  effect(): void {
    const player = Player.getInstance()
    const missingHp = player.maxHealth - player.health
    const attackBuff = missingHp * 4 // Increase attack by 400% of missing HP
    if (Player.globalHasSkill) {
      player.updateAtkBuff(attackBuff)
      setTimeout(() => {
        player.updateAtkBuff(-attackBuff)
      }, 12 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class BerserkerBloodFury extends SkillController {
  constructor() {
    super(SKILL_DATA.BERSERKER_BLOOD_FURY)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      monsterModifiers.addActiveSkill(
        9 * 1000,
        'blood_fury',
        (
          isCriticalAttack: boolean,
          isPlayerAttack: boolean,
          attackAmount: number
        ) => {
          console.log('blood fury', isPlayerAttack, attackAmount)
          if (isPlayerAttack) {
            const replaceHealthAmount = attackAmount * 0.1
            const replaceHealthPercentage =
              replaceHealthAmount / player.maxHealth
            player.refillHealthBar(replaceHealthPercentage, true)
          }
        }
      )
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class BerserkerDeathStrike extends SkillController {
  constructor() {
    super(SKILL_DATA.BERSERKER_DEATH_STRIKE)
  }

  effect(): void {
    const player = Player.getInstance()
    const missingHp = player.health * 0.15
    const attackBuff = 1 * player.getPlayerAttack(false)
    if (Player.globalHasSkill) {
      player.reduceHealth(missingHp)
      player.updateAtkBuff(attackBuff)
      setTimeout(() => {
        player.updateAtkBuff(-attackBuff)
      }, 6 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class BerserkerFuryMomentum extends SkillController {
  constructor() {
    super(SKILL_DATA.BERSERKER_FURYS_MOMENTUM)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      monsterModifiers.addActiveSkill(
        15 * 1000,
        'Fury_Momentum',
        (
          isCriticalAttack: boolean,
          isPlayerAttack: boolean,
          attackAmount: number
        ) => {
          console.log('blood fury', isPlayerAttack, attackAmount)
          if (isPlayerAttack) {
            const LUCK_BUFF_PERCENT = 7
            player.updateLuckBuff(LUCK_BUFF_PERCENT)

            setTimeout(() => {
              player.updateLuckBuff(-LUCK_BUFF_PERCENT)
            }, 15 * 1000)
          }
        }
      )
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class BerserkerRampage extends SkillController {
  constructor() {
    super(SKILL_DATA.BERSERKER_RAMPAGE)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      monsterModifiers.addActiveSkill(
        15 * 1000,
        'Rampage',
        (
          isCriticalAttack: boolean,
          isPlayerAttack: boolean,
          attackAmount: number
        ) => {
          console.log('Rampage', isPlayerAttack, attackAmount)
          if (isPlayerAttack) {
            const ATTACK_BUFF = 100
            player.updateAtkBuff(ATTACK_BUFF)

            setTimeout(() => {
              player.updateAtkBuff(-ATTACK_BUFF)
            }, 15 * 1000)
          }
        }
      )
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class BerserkerSavagePrecision extends SkillController {
  constructor() {
    super(SKILL_DATA.BERSERKER_SAVAGE_PRECISION)
  }

  effect(): void {
    const LUCK_DEBUFF_PERCENT = 8
    const CRIT_BUFF_PERCENT = 50
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      player.updateLuckBuff(-LUCK_DEBUFF_PERCENT)
      player.updateCritRate(CRIT_BUFF_PERCENT)
      setTimeout(() => {
        player.updateLuckBuff(LUCK_DEBUFF_PERCENT)
        player.updateCritRate(-CRIT_BUFF_PERCENT)
      }, 9 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class ClericGeraldsBlessing extends SkillController {
  constructor() {
    super(SKILL_DATA.CLERIC_GERALDS_BLESSING)
  }

  effect(): void {
    const player = Player.getInstance()
    const MAX_HEALTH_BUFF_PERCENT = player.maxHealth * 0.05

    if (Player.globalHasSkill) {
      player.updateMaxHp(MAX_HEALTH_BUFF_PERCENT)

      setTimeout(() => {
        player.updateMaxHp(-MAX_HEALTH_BUFF_PERCENT)
      }, 10 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class ClericHealingTouch extends SkillController {
  constructor() {
    super(SKILL_DATA.CLERIC_HEALING_TOUCH)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      player.refillHealthBar(1, true)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class ClericHolyRetribution extends SkillController {
  constructor() {
    super(SKILL_DATA.CLERIC_HOLYRETRIBUTION)
  }

  effect(): void {
    const player = Player.getInstance()
    const CRITRATE_BUFF = player.maxHealth / 100

    if (Player.globalHasSkill) {
      player.updateCritRate(CRITRATE_BUFF)
      setTimeout(() => {
        player.updateCritRate(-CRITRATE_BUFF)
      }, 15 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class ClericProtectorBlessing extends SkillController {
  constructor() {
    super(SKILL_DATA.CLERIC_PROTECTORSBLESSING)
  }

  effect(): void {
    const player = Player.getInstance()
    const ATTACK_BUFF = player.maxHealth * 0.1

    if (Player.globalHasSkill) {
      player.updateAtkBuff(ATTACK_BUFF)
      applyGeneralSkillEffectToLocation(
        Transform.get(engine.CameraEntity).position,
        2000
      )
      setTimeout(() => {
        player.updateAtkBuff(-ATTACK_BUFF)
      }, 15 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class ClericSacredBarrier extends SkillController {
  constructor() {
    super(SKILL_DATA.CLERIC_SACREDBARRIER)
  }

  effect(): void {
    const player = Player.getInstance()
    const DEF_BUFF_PERCENT = 0.15
    const MAX_HEALTH = player.maxHealth
    const DEF_BUFF = MAX_HEALTH * DEF_BUFF_PERCENT
    const DEF_BUFF_PERCENT_BUFF = DEF_BUFF / 100

    if (Player.globalHasSkill) {
      player.updateDefBuff(DEF_BUFF_PERCENT_BUFF)
      applyDefSkillEffectToLocation(
        Transform.get(engine.CameraEntity).position,
        10000
      )
      setTimeout(() => {
        player.updateDefBuff(-DEF_BUFF_PERCENT_BUFF)
      }, 10 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class ClericSmiteEvil extends SkillController {
  constructor() {
    super(SKILL_DATA.CLERIC_SMITE_EVIL)
  }

  // attackEngagedMonsters(time:number): void {
  //   setTimeout(() => {
  //   for (const entity of engagedMonsters.entities) {
  //     if (entity instanceof MonsterMob || entity instanceof MonsterMobAuto || entity instanceof MonsterOligar) {
  //       entity.performAttack(
  //         player.getPlayerAttack(),
  //         false
  //       )
  //     }
  //     }
  //   }, time)
  // }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      // TODO SPLASH ATTACK LOGIC
      // this.attackEngagedMonsters(0)
      // this.attackEngagedMonsters(2000)
      // this.attackEngagedMonsters(4000)
      // this.attackEngagedMonsters(6000)
      console.error('TODO: SPLASH ATTACK LOGIC')
      player.attackAnimation()
      applyFullWhiteSkillEffectToLocation(
        Transform.get(engine.CameraEntity).position,
        8000
      )
      applyHealToLocation(Transform.get(engine.CameraEntity).position)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class MageArcaneMissile extends SkillController {
  constructor() {
    super(SKILL_DATA.MAGE_ARCANE_MISSILE)
  }

  effect(): void {
    if (Player.globalHasSkill) {
      //     // Splash Attack all engaged enemies
      for (const entity of currentlyAttackingMontserList) {
        entity.performAttack(Player.getInstance().getMagic(), false)
      }
      applyFullBlueSkillEffectToLocation(
        Transform.get(engine.CameraEntity).position,
        6000
      )
    } else {
      const player = Player.getInstance()
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class MageArmorSap extends SkillController {
  constructor() {
    super(SKILL_DATA.MAGE_ARMOR_SAP)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      const ATTACK_BUFF = player.getPlayerAttack()
      player.updateAtkBuff(-ATTACK_BUFF)
      player.updateMagic(ATTACK_BUFF)
      setTimeout(() => {
        player.updateAtkBuff(ATTACK_BUFF)
        player.updateMagic(-ATTACK_BUFF)
        activeSkillsCount--
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
      }, 20 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class MageBlink extends SkillController {
  constructor() {
    super(SKILL_DATA.MAGE_BLINK)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      //     //  Blink: Gain 100% Defense and lose 5% Luck for 2R.
      const DEF_BUFF_PERCENT = 100
      player.updateDefBuff(DEF_BUFF_PERCENT)
      const LUCK_DEBUFF_PERCENT = 100
      player.updateLuckBuff(-LUCK_DEBUFF_PERCENT)
      applyDefSkillEffectToLocation(
        Transform.get(engine.CameraEntity).position,
        12000
      )
      setTimeout(() => {
        player.updateDefBuff(-DEF_BUFF_PERCENT)
        player.updateLuckBuff(LUCK_DEBUFF_PERCENT)
        activeSkillsCount--
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
      }, 20 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class MageFireball extends SkillController {
  constructor() {
    super(SKILL_DATA.MAGE_FIREBALL)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      monsterModifiers.addActiveSkill(
        6 * 1000,
        'fireball',
        (
          isCriticalAttack: boolean,
          isPlayerAttack: boolean,
          attackAmount: number
          // monster: MonsterGeneric | MonsterAttackRanged | MonsterHealer | MonsterMage | MonsterMeat | MonsterMob | MonsterMobAuto | MonsterPoison
        ) => {
          console.log('fireball', isPlayerAttack, attackAmount)
          if (!isPlayerAttack) {
            console.error('SEE THIS SKILL. Need monster type to perform attack')
            // const counterAttackAmount = attackAmount
            // monster.performAttack(counterAttackAmount, false)
          }
        }
      )
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class MageRestoration extends SkillController {
  constructor() {
    super(SKILL_DATA.MAGE_RESTORATION)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      monsterModifiers.addActiveSkill(
        15 * 1000,
        'Restoration',
        (
          isCriticalAttack: boolean,
          isPlayerAttack: boolean,
          attackAmount: number
        ) => {
          console.log('Restoration', isPlayerAttack, attackAmount)
          if (isPlayerAttack) {
            const replaceHealthAmount = player.maxHealth * 0.25
            const replaceHealthPercentage =
              replaceHealthAmount / player.maxHealth
            player.refillHealthBar(replaceHealthPercentage, true)
          }
        }
      )
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class MageShadowChains extends SkillController {
  constructor() {
    super(SKILL_DATA.MAGE_SHADOW_CHAINS)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      const amount = 50
      const ATTACK_DEBUFF_PERCENT = amount / 100
      console.log(`Enemy attack: SKILL DAMAGE ${amount}`)
      monsterModifiers.updateAtkDebuff(-ATTACK_DEBUFF_PERCENT)
      applyGeneralSkillEffectToLocation(
        Transform.get(engine.CameraEntity).position,
        2000
      )
      MonsterOligar.setGlobalHasSkill(false)
      setTimeout(() => {
        monsterModifiers.updateAtkDebuff(ATTACK_DEBUFF_PERCENT)
        MonsterOligar.setGlobalHasSkill(true)
      }, 20 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class Example extends SkillController {
  constructor() {
    super(SKILL_DATA.MAGE_ARMOR_SAP)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)

      const ATTACK_BUFF = player.getPlayerAttack()

      player.updateAtkBuff(-ATTACK_BUFF)
      player.updateMagic(ATTACK_BUFF)

      setTimeout(() => {
        activeSkillsCount--
        console.log('activeSkillsCount ', activeSkillsCount)
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateAtkBuff(ATTACK_BUFF)
        player.updateMagic(-ATTACK_BUFF)
      }, 20 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class ThiefSwiftFoot extends SkillController {
  constructor() {
    super(SKILL_DATA.THIEF_SWIFTFOOT)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      const LUCK_BUFF_PERCENT = 20
      player.updateLuckBuff(LUCK_BUFF_PERCENT)
      setTimeout(() => {
        activeSkillsCount--
        console.log('activeSkillsCount ', activeSkillsCount)
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateLuckBuff(-LUCK_BUFF_PERCENT)
      }, 14 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class ThiefShadowStrike extends SkillController {
  constructor() {
    super(SKILL_DATA.THIEF_SHADOWSTRIKE)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      // Shadowstrike: Double your critical rate for 4R.
      const CRITRATE_BUFF = player.getLuckBuffs()
      player.updateCritRate(CRITRATE_BUFF * 3)
      setTimeout(() => {
        activeSkillsCount--
        console.log('activeSkillsCount ', activeSkillsCount)
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateCritRate(-CRITRATE_BUFF * 3)
      }, 8 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class ThiefFortunesFavor extends SkillController {
  constructor() {
    super(SKILL_DATA.THIEF_FORTUNES_FAVOR)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      // Fortune's Favor: If your next roll is successful, heal the 50% of your max HP.
      monsterModifiers.addActiveSkill(
        12 * 1000,
        'recoil_shot',
        (
          isCriticalAttack: boolean,
          isPlayerAttack: boolean,
          attackAmount: number
          // TODO: Is monster necessary here?
          // monster
        ) => {
          console.log('recoil shot', isPlayerAttack, attackAmount)
          if (isPlayerAttack) {
            player.refillHealthBar(0.25, true)
          }
        }
      )
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class ThiefStoneHeart extends SkillController {
  constructor() {
    super(SKILL_DATA.THIEF_STONEHEART)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      const player = Player.getInstance()
      const DEF_BUFF_PERCENT = player.getLuckBuffs() / 100
      // ui.displayAnnouncement(`${DEF_BUFF_PERCENT}`)
      player.updateDefBuff(DEF_BUFF_PERCENT)
      applyDefSkillEffectToLocation(
        Transform.get(engine.CameraEntity).position,

        12000
      )
      setTimeout(() => {
        activeSkillsCount--
        console.log('activeSkillsCount ', activeSkillsCount)
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateDefBuff(-DEF_BUFF_PERCENT)
      }, 12 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class ThiefBleedForMe extends SkillController {
  constructor() {
    super(SKILL_DATA.THIEF_BLEED_FOR_ME)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      monsterModifiers.addActiveSkill(
        20 * 1000,
        'Bleed For Me',
        (
          isCriticalAttack: boolean,
          isPlayerAttack: boolean,
          attackAmount: number
        ) => {
          console.log('Bleed For Me', isPlayerAttack, attackAmount)
          if (isPlayerAttack) {
            const LUCK = player.getLuckBuffs()
            const ATTACK_BUFF_PERCENT = LUCK * 30
            player.updateAtkBuff(ATTACK_BUFF_PERCENT)
            // TODO:  createAttackIncreasedLabel()
            player.gameController.uiController.displayAnnouncement(
              `ATTACK INCREASED!`,
              Color4.Yellow(),
              1000
            )
            setTimeout(() => {
              activeSkillsCount--
              console.log('activeSkillsCount ', activeSkillsCount)
              if (activeSkillsCount > 0) {
                // At least one skill is active
                Player.setGlobalHasSkillActive(true)
              } else {
                // No skill is active
                Player.setGlobalHasSkillActive(false)
              }
              player.updateAtkBuff(-ATTACK_BUFF_PERCENT)
            }, 20 * 1000)
          }
        }
      )
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class ThiefLastBlow extends SkillController {
  constructor() {
    super(SKILL_DATA.THIEF_LAST_BLOW)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      // // Last Blow: Gain 100 Attack and 30% Luck for 1R.
      const ATTACK_BUFF = 1500
      const LUCK_BUFF_PERCENT = 100
      player.updateLuckBuff(LUCK_BUFF_PERCENT)
      player.updateAtkBuff(ATTACK_BUFF)
      applyGeneralSkillEffectToLocation(
        Transform.get(engine.CameraEntity).position,

        2000
      )
      setTimeout(() => {
        activeSkillsCount--
        console.log('activeSkillsCount ', activeSkillsCount)
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateLuckBuff(-LUCK_BUFF_PERCENT)
        player.updateAtkBuff(-ATTACK_BUFF)
        player.reduceHealth(player.maxHealth * 0.5)
      }, 16 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
    // Then decrease your base Attack value by 30% till end of combat. harder
  }
}

export class RangerDeadlyPrecision extends SkillController {
  constructor() {
    super(SKILL_DATA.RANGER_DEADLY_PRECISION)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      // Deadly Precision: Gain 30% Critical chance for 5R.
      const CRIT_BUFF_PERCENT = 30
      player.updateCritRate(CRIT_BUFF_PERCENT)
      setTimeout(() => {
        activeSkillsCount--
        console.log('activeSkillsCount ', activeSkillsCount)
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateCritRate(-CRIT_BUFF_PERCENT)
      }, 12 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class RangerSavageStrike extends SkillController {
  constructor() {
    super(SKILL_DATA.RANGER_SAVAGE_STRIKE)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      // Savage Strike: Gain 200% Damage on your critical attacks for 3R.
      const CRITDAMAGE_BUFF_PERCENT = 200
      player.updateCritRate(CRITDAMAGE_BUFF_PERCENT)
      setTimeout(() => {
        activeSkillsCount--
        console.log('activeSkillsCount ', activeSkillsCount)
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateCritRate(-CRITDAMAGE_BUFF_PERCENT)
      }, 12 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class RangerMightyShot extends SkillController {
  constructor() {
    super(SKILL_DATA.RANGER_MIGHTY_SHOT)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      // Mighty Shot: Your Attacks deal 45% more damage for 4R.
      const ATK_BUFF_PERCENT = 3 * player.getPlayerAttack(false)
      player.updateAtkBuff(ATK_BUFF_PERCENT)
      setTimeout(() => {
        activeSkillsCount--
        console.log('activeSkillsCount ', activeSkillsCount)
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateAtkBuff(-ATK_BUFF_PERCENT)
      }, 9 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class RangerPoisonArrows extends SkillController {
  constructor() {
    super(SKILL_DATA.RANGER_POISON_ARROWS)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      // Poison Arrows: Opponent loses 20 HP each 1 second for 8R. med
      monsterModifiers.addActiveSkill(
        20 * 1000,
        'poison_arrows',
        (
          isCriticalAttack: boolean,
          isPlayerAttack: boolean,
          attackAmount: number,
          monster: any // NEED TO TYPE
        ) => {
          // if (!isPlayerAttack) {
          //   const damageOverTime = player.getPlayerAttack() // Adjust damage per tick as needed
          //   const tickInterval = 2000 // Adjust interval between ticks as needed
          //   let poisonDamageApplied = false // New variable to track poison damage application
          //   player.gameController.uiController.displayAnnouncement(
          //     'POISON TAKES EFFECT!'
          //   )
          //   console.log('before')
          //   // @ts-expect-error
          //   const timer = setInterval(() => {
          //     if (Player.globalHasSkill) {
          //       monster.takeDamage(damageOverTime)
          //       if (!poisonDamageApplied) {
          //         player.gameController.uiController.displayAnnouncement(
          //           'POISON HIT!',
          //           Color4.Yellow(),
          //           1
          //         )
          //         poisonDamageApplied = true
          //       }
          //       console.log('monster is taking damage')
          //     } else {
          //       player.gameController.uiController.displayAnnouncement(
          //         'POISON BLOCKED!',
          //         Color4.Yellow(),
          //         1
          //       )
          //     }
          //   }, tickInterval)
          //   setTimeout(() => {
          //     if (monster.health > 0) {
          //       // @ts-expect-error
          //       clearInterval(timer) // Stop the DOT when the poison duration is over
          //       player.gameController.uiController.displayAnnouncement(
          //         'POISON DONE!',
          //         Color4.Yellow(),
          //         1
          //       )
          //     }
          //   }, 20 * 1000)
          //   if (monster.health <= 0) {
          //     // @ts-expect-error
          //     clearInterval(timer) // Stop the DOT if the monster is defeated
          //   }
          // } else {
          //   player.gameController.uiController.displayAnnouncement(
          //     'POISON ARROW MISSED!',
          //     Color4.Yellow(),
          //     1
          //   )
          // }
        }
      )
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class RangerVitalShot extends SkillController {
  constructor() {
    super(SKILL_DATA.RANGER_VITAL_SHOT)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      // Vital Shot: Heal 50% of your max HP when you deal critical damage for 4R. med
      monsterModifiers.addActiveSkill(
        20 * 1000,
        'vital_shot',
        (isCriticalAttack: boolean) => {
          console.log('vital shot', isCriticalAttack)
          if (isCriticalAttack) {
            player.refillHealthBar(1, true)
          }
        }
      )
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class RangerRecoilShot extends SkillController {
  constructor() {
    super(SKILL_DATA.RANGER_RECOIL_SHOT)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      // Recoil Shot: Deal 50% of your inflicted damage back to the enemy for 4R. harder
      monsterModifiers.addActiveSkill(
        15 * 1000,
        'recoil_shot',
        (
          isCriticalAttack: boolean,
          isPlayerAttack: boolean,
          attackAmount: number,
          monster: any // TODO: SET TYPE
        ) => {
          console.log('recoil shot', isPlayerAttack, attackAmount)
          if (!isPlayerAttack) {
            const counterAttackAmount = attackAmount * 1.5
            monster.performAttack(counterAttackAmount, false)
          }
        }
      )
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

// TODO
export class GeneralDisruptiveBlow extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_DISRUPTIVE_BLOW)
  }

  async effect(): Promise<void> {
    // const isWearableFound = checkWearableInUserData(
    //     //HATCHETS
    //   "0xa5d8a8c3454aa003ad72c3f814e52ad6bea69e57:0"
    // )
    const player = Player.getInstance()
    activeSkillsCount++
    // const damageOverTime = 60 // Adjust bleeding damage per tick as needed
    // const tickInterval = 2000 // Adjust interval between ticks as needed
    const ATTACK_BUFF = 50
    player.updateAtkBuff(ATTACK_BUFF)
    const playerPos =
      Transform.getOrNull(engine.PlayerEntity)?.position ?? Vector3.Zero()
    applyRedSwirlToLocation(playerPos, 2000)
    setTimeout(() => {
      activeSkillsCount--
      if (activeSkillsCount > 0) {
        // At least one skill is active
        Player.setGlobalHasSkillActive(true)
      } else {
        // No skill is active
        Player.setGlobalHasSkillActive(false)
      }
      player.updateAtkBuff(-ATTACK_BUFF)
    }, 6 * 1000)
    // if ((await isWearableFound) === true) {
    //   monsterModifiers.addActiveSkill(
    //     30 * 1000,
    //     'disruptive_blow',
    //     (
    //       isCriticalAttack: boolean,
    //       isPlayerAttack: boolean,
    //       attackAmount: number,
    //       // NEED TO SET TYPE
    //       monster: any
    //     ) => {
    //       if (!isPlayerAttack) {
    //         player.gameController.uiController.displayAnnouncement(
    //           'BLEEDING STARTS!'
    //         )
    //         console.log('before')
    //         let bleedingDamageApplied = false // New variable to track bleeding damage application
    //         const timer = setInterval(() => {
    //           monster.takeDamage(damageOverTime)
    //           if (!bleedingDamageApplied) {
    //             player.gameController.uiController.displayAnnouncement(
    //               'BLEEDING DAMAGE!',
    //               Color4.Yellow(),
    //               1
    //             )
    //             bleedingDamageApplied = true
    //           }
    //           console.log('monster is taking bleeding damage')
    //         }, tickInterval)
    //         setTimeout(() => {
    //           if (monster.health > 0) {
    //             clearInterval(timer) // Stop the bleeding if the monster is still alive
    //             player.gameController.uiController.displayAnnouncement(
    //               'BLEEDING STOPS!',
    //               Color4.Yellow(),
    //               1
    //             )
    //           }
    //         }, 30 * 1000) // 60 seconds
    //       } else {
    //         player.gameController.uiController.displayAnnouncement(
    //           'SKILL MISSED!',
    //           Color4.Yellow(),
    //           1
    //         )
    //       }
    //     }
    //   )
    // } else {
    //   player.gameController.uiController.displayAnnouncement(
    //     'Need wearable to activate!',
    //     Color4.Yellow(),
    //     1
    //   )
    // }
  }
}

export class GeneralFirstAidKit extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_FIRST_AID_KIT)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      player.refillHealthBar(0.25, true)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralFireball extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_FIREBALL)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      // Splash Attack all engaged enemies
      console.log(
        'amount of monsters in being attack with skill is: ',
        currentlyAttackingMontserList.length
      )
      for (const entity of currentlyAttackingMontserList) {
        entity.performAttack(Player.getInstance().getPlayerAttack(), false)
      }
      player.attackAnimation()
      applyAttackedEnemyEffectToLocation(
        Transform.get(engine.CameraEntity).position,
        5000
      )
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skill blocked'
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralStorm extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_STORM)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      console.log(
        'amount of monsters in being attack with skill is: ',
        currentlyAttackingMontserList.length
      )
      for (const entity of currentlyAttackingMontserList) {
        entity.performAttack(Player.getInstance().getMagic(), false)
      }
      player.attackAnimation()
      applyFullWhiteSkillEffectToLocation(
        Transform.get(engine.CameraEntity).position,

        5000
      )
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skill blocked'
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralLuckyCharm extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_LUCKY_CHARM)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      const LUCK_BUFF_PERCENT = 10
      player.updateLuckBuff(LUCK_BUFF_PERCENT)
      // TODO NEED THIS EFFECT
      applyWhiteSwirlToLocation(Transform.get(engine.CameraEntity).position, 1)
      setTimeout(() => {
        activeSkillsCount--
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateLuckBuff(-LUCK_BUFF_PERCENT)
      }, 9 * 1000) // 9 seconds in milliseconds
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralPrecisionFocus extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_PRECISION_FOCUS)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      const CRIT_RATE_BUFF_PERCENT = 30
      player.updateCritRate(CRIT_RATE_BUFF_PERCENT)
      // TODO Need this effect
      applyPurpleSwirlToLocation(Transform.get(engine.CameraEntity).position, 1)
      setTimeout(() => {
        activeSkillsCount--
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateCritRate(-CRIT_RATE_BUFF_PERCENT)
      }, 9 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralDefensivePosture extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_DEFENSIVE_POSTURE)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      for (const entity of currentlyAttackingMontserList) {
        entity.performAttack(Player.getInstance().getPlayerAttack(), false)
      }
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skill blocked'
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralStrike extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_STRIKE)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      // Player.setGlobalHasSkillActive(true)
      shootArrow()
      player.attackAnimation()
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralIronDefense extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_IRON_DEFENSE)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)

      const DEFENSE_BUFF_PERCENT = 0.25
      player.updateDefBuff(DEFENSE_BUFF_PERCENT)
      applyDefSkillEffectToLocation(
        Transform.get(engine.CameraEntity).position,
        2000
      )
      setTimeout(() => {
        activeSkillsCount--
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateDefBuff(-DEFENSE_BUFF_PERCENT)
      }, 6 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}
export class GeneralVitalitySurge extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_VITALITY_SURGE)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      const MAX_HEALTH_BUFF_PERCENT = player.maxHealth * 0.1
      player.updateMaxHp(MAX_HEALTH_BUFF_PERCENT)
      setTimeout(() => {
        activeSkillsCount--
        console.log('activeSkillsCount ', activeSkillsCount)
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateMaxHp(-MAX_HEALTH_BUFF_PERCENT)
      }, 15 * 1000)

      applyWhiteSwirlToLocation(Transform.get(engine.CameraEntity).position, 1)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralVitalityBoost extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_VITALITY_BOOST)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      //     // PROTECTORSBLESSING: Gain Attack equal to 25% of your MAX HP for 10 secs. 20 sec cooldown
      const ATTACK_BUFF = player.maxHealth * 0.25
      player.updateAtkBuff(ATTACK_BUFF)
      applySphereEnergyToLocation(
        Transform.get(engine.CameraEntity).position,
        1
      )
      applyFlameAuraToLocation(Transform.get(engine.CameraEntity).position, 1)
      setTimeout(() => {
        activeSkillsCount--
        console.log('activeSkillsCount ', activeSkillsCount)
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateAtkBuff(-ATTACK_BUFF)
      }, 15 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralShieldWall extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_SHIELD_WALL)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      const player = Player.getInstance()

      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      const DEF_BUFF_PERCENT = 0.5
      player.updateDefBuff(DEF_BUFF_PERCENT)
      applyDefSkillEffectToLocation(
        Transform.get(engine.CameraEntity).position,

        2000
      )
      setTimeout(() => {
        activeSkillsCount--
        console.log('activeSkillsCount ', activeSkillsCount)
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateDefBuff(-DEF_BUFF_PERCENT)
      }, 12 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralHammerShot extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_HAMMER_SHOT)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      for (const entity of currentlyAttackingMontserList) {
        entity.performAttack(Player.getInstance().getPlayerAttack(), false)
      }
      player.attackAnimation()
      applyRedSkillEffectToLocation(
        Transform.get(engine.CameraEntity).position,

        3000
      )
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralDefensiveAura extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_DEFENSIVE_AURA)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      //     //  Decrease the attack value of your opponent by 50% for 5R.
      let MAGIC_BUFF = player.getMagic() * 2
      if (player.class === CharacterClasses.CC_MAGE) {
        MAGIC_BUFF = player.getMagic() * 3
      }
      player.updateMagic(MAGIC_BUFF)
      setTimeout(() => {
        activeSkillsCount--
        console.log('activeSkillsCount ', activeSkillsCount)
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateMagic(-MAGIC_BUFF)
      }, 12 * 1000)
      applyPurpleSwirlToLocation(Transform.get(engine.CameraEntity).position, 1)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralSoulRelease extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_SOULRELEASE)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      //     // PROTECTORSBLESSING: Gain Attack equal to 25% of your MAX HP for 10 secs. 20 sec cooldown
      const MAGIC_BUFF = player.maxHealth * 0.05
      player.updateMagic(MAGIC_BUFF)
      applyFlameAuraToLocation(Transform.get(engine.CameraEntity).position, 1)
      setTimeout(() => {
        activeSkillsCount--
        console.log('activeSkillsCount ', activeSkillsCount)
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateMagic(-MAGIC_BUFF)
      }, 15 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralMightyAssault extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_MIGHTY_ASSAULT)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      //     // Mighty Assault: Increase attack damage by 30% for 10 s.
      const ATTACK_DAMAGE_BUFF = player.getPlayerAttack() * 0.3
      player.updateAtkBuff(ATTACK_DAMAGE_BUFF)
      applyFlameAuraToLocation(Transform.get(engine.CameraEntity).position, 1)
      setTimeout(() => {
        activeSkillsCount--
        console.log('activeSkillsCount ', activeSkillsCount)
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateAtkBuff(-ATTACK_DAMAGE_BUFF)
      }, 8 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralFortressOfResilience extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_FORTRESS_OF_RESILIENCE)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      if (player.inventory.getItemCount(ITEM_TYPES.POTION) >= 1) {
        player.inventory.reduceItem(ITEM_TYPES.POTION, 1)
        // TODO
        // player.writeDataToServer()
        player.refillHealthBar(0.25)
        player.gameController.uiController.displayAnnouncement(
          '25% health Restored'
        )
      } else {
        player.gameController.uiController.displayAnnouncement(
          'No more potions'
        )
      }
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked'
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralOathToDemonKing extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_OATH_TO_DEMON_KING)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      applyRainbowSwirlToLocation(
        Transform.get(engine.CameraEntity).position,
        1
      )
      player.reduceHealth(player.maxHealth * 0.9)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralGodricsBlessing extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_GODRICS_BLESSING)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      const LUCK_DEBUFF_PERCENT = 90
      player.updateLuckBuff(-LUCK_DEBUFF_PERCENT)
      applyRainbowSwirlToLocation(
        Transform.get(engine.CameraEntity).position,
        1
      )
      setTimeout(() => {
        activeSkillsCount--
        console.log('activeSkillsCount ', activeSkillsCount)
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateLuckBuff(LUCK_DEBUFF_PERCENT)
      }, 30 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralConfusingBlades extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_CONFUSING_BLADES)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      //     //Player.setGlobalHasSkillActive(true)
      monsterModifiers.addActiveSkill(
        9 * 1000,
        'confusing_blades',
        (
          isCriticalAttack: boolean,
          isPlayerAttack: boolean,
          attackAmount: number,
          // TODO set TYPE
          monster: any
        ) => {
          console.log('confusing_blades', isPlayerAttack, attackAmount)
          if (!isPlayerAttack) {
            const counterAttackAmount = attackAmount * 0.7
            monster.performAttack(counterAttackAmount, false)
          }
        }
      )
      applyPlayerSkillBladesEffectToLocation(
        Transform.get(engine.CameraEntity).position,
        9000 // Duration in milliseconds
      )
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

// TODO
export class GeneralVenomousBlade extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_VENOMOUS_BLADE)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      //     // Venomous Blade: Inflict damage over time to opponents.
      monsterModifiers.addActiveSkill(
        6 * 1000,
        'venomous_blade',
        (
          isCriticalAttack: boolean,
          isPlayerAttack: boolean,
          attackAmount: number,
          // TODO: set TYPE
          monster: any
        ) => {
          // if (!isPlayerAttack) {
          //   const damageOverTime = 200 // Adjust damage per tick as needed
          //   const tickInterval = 2000 // Adjust interval between ticks as needed
          //   let poisonDamageApplied = false // New variable to track poison damage application
          //   player.gameController.uiController.displayAnnouncement(
          //     'POISON TAKES EFFECT!'
          //   )
          //   console.log('before')
          //   // TODO: setInterval ??
          //   // @ts-expect-error
          //   const timer = setInterval(() => {
          //     if (Player.globalHasSkill) {
          //       monster.takeDamage(damageOverTime)
          //       if (!poisonDamageApplied) {
          //         // TODO Need this effect
          //         // applyPurpleSwirlToLocation(Transform.get(engine.CameraEntity).position, 5)
          //         poisonDamageApplied = true
          //       }
          //       console.log('monster is taking damage')
          //     }
          //   }, tickInterval)
          //   setTimeout(() => {
          //     if (monster.health > 0) {
          //       // @ts-expect-error
          //       // TODO declare clearInterval
          //       clearInterval(timer) // Stop the DOT when the poison duration is over
          //       player.gameController.uiController.displayAnnouncement(
          //         'POISON DONE!',
          //         Color4.Yellow(),
          //         1
          //       )
          //     }
          //   }, 6 * 1000)
          //   if (monster.health <= 0) {
          //     // @ts-expect-error
          //     clearInterval(timer) // Stop the DOT if the monster is defeated
          //   }
          // } else {
          //   player.gameController.uiController.displayAnnouncement(
          //     'POISON SKILL MISSED!',
          //     Color4.Yellow(),
          //     1
          //   )
          // }
        }
      )
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralSpellCancel extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_SPELL_CANCEL)
  }

  effect(): void {
    MonsterOligar.setGlobalHasSkill(false)
    applyDefSkillEffectToLocation(
      Transform.get(engine.CameraEntity).position,
      2000
    )
    setTimeout(() => {
      MonsterOligar.setGlobalHasSkill(true)
    }, 15 * 1000)
  }
}

export class GeneralVampiricTransfusion extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_Vampiric_Transfusion)
  }

  async effect(): Promise<void> {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      const ATTACK_BUFF = player.getPlayerAttack() // Get player's attack value
      player.updateAtkBuff(-ATTACK_BUFF) // Remove all ATTACK
      player.updateMagic(ATTACK_BUFF) // Add it to MAGIC
      //     // Function to absorb damage as health for the duration of the skill
      const absorbDamage = (isPlayerAttack: boolean): void => {
        if (!isPlayerAttack) {
          const absorbedHealth = player.getMagic()
          player.heal(absorbedHealth)
        }
      }
      // Add modifier to absorb damage as health
      monsterModifiers.addActiveSkill(
        15 * 1000,
        'vampiric_transfusion',
        absorbDamage
      )
      // Reset player's stats after the duration of the skill
      setTimeout(() => {
        activeSkillsCount--
        console.log('activeSkillsCount ', activeSkillsCount)
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateAtkBuff(ATTACK_BUFF) // Restore ATTACK
        player.updateMagic(-ATTACK_BUFF) // Remove MAGIC buff
      }, 30 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralCelestialRetribution extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_Celestial_Retribution)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      const CRITRATE_BUFF = player.getCritRate() * 0.05
      const CRITDMG_BUFF = player.getCritDamage() * 0.05
      const ATTACK_BUFF = player.getPlayerAttack() * 0.05
      const LUCK_BUFF = player.getLuckRange() * 0.05
      const MAGIC_BUFF = player.getMagic() * 0.05
      const DEF_BUFF = player.getDefensePercent() * 0.05
      let count = 0
      // Recoil Shot: Deal 50% of your inflicted damage back to the enemy for 4R. harder
      monsterModifiers.addActiveSkill(
        15 * 1000,
        'recoil_shot',
        (isPlayerAttack: boolean, attackAmount: number, monster: any) => {
          console.log('recoil shot', isPlayerAttack, attackAmount)
          if (!isPlayerAttack) {
            const counterAttackAmount = attackAmount * 1.5
            monster.performAttack(counterAttackAmount, false)
            player.updateAtkBuff(ATTACK_BUFF)
            player.updateMagic(MAGIC_BUFF)
            player.updateCritRate(CRITDMG_BUFF)
            player.updateCritRate(CRITRATE_BUFF)
            player.updateLuckBuff(LUCK_BUFF)
            player.updateDefBuff(DEF_BUFF)
            count++
          }
        }
      )
      setTimeout(() => {
        activeSkillsCount--
        console.log('activeSkillsCount ', activeSkillsCount)
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateAtkBuff(-ATTACK_BUFF * count)
        player.updateMagic(-MAGIC_BUFF * count)
        player.updateCritRate(-CRITDMG_BUFF * count)
        player.updateCritRate(-CRITRATE_BUFF * count)
        player.updateLuckBuff(-LUCK_BUFF * count)
        player.updateDefBuff(-DEF_BUFF * count)
        count = 0
      }, 15 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}

export class GeneralFortunesFavor extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_FORTUNES_FAVOR)
  }

  effect(): void {
    const player = Player.getInstance()

    if (Player.globalHasSkill) {
      Player.setGlobalHasSkillActive(true)
      activeSkillsCount++
      console.log('activeSkillsCount ', activeSkillsCount)
      const CRITRATE_BUFF = player.getCritRate() * 0.05
      const CRITDMG_BUFF = player.getCritDamage() * 0.05
      const ATTACK_BUFF = player.getPlayerAttack() * 0.05
      const LUCK_BUFF = player.getLuckRange() * 0.05
      const MAGIC_BUFF = player.getMagic() * 0.05
      const DEF_BUFF = player.getDefensePercent() * 0.05
      let count = 0
      //     // Recoil Shot: Deal 50% of your inflicted damage back to the enemy for 4R. harder
      monsterModifiers.addActiveSkill(
        20 * 1000,
        'recoil_shot',
        (isPlayerAttack: boolean, attackAmount: number) => {
          console.log('recoil shot', isPlayerAttack, attackAmount)
          if (isPlayerAttack) {
            // monster.performAttack(counterAttackAmount, false)
            player.updateAtkBuff(ATTACK_BUFF)
            player.updateMagic(MAGIC_BUFF)
            player.updateCritRate(CRITDMG_BUFF)
            player.updateCritRate(CRITRATE_BUFF)
            player.updateLuckBuff(LUCK_BUFF)
            player.updateDefBuff(DEF_BUFF)
            count++
          }
        }
      )
      setTimeout(() => {
        activeSkillsCount--
        console.log('activeSkillsCount ', activeSkillsCount)
        if (activeSkillsCount > 0) {
          // At least one skill is active
          Player.setGlobalHasSkillActive(true)
        } else {
          // No skill is active
          Player.setGlobalHasSkillActive(false)
        }
        player.updateAtkBuff(-ATTACK_BUFF * count)
        player.updateMagic(-MAGIC_BUFF * count)
        player.updateCritRate(-CRITDMG_BUFF * count)
        player.updateCritRate(-CRITRATE_BUFF * count)
        player.updateLuckBuff(-LUCK_BUFF * count)
        player.updateDefBuff(-DEF_BUFF * count)
        count = 0
      }, 20 * 1000)
    } else {
      player.gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}
