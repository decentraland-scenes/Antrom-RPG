import { Color4 } from '@dcl/sdk/math'
import { SkillController } from '.'
import { monsterModifiers } from '../../enemies/skillEffects'
import { SKILL_DATA } from '../../ui/bottom-bar/skillsData'
import { setTimeout } from '../../utils/lib'
import { Player } from '../player'
import { engine, Transform } from '@dcl/sdk/ecs'
import { applyDefSkillEffectToLocation, applyGeneralSkillEffectToLocation } from '../../effects/allEffects'

export class BerserkerBloodDance extends SkillController {
  constructor() {
    super(SKILL_DATA.BERSERKER_BLOOD_DANCE)
  }

  effect(): void {
    const missingHp =
      Player.getInstance().maxHealth - Player.getInstance().health
    const attackBuff = missingHp * 4 // Increase attack by 400% of missing HP
    if (Player.globalHasSkill) {
      Player.getInstance().updateAtkBuff(attackBuff)
      setTimeout(() => {
        Player.getInstance().updateAtkBuff(-attackBuff)
      }, 12 * 1000)
    } else {
      Player.getInstance().gameController.uiController.displayAnnouncement(
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
              replaceHealthAmount / Player.getInstance().maxHealth
            Player.getInstance().refillHealthBar(replaceHealthPercentage, true)
          }
        }
      )
    } else {
      Player.getInstance().gameController.uiController.displayAnnouncement(
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
      Player.getInstance().gameController.uiController.displayAnnouncement(
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
      Player.getInstance().gameController.uiController.displayAnnouncement(
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
      Player.getInstance().gameController.uiController.displayAnnouncement(
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
      Player.getInstance().gameController.uiController.displayAnnouncement(
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
      Player.getInstance().gameController.uiController.displayAnnouncement(
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
      Player.getInstance().gameController.uiController.displayAnnouncement(
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
    super(SKILL_DATA.CLERIC_SMITE_EVIL)
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
      Player.getInstance().gameController.uiController.displayAnnouncement(
        'Player skills blocked',
        Color4.Yellow(),
        1000
      )
      console.log('Player has no skills')
    }
  }
}