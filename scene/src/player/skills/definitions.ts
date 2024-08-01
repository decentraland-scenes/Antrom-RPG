import { engine, Transform } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import { SkillController } from '.'
import {
  applyAttackedEnemyEffectToLocation,
  applyDefSkillEffectToLocation,
  applyFullWhiteSkillEffectToLocation,
  applyGeneralSkillEffectToLocation,
  applyHealToLocation
} from '../../effects/allEffects'
import { monsterModifiers } from '../../enemies/skillEffects'
import { SKILL_DATA } from '../../ui/bottom-bar/skillsData'
import { setTimeout } from '../../utils/lib'
import { Player } from '../player'
import { GenericMonster } from '../../enemies/monsterGeneric'
import MonsterOligar from '../../enemies/monster'
import { MonsterAttackRanged } from '../../enemies/monsterAttackRanged'
import MonsterHealer from '../../enemies/monsterHealer'
import MonsterMage from '../../enemies/monsterMage'
import MonsterMeat from '../../enemies/monsterMeat'
import MonsterMob from '../../enemies/MonsterMob'
import MonsterMobAuto from '../../enemies/monsterMobAuto'
import MonsterPoison from '../../enemies/monsterPoison'

export class BerserkerBloodDance extends SkillController {
  constructor() {
    super(SKILL_DATA.BERSERKER_BLOOD_DANCE)
  }

  effect(): void {
    const player = Player.getInstance()
    const missingHp =
      Player.getInstance().maxHealth - Player.getInstance().health
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
  //         Player.getInstance().getPlayerAttack(),
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
    //     if (Player.globalHasSkill) {
    //     // Splash Attack all engaged enemies
    //     for (let entity of engagedMonsters.entities) {
    //         if (entity instanceof MonsterMobAuto) {
    //             entity.performAttack(
    //                 Player.getInstance().getMagic(),
    //                 false
    //             )
    //         }
    //     }
    //     setTimeout(2 * 1000, () => {
    //         for (let entity of engagedMonsters.entities) {
    //             if (entity instanceof MonsterMobAuto) {
    //                 entity.performAttack(
    //                     Player.getInstance().getMagic(),
    //                     false
    //                 )
    //             }
    //         }
    //     })
    //     for (let entity of engagedMonsters.entities) {
    //         if (entity instanceof MonsterMob) {
    //             entity.performAttack(
    //                 Player.getInstance().getMagic(),
    //                 false
    //             )
    //         }
    //     }
    //     setTimeout(2 * 1000, () => {
    //         for (let entity of engagedMonsters.entities) {
    //             if (entity instanceof MonsterMob) {
    //                 entity.performAttack(
    //                     Player.getInstance().getMagic(),
    //                     false
    //                 )
    //             }
    //         }
    //     })
    //     for (let entity of engagedMonsters.entities) {
    //         if (entity instanceof MonsterOligar) {
    //             entity.performAttack(
    //                 Player.getInstance().getMagic(),
    //                 false
    //             )
    //         }
    //     }
    //     setTimeout(2 * 1000, () => {
    //         for (let entity of engagedMonsters.entities) {
    //             if (entity instanceof MonsterOligar) {
    //                 entity.performAttack(
    //                     Player.getInstance().getMagic(),
    //                     false
    //                 )
    //             }
    //         }
    //     })
    //     applyFullBlueSkillEffectToLocation(
    //         Transform.get(engine.CameraEntity).position,

    //         6000
    //     )
    // } else {
    //   player.gameController.uiController.displayAnnouncement(
    //     'Player skills blocked',
    //     Color4.Yellow(),
    //     1000
    //   )
    //   console.log('Player has no skills')
    // }
  }
}

export class MageArmorSap extends SkillController {
  constructor() {
    super(SKILL_DATA.MAGE_ARMOR_SAP)
  }
  
  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
    //   Player.setGlobalHasSkillActive(true)
    //   activeSkillsCount++
    //   log("activeSkillsCount ", activeSkillsCount)
      const ATTACK_BUFF = player.getPlayerAttack()
      player.updateAtkBuff(-ATTACK_BUFF)
      player.updateMagic(ATTACK_BUFF)
      setTimeout(() => {
        player.updateAtkBuff(ATTACK_BUFF)
        player.updateMagic(-ATTACK_BUFF)
         //     activeSkillsCount--
    //     log("activeSkillsCount ", activeSkillsCount)
    //     if (activeSkillsCount > 0) {
    //       // At least one skill is active
    //       Player.setGlobalHasSkillActive(true)
    //     } else {
    //       // No skill is active
    //       Player.setGlobalHasSkillActive(false)
    //     }
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
    //     Player.setGlobalHasSkillActive(true)
    //     activeSkillsCount++
    //     log("activeSkillsCount ", activeSkillsCount)
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
          // activeSkillsCount--
          //         log("activeSkillsCount ", activeSkillsCount)
          //         if (activeSkillsCount > 0) {
          //             // At least one skill is active
          //             Player.setGlobalHasSkillActive(true)
          //         } else {
          //             // No skill is active
          //             Player.setGlobalHasSkillActive(false)
          //         }
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
        // Player.setGlobalHasSkillActive(true)
        monsterModifiers.addActiveSkill(
            6 * 1000,
            "fireball",
            (
                isCriticalAttack: boolean,
                isPlayerAttack: boolean,
                attackAmount: number,
                // monster: MonsterOligar | MonsterAttackRanged | MonsterHealer | MonsterMage | MonsterMeat | MonsterMob | MonsterMobAuto | MonsterPoison
            ) => {
                console.log("fireball", isPlayerAttack, attackAmount)
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
        // Player.setGlobalHasSkillActive(true)
        monsterModifiers.addActiveSkill(
            15 * 1000,
            "Restoration",
            (isCriticalAttack:boolean, isPlayerAttack:boolean, attackAmount:number) => {
                console.log("Restoration", isPlayerAttack, attackAmount)
                if (isPlayerAttack) {
                    const replaceHealthAmount =
                    player.maxHealth * 0.25
                    const replaceHealthPercentage =
                        replaceHealthAmount /
                        player.maxHealth
                        player.refillHealthBar(
                        replaceHealthPercentage,
                        true
                    )
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
        // activeSkillsCount++
        // log("activeSkillsCount ", activeSkillsCount)
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
    // Player.setGlobalHasSkillActive(true)
    // activeSkillsCount++
    // console.log("activeSkillsCount ", activeSkillsCount)
    
    const ATTACK_BUFF = player.getPlayerAttack()
    
    player.updateAtkBuff(-ATTACK_BUFF)
    player.updateMagic(ATTACK_BUFF)

    setTimeout(() => {
        // activeSkillsCount--
        // console.log("activeSkillsCount ", activeSkillsCount)
        // if (activeSkillsCount > 0) {
        //     // At least one skill is active
        //     Player.setGlobalHasSkillActive(true)
        // } else {
        //     // No skill is active
        //     Player.setGlobalHasSkillActive(false)
        // }
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
}}
}

export class ThiefSwiftFoot extends SkillController {
  constructor() {
    super(SKILL_DATA.THIEF_SWIFTFOOT)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
        // Player.setGlobalHasSkillActive(true)
        // activeSkillsCount++
        // log("activeSkillsCount ", activeSkillsCount)
        const LUCK_BUFF_PERCENT = 20
        player.updateLuckBuff(LUCK_BUFF_PERCENT)
        setTimeout(() => {
            // activeSkillsCount--
            // console.log("activeSkillsCount ", activeSkillsCount)
            // if (activeSkillsCount > 0) {
            //     // At least one skill is active
            //     Player.setGlobalHasSkillActive(true)
            // } else {
            //     // No skill is active
            //     Player.setGlobalHasSkillActive(false)
            // }
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
            // Player.setGlobalHasSkillActive(true)
            // activeSkillsCount++
            // console.log("activeSkillsCount ", activeSkillsCount)
            // Shadowstrike: Double your critical rate for 4R.
            const CRITRATE_BUFF = Player.getInstance().getLuckBuffs()
            player.updateCritRate(CRITRATE_BUFF * 3)
            setTimeout(() => {
                // activeSkillsCount--
                // console.log("activeSkillsCount ", activeSkillsCount)
                // if (activeSkillsCount > 0) {
                //     // At least one skill is active
                //     Player.setGlobalHasSkillActive(true)
                // } else {
                //     // No skill is active
                //     Player.setGlobalHasSkillActive(false)
                // }
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
            //Player.setGlobalHasSkillActive(true)
            // Fortune's Favor: If your next roll is successful, heal the 50% of your max HP.
            monsterModifiers.addActiveSkill(
                12 * 1000,
                "recoil_shot",
                (
                    isCriticalAttack:boolean,
                    isPlayerAttack:boolean,
                  attackAmount: number,
                    // TODO: Is monster necessary here?
                    // monster
                ) => {
                    console.log("recoil shot", isPlayerAttack, attackAmount)
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
        // Player.setGlobalHasSkillActive(true)
        // activeSkillsCount++
        // console.log("activeSkillsCount ", activeSkillsCount)
        // const player = Player.getInstance()
        const DEF_BUFF_PERCENT =
            player.getLuckBuffs() / 100
        //ui.displayAnnouncement(`${DEF_BUFF_PERCENT}`)
        player.updateDefBuff(DEF_BUFF_PERCENT)
        applyDefSkillEffectToLocation(
            Transform.get(engine.CameraEntity).position,

            12000
        )
        setTimeout(() => {
            // activeSkillsCount--
            // console.log("activeSkillsCount ", activeSkillsCount)
            // if (activeSkillsCount > 0) {
            //     // At least one skill is active
            //     Player.setGlobalHasSkillActive(true)
            // } else {
            //     // No skill is active
            //     Player.setGlobalHasSkillActive(false)
            // }
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
        // Player.setGlobalHasSkillActive(true)
        // activeSkillsCount++
        // console.log("activeSkillsCount ", activeSkillsCount)
        monsterModifiers.addActiveSkill(
            20 * 1000,
            "Bleed For Me",
            (isCriticalAttack:boolean, isPlayerAttack:boolean, attackAmount:number) => {
                console.log("Bleed For Me", isPlayerAttack, attackAmount)
                if (isPlayerAttack) {
                    const LUCK = player.getLuckBuffs()
                    const ATTACK_BUFF_PERCENT = LUCK * 30
                    player.updateAtkBuff(
                        ATTACK_BUFF_PERCENT
                    )
                    //createAttackIncreasedLabel()
                    //ui.displayAnnouncement(`ATTACK INCREASED!`)
                    setTimeout(() => {
                        // activeSkillsCount--
                        // console.log("activeSkillsCount ", activeSkillsCount)
                        // if (activeSkillsCount > 0) {
                        //     // At least one skill is active
                        //     Player.setGlobalHasSkillActive(true)
                        // } else {
                        //     // No skill is active
                        //     Player.setGlobalHasSkillActive(false)
                        // }
                        player.updateAtkBuff(
                            -ATTACK_BUFF_PERCENT
                        )
                    },20 * 1000)
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
        // Player.setGlobalHasSkillActive(true)
        // activeSkillsCount++
        // console.log("activeSkillsCount ", activeSkillsCount)
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
            // activeSkillsCount--
            // console.log("activeSkillsCount ", activeSkillsCount)
            // if (activeSkillsCount > 0) {
            //     // At least one skill is active
            //     Player.setGlobalHasSkillActive(true)
            // } else {
            //     // No skill is active
            //     Player.setGlobalHasSkillActive(false)
            // }
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
        // Player.setGlobalHasSkillActive(true)
        // activeSkillsCount++
        // console.log("activeSkillsCount ", activeSkillsCount)
        // Deadly Precision: Gain 30% Critical chance for 5R.
        const CRIT_BUFF_PERCENT = 30
        player.updateCritRate(CRIT_BUFF_PERCENT)
        setTimeout(() => {
            // activeSkillsCount--
            // log("activeSkillsCount ", activeSkillsCount)
            // if (activeSkillsCount > 0) {
            //     // At least one skill is active
            //     Player.setGlobalHasSkillActive(true)
            // } else {
            //     // No skill is active
            //     Player.setGlobalHasSkillActive(false)
            // }
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
        // Player.setGlobalHasSkillActive(true)
        // activeSkillsCount++
        // console.log("activeSkillsCount ", activeSkillsCount)
        // Savage Strike: Gain 200% Damage on your critical attacks for 3R.
        const CRITDAMAGE_BUFF_PERCENT = 200
        player.updateCritRate(CRITDAMAGE_BUFF_PERCENT)
        setTimeout( () => {
            // activeSkillsCount--
            // console.log("activeSkillsCount ", activeSkillsCount)
            // if (activeSkillsCount > 0) {
            //     // At least one skill is active
            //     Player.setGlobalHasSkillActive(true)
            // } else {
            //     // No skill is active
            //     Player.setGlobalHasSkillActive(false)
            // }
            player.updateCritRate(-CRITDAMAGE_BUFF_PERCENT)
        },12 * 1000)
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
        // Player.setGlobalHasSkillActive(true)
        // activeSkillsCount++
        // console.log("activeSkillsCount ", activeSkillsCount)
        // Mighty Shot: Your Attacks deal 45% more damage for 4R.
        const ATK_BUFF_PERCENT = 3 * player.getPlayerAttack(false)
        player.updateAtkBuff(ATK_BUFF_PERCENT)
        setTimeout(() => {
            // activeSkillsCount--
            // console.log("activeSkillsCount ", activeSkillsCount)
            // if (activeSkillsCount > 0) {
            //     // At least one skill is active
            //     Player.setGlobalHasSkillActive(true)
            // } else {
            //     // No skill is active
            //     Player.setGlobalHasSkillActive(false)
            // }
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
        //Player.setGlobalHasSkillActive(true)
        // Poison Arrows: Opponent loses 20 HP each 1 second for 8R. med
        monsterModifiers.addActiveSkill(
            20 * 1000,
            "poison_arrows",
            (
                isCriticalAttack:boolean,
                isPlayerAttack:boolean,
                attackAmount:number,
                monster:any // NEED TO TYPE
            ) => {
                if (!isPlayerAttack) {
                    const damageOverTime =
                        Player.getInstance().getPlayerAttack() // Adjust damage per tick as needed
                    const tickInterval = 2000 // Adjust interval between ticks as needed
                    let poisonDamageApplied = false // New variable to track poison damage application
                    player.gameController.uiController.displayAnnouncement("POISON TAKES EFFECT!")
                    console.log("before")
                    //@ts-ignore
                    const timer = setInterval(() => {
                        if (Player.globalHasSkill) {
                            monster.takeDamage(damageOverTime)
                            if (!poisonDamageApplied) {
                               player.gameController.uiController.displayAnnouncement("POISON HIT!", Color4.Yellow(), 1)
                                poisonDamageApplied = true
                            }
                            console.log("monster is taking damage")
                        } else {
                           player.gameController.uiController.displayAnnouncement("POISON BLOCKED!", Color4.Yellow(), 1)
                        }
                    }, tickInterval)
                    setTimeout(() => {
                        if (monster.health > 0) {
                            //@ts-ignore
                            clearInterval(timer) // Stop the DOT when the poison duration is over
                           player.gameController.uiController.displayAnnouncement("POISON DONE!", Color4.Yellow(), 1)
                        }
                    },20 * 1000)
                    if (monster.health <= 0) {
                        //@ts-ignore
                        clearInterval(timer) // Stop the DOT if the monster is defeated
                    }
                } else {
                   player.gameController.uiController.displayAnnouncement("POISON ARROW MISSED!", Color4.Yellow(), 1)
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

export class RangerVitalShot extends SkillController {
  constructor() {
    super(SKILL_DATA.RANGER_VITAL_SHOT)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
        //Player.setGlobalHasSkillActive(true)
        // Vital Shot: Heal 50% of your max HP when you deal critical damage for 4R. med
        monsterModifiers.addActiveSkill(
            20 * 1000,
            "vital_shot",
            (isCriticalAttack:boolean) => {
                console.log("vital shot", isCriticalAttack)
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
        //Player.setGlobalHasSkillActive(true)
        // Recoil Shot: Deal 50% of your inflicted damage back to the enemy for 4R. harder
        monsterModifiers.addActiveSkill(
            15 * 1000,
            "recoil_shot",
            (
                isCriticalAttack:boolean,
                isPlayerAttack:boolean,
                attackAmount:number,
                monster: any // TODO: SET TYPE
            ) => {
                console.log("recoil shot", isPlayerAttack, attackAmount)
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

export class GeneralDisruptiveBlow extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_DISRUPTIVE_BLOW)
  }

  async effect(): Promise<void> {
        // TODO:
        // const isWearableFound = checkWearableInUserData(
        //     //HATCHETS
        //   "0xa5d8a8c3454aa003ad72c3f814e52ad6bea69e57:0"
        // )
        const player = Player.getInstance()
        // activeSkillsCount++
        // console.log("activeSkillsCount ", activeSkillsCount)
        const damageOverTime = 60 // Adjust bleeding damage per tick as needed
        const tickInterval = 2000 // Adjust interval between ticks as needed
        const ATTACK_BUFF = 50
        player.updateAtkBuff(ATTACK_BUFF)
        // TODO:
        // applyRedSwirlToLocation(Transform.get(engine.CameraEntity).position)
        setTimeout(() => {
            // activeSkillsCount--
            // console.log("activeSkillsCount ", activeSkillsCount)
            // if (activeSkillsCount > 0) {
            //     // At least one skill is active
            //     Player.setGlobalHasSkillActive(true)
            // } else {
            //     // No skill is active
            //     Player.setGlobalHasSkillActive(false)
            // }
            player.updateAtkBuff(-ATTACK_BUFF)
        }, 6 * 1000)
        if ((await isWearableFound) === true) {
            monsterModifiers.addActiveSkill(
                30 * 1000,
                "disruptive_blow",
                (
                    isCriticalAttack:boolean,
                    isPlayerAttack:boolean,
                  attackAmount: number,
                    // NEED TO SET TYPE
                    monster:any
                ) => {
                    if (!isPlayerAttack) {
                       player.gameController.uiController.displayAnnouncement("BLEEDING STARTS!")
                        console.log("before")
                        let bleedingDamageApplied = false // New variable to track bleeding damage application
                        //@ts-ignore
                        const timer = setInterval(() => {
                            monster.takeDamage(damageOverTime)
                            if (!bleedingDamageApplied) {
                               player.gameController.uiController.displayAnnouncement(
                                    "BLEEDING DAMAGE!", Color4.Yellow(),
                                    1
                                )
                                bleedingDamageApplied = true
                            }
                            console.log("monster is taking bleeding damage")
                        }, tickInterval)
                        setTimeout(() => {
                            if (monster.health > 0) {
                                //@ts-ignore
                                clearInterval(timer) // Stop the bleeding if the monster is still alive
                               player.gameController.uiController.displayAnnouncement("BLEEDING STOPS!", Color4.Yellow(), 1)
                            }
                        }, 30 * 1000) // 60 seconds
                    } else {
                       player.gameController.uiController.displayAnnouncement("SKILL MISSED!", Color4.Yellow(), 1)
                    }
                }
            )
        } else {
          player.gameController.uiController.displayAnnouncement("Need wearable to activate!", Color4.Yellow(), 1)
        }
  }
}

export class GeneralFirstAidKit extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_FIRST_AID_KIT)
  }

  effect(): void {
    const player = Player.getInstance()
    if (Player.globalHasSkill) {
        //Player.setGlobalHasSkillActive(true)
        Player.getInstance().refillHealthBar(0.25, true)
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
        //Player.setGlobalHasSkillActive(true)
      // Splash Attack all engaged enemies
      
      // TODO: Need ENGAGED MONSTERS
        // for (let entity of engagedMonsters.entities) {
        //     if (entity instanceof MonsterOligar || entity instanceof MonsterMob || entity instanceof MonsterMobAuto ) {
        //         entity.performAttack(
        //             Player.getInstance().getPlayerAttack(),
        //             false
        //         )
        //     }
        // }
        player.attackAnimation()
        applyAttackedEnemyEffectToLocation(Transform.get(engine.CameraEntity).position, 5000)
    } else {
       player.gameController.uiController.displayAnnouncement("Player skill blocked")
        console.log("Player has no skills")
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
    //     //Player.setGlobalHasSkillActive(true)
      //     // Splash Attack all engaged enemies
      
      // TODO: Need ENGAGED MONSTERS
    //     for (let entity of engagedMonsters.entities) {
    //         if (entity instanceof MonsterMobAuto) {
    //             entity.performAttack(
    //                 Player.getInstance().getMagic(),
    //                 false
    //             )
    //         }
    //     }
    //     for (let entity of engagedMonsters.entities) {
    //         if (entity instanceof MonsterMob) {
    //             entity.performAttack(
    //                 Player.getInstance().getMagic(),
    //                 false
    //             )
    //         }
    //     }
    //     for (let entity of engagedMonsters.entities) {
    //         if (entity instanceof MonsterOligar) {
    //             entity.performAttack(
    //                 Player.getInstance().getMagic(),
    //                 false
    //             )
    //         }
    //     }
    player.attackAnimation()
        applyFullWhiteSkillEffectToLocation(
            Transform.get(engine.CameraEntity).position,

            5000
        )
    } else {
       player.gameController.uiController.displayAnnouncement("Player skill blocked")
        console.log("Player has no skills")
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
        // activeSkillsCount++
        // console.log("activeSkillsCount ", activeSkillsCount)
        const LUCK_BUFF_PERCENT = 10
      player.updateLuckBuff(LUCK_BUFF_PERCENT)
      // TODO NEED THIS EFFECT
        // applyWhiteSwirlToLocation(Transform.get(engine.CameraEntity).position, 1)
        setTimeout(() => {
            // activeSkillsCount--
            // console.log("activeSkillsCount ", activeSkillsCount)
            // if (activeSkillsCount > 0) {
            //     // At least one skill is active
            //     Player.setGlobalHasSkillActive(true)
            // } else {
            //     // No skill is active
            //     Player.setGlobalHasSkillActive(false)
            // }
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
        // activeSkillsCount++
        // console.log("activeSkillsCount ", activeSkillsCount)
        // Precision Focus: Increase critical rate by 30% for 15 s.
        const CRIT_RATE_BUFF_PERCENT = 30
        player.updateCritRate(CRIT_RATE_BUFF_PERCENT)
      // ApplyCritToLocation(Camera.instance.position)
      // TODO Need this effect
        // applyPurpleSwirlToLocation(Transform.get(engine.CameraEntity).position, 1)
        setTimeout(() => {
            // activeSkillsCount--
            // console.log("activeSkillsCount ", activeSkillsCount)
            // if (activeSkillsCount > 0) {
            //     // At least one skill is active
            //     Player.setGlobalHasSkillActive(true)
            // } else {
            //     // No skill is active
            //     Player.setGlobalHasSkillActive(false)
            // }
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

// Support Defense lvl 2 - enemy attack by 50%
export class GeneralDefensivePosture extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_DEFENSIVE_POSTURE)
  }

  effect(): void {
    // if (Player.globalHasSkill) {
    //     //Player.setGlobalHasSkillActive(true)
    //     // Splash Attack all engaged enemies
    //     for (let entity of engagedMonsters.entities) {
    //         if (entity instanceof MonsterMobAuto) {
    //             entity.performAttack(
    //                 Player.getInstance().getPlayerAttack(),
    //                 false
    //             )
    //         }
    //     }
    //     for (let entity of engagedMonsters.entities) {
    //         if (entity instanceof MonsterMob) {
    //             entity.performAttack(
    //                 Player.getInstance().getPlayerAttack(),
    //                 false
    //             )
    //         }
    //     }
    //     for (let entity of engagedMonsters.entities) {
    //         if (entity instanceof MonsterOligar) {
    //             entity.performAttack(
    //                 Player.getInstance().getPlayerAttack(),
    //                 false
    //             )
    //         }
    //     }
    //     Player.getInstance().attackAnimation()
    //     applyAttackedEnemyEffectToLocation(
    //         Transform.get(engine.CameraEntity).position,

    //         2000
    //     )
    // } else {
    //    player.gameController.uiController.displayAnnouncement("Player skill blocked")
    //     log("Player has no skills")
    // }
  }
}

// Support Defense lvl 1 25%
export class GeneralStrike extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_STRIKE)
  }

  effect(): void {
    // if (Player.globalHasSkill) {
    //     //Player.setGlobalHasSkillActive(true)
    //     shootArrow()
    //     Player.getInstance().attackAnimation()
    // } else {
    //   player.gameController.uiController.displayAnnouncement(
    //     'Player skills blocked',
    //     Color4.Yellow(),
    //     1000
    //   )
    //   console.log('Player has no skills')
    // }
  }
}

export class GeneralIronDefense extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_IRON_DEFENSE)
  }

  effect(): void {
    // if (Player.globalHasSkill) {
    //     Player.setGlobalHasSkillActive(true)
    //     activeSkillsCount++
    //     log("activeSkillsCount ", activeSkillsCount)
    //     // Iron Defense: Increase defense by 50% for 12 s.
    //     const DEFENSE_BUFF_PERCENT = 0.25
    //     Player.getInstance().updateDefBuff(DEFENSE_BUFF_PERCENT)
    //     applyDefSkillEffectToLocation(
    //         Transform.get(engine.CameraEntity).position,

    //         2000
    //     )
    //     setTimeout(6 * 1000, () => {
    //         activeSkillsCount--
    //         log("activeSkillsCount ", activeSkillsCount)
    //         if (activeSkillsCount > 0) {
    //             // At least one skill is active
    //             Player.setGlobalHasSkillActive(true)
    //         } else {
    //             // No skill is active
    //             Player.setGlobalHasSkillActive(false)
    //         }
    //         Player.getInstance().updateDefBuff(-DEFENSE_BUFF_PERCENT)
    //     }) // 12 seconds in milliseconds
    // } else {
    //   player.gameController.uiController.displayAnnouncement(
    //     'Player skills blocked',
    //     Color4.Yellow(),
    //     1000
    //   )
    //   console.log('Player has no skills')
    // }
  }
}
// Support Heal lvl 2 MAX +50%
export class GeneralVitalitySurge extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_VITALITY_SURGE)
  }

  effect(): void {
    // if (Player.globalHasSkill) {
    //     Player.setGlobalHasSkillActive(true)
    //     activeSkillsCount++
    //     log("activeSkillsCount ", activeSkillsCount)
    //     // Vitality Surge: Increase max health by 25% for 25 s.
    //     const MAX_HEALTH_BUFF_PERCENT =
    //         Player.getInstance().maxHealth * 0.1
    //     Player.getInstance().updateMaxHp(MAX_HEALTH_BUFF_PERCENT)
    //     setTimeout(15 * 1000, () => {
    //         activeSkillsCount--
    //         log("activeSkillsCount ", activeSkillsCount)
    //         if (activeSkillsCount > 0) {
    //             // At least one skill is active
    //             Player.setGlobalHasSkillActive(true)
    //         } else {
    //             // No skill is active
    //             Player.setGlobalHasSkillActive(false)
    //         }
    //         Player.getInstance().updateMaxHp(-MAX_HEALTH_BUFF_PERCENT)
    //     }) // 25 seconds in milliseconds
    //     applyWhiteSwirlToLocation(Transform.get(engine.CameraEntity).position,
 1)
    // } else {
    //   player.gameController.uiController.displayAnnouncement(
    //     'Player skills blocked',
    //     Color4.Yellow(),
    //     1000
    //   )
    //   console.log('Player has no skills')
    // }
  }
}

// Attack buffer lvl 2 25% of MAX HP
export class GeneralVitalityBoost extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_VITALITY_BOOST)
  }

  effect(): void {
    // if (Player.globalHasSkill) {
    //     Player.setGlobalHasSkillActive(true)
    //     activeSkillsCount++
    //     log("activeSkillsCount ", activeSkillsCount)
    //     // PROTECTORSBLESSING: Gain Attack equal to 25% of your MAX HP for 10 secs. 20 sec cooldown
    //     const ATTACK_BUFF = Player.getInstance().maxHealth * 0.25
    //     player.updateAtkBuff(ATTACK_BUFF)
    //     // ApplysphereEnergyToLocation(Camera.instance.position)
    //     applyFlameAuraToLocation(Transform.get(engine.CameraEntity).position,
 1)
    //     setTimeout(15 * 1000, () => {
    //         activeSkillsCount--
    //         log("activeSkillsCount ", activeSkillsCount)
    //         if (activeSkillsCount > 0) {
    //             // At least one skill is active
    //             Player.setGlobalHasSkillActive(true)
    //         } else {
    //             // No skill is active
    //             Player.setGlobalHasSkillActive(false)
    //         }
    //         player.updateAtkBuff(-ATTACK_BUFF)
    //     })
    // } else {
    //   player.gameController.uiController.displayAnnouncement(
    //     'Player skills blocked',
    //     Color4.Yellow(),
    //     1000
    //   )
    //   console.log('Player has no skills')
    // }
  }
}

// Support Defense lvl 2 50%
export class GeneralShieldWall extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_SHIELD_WALL)
  }

  effect(): void {
    // if (Player.globalHasSkill) {
    //     Player.setGlobalHasSkillActive(true)
    //     activeSkillsCount++
    //     log("activeSkillsCount ", activeSkillsCount)
    //     // Stoneheart: Gain def chance equal to your missing HP for 2R.
    //     const DEF_BUFF_PERCENT = 0.5
    //     Player.getInstance().updateDefBuff(DEF_BUFF_PERCENT)
    //     applyDefSkillEffectToLocation(
    //         Transform.get(engine.CameraEntity).position,

    //         2000
    //     )
    //     setTimeout(12 * 1000, () => {
    //         activeSkillsCount--
    //         log("activeSkillsCount ", activeSkillsCount)
    //         if (activeSkillsCount > 0) {
    //             // At least one skill is active
    //             Player.setGlobalHasSkillActive(true)
    //         } else {
    //             // No skill is active
    //             Player.setGlobalHasSkillActive(false)
    //         }
    //         Player.getInstance().updateDefBuff(-DEF_BUFF_PERCENT)
    //     })
    // } else {
    //   player.gameController.uiController.displayAnnouncement(
    //     'Player skills blocked',
    //     Color4.Yellow(),
    //     1000
    //   )
    //   console.log('Player has no skills')
    // }
  }
}

// AOE Attack lvl 2 Double player attack
export class GeneralHammerShot extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_HAMMER_SHOT)
  }

  effect(): void {
    // if (Player.globalHasSkill) {
    //     //Player.setGlobalHasSkillActive(true)
    //     for (let entity of engagedMonsters.entities) {
    //         if (entity instanceof MonsterMobAuto) {
    //             entity.performAttack(
    //                 Player.getInstance().getPlayerAttack(),
    //                 false
    //             )
    //         }
    //     }
    //     setTimeout(3 * 1000, () => {
    //         for (let entity of engagedMonsters.entities) {
    //             if (entity instanceof MonsterMobAuto) {
    //                 entity.performAttack(
    //                     Player.getInstance().getPlayerAttack(),
    //                     false
    //                 )
    //             }
    //         }
    //     })
    //     for (let entity of engagedMonsters.entities) {
    //         if (entity instanceof MonsterMob) {
    //             entity.performAttack(
    //                 Player.getInstance().getPlayerAttack(),
    //                 false
    //             )
    //         }
    //     }
    //     setTimeout(3 * 1000, () => {
    //         for (let entity of engagedMonsters.entities) {
    //             if (entity instanceof MonsterMob) {
    //                 entity.performAttack(
    //                     Player.getInstance().getPlayerAttack(),
    //                     false
    //                 )
    //             }
    //         }
    //     })
    //     for (let entity of engagedMonsters.entities) {
    //         if (entity instanceof MonsterOligar) {
    //             entity.performAttack(
    //                 Player.getInstance().getPlayerAttack(),
    //                 false
    //             )
    //         }
    //     }
    //     setTimeout(3 * 1000, () => {
    //         for (let entity of engagedMonsters.entities) {
    //             if (entity instanceof MonsterOligar) {
    //                 entity.performAttack(
    //                     Player.getInstance().getPlayerAttack(),
    //                     false
    //                 )
    //             }
    //         }
    //     })
    //     Player.getInstance().attackAnimation()
    //     applyRedSkillEffectToLocation(
    //         Transform.get(engine.CameraEntity).position,

    //         3000
    //     )
    // } else {
    //   player.gameController.uiController.displayAnnouncement(
    //     'Player skills blocked',
    //     Color4.Yellow(),
    //     1000
    //   )
    //   console.log('Player has no skills')
    // }
  }
}

// Support Defense lvl 2 - enemy attack by 50% (DUPE)
export class GeneralDefensiveAura extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_DEFENSIVE_AURA)
  }

  effect(): void {
    // if (Player.globalHasSkill) {
    //     Player.setGlobalHasSkillActive(true)
    //     activeSkillsCount++
    //     log("activeSkillsCount ", activeSkillsCount)
    //     //  Decrease the attack value of your opponent by 50% for 5R.
    //     let MAGIC_BUFF = Player.getInstance().getMagic() * 2
    //     if (player.class === Class.MAGE) {
    //         MAGIC_BUFF = Player.getInstance().getMagic() * 3
    //     }
    //     player.updateMagic(MAGIC_BUFF)
    //     setTimeout(12 * 1000, () => {
    //         activeSkillsCount--
    //         log("activeSkillsCount ", activeSkillsCount)
    //         if (activeSkillsCount > 0) {
    //             // At least one skill is active
    //             Player.setGlobalHasSkillActive(true)
    //         } else {
    //             // No skill is active
    //             Player.setGlobalHasSkillActive(false)
    //         }
    //         player.updateMagic(-MAGIC_BUFF)
    //     })
    //     applyPurpleSwirlToLocation(Transform.get(engine.CameraEntity).position,
 1)
    // } else {
    //   player.gameController.uiController.displayAnnouncement(
    //     'Player skills blocked',
    //     Color4.Yellow(),
    //     1000
    //   )
    //   console.log('Player has no skills')
    // }
  }
}

export class GeneralSoulRelease extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_SOULRELEASE)
  }

  effect(): void {
    // if (Player.globalHasSkill) {
    //     Player.setGlobalHasSkillActive(true)
    //     activeSkillsCount++
    //     log("activeSkillsCount ", activeSkillsCount)
    //     // PROTECTORSBLESSING: Gain Attack equal to 25% of your MAX HP for 10 secs. 20 sec cooldown
    //     const MAGIC_BUFF = Player.getInstance().maxHealth * 0.05
    //     player.updateMagic(MAGIC_BUFF)
    //     // ApplysphereEnergyToLocation(Camera.instance.position)
    //     applyFlameAuraToLocation(Transform.get(engine.CameraEntity).position,
 1)
    //     setTimeout(15 * 1000, () => {
    //         activeSkillsCount--
    //         log("activeSkillsCount ", activeSkillsCount)
    //         if (activeSkillsCount > 0) {
    //             // At least one skill is active
    //             Player.setGlobalHasSkillActive(true)
    //         } else {
    //             // No skill is active
    //             Player.setGlobalHasSkillActive(false)
    //         }
    //         player.updateMagic(-MAGIC_BUFF)
    //     })
    // } else {
    //   player.gameController.uiController.displayAnnouncement(
    //     'Player skills blocked',
    //     Color4.Yellow(),
    //     1000
    //   )
    //   console.log('Player has no skills')
    // }
  }
}

// Attack buffer lvl 3 30% attack
export class GeneralMightyAssault extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_MIGHTY_ASSAULT)
  }

  effect(): void {
    // if (Player.globalHasSkill) {
    //     Player.setGlobalHasSkillActive(true)
    //     activeSkillsCount++
    //     log("activeSkillsCount ", activeSkillsCount)
    //     // Mighty Assault: Increase attack damage by 30% for 10 s.
    //     const ATTACK_DAMAGE_BUFF =
    //         Player.getInstance().getPlayerAttack() * 0.3
    //     //ui.displayAnnouncement(`${ATTACK_DAMAGE_BUFF}`)
    //     player.updateAtkBuff(ATTACK_DAMAGE_BUFF)
    //     applyFlameAuraToLocation(Transform.get(engine.CameraEntity).position,
 1)
    //     setTimeout(8 * 1000, () => {
    //         activeSkillsCount--
    //         log("activeSkillsCount ", activeSkillsCount)
    //         if (activeSkillsCount > 0) {
    //             // At least one skill is active
    //             Player.setGlobalHasSkillActive(true)
    //         } else {
    //             // No skill is active
    //             Player.setGlobalHasSkillActive(false)
    //         }
    //         player.updateAtkBuff(-ATTACK_DAMAGE_BUFF)
    //     }) // 10 seconds in milliseconds
    // } else {
    //   player.gameController.uiController.displayAnnouncement(
    //     'Player skills blocked',
    //     Color4.Yellow(),
    //     1000
    //   )
    //   console.log('Player has no skills')
    // }
  }
}

// Attack buffer lvl 3 20% Missing HP attack
// GENERAL_RECKLESS_FURY: {
//     name: "Reckless Fury",
//     minLevel: 55,
//     descriptio
//     onButton: SkillsConfig.generalJson["Skill_483.png"]
//         if (Player.globalHasSkill) {
//             Player.setGlobalHasSkillActive(true)
//             activeSkillsCount++
//             log("activeSkillsCount ", activeSkillsCount)
//             //  Increase your attack by 20% of your missing HP for 15 seconds

//             const missingHp =
//                 Player.getInstance().maxHealth - Player.getInstance().health
//             const attackBuff = missingHp * 0.2 // Increase attack by 20% of missing HP
//             player.updateAtkBuff(attackBuff)
//             //ui.displayAnnouncement(`${attackBuff}`)

//             applyRedSwirlToLocation(Camera.instance.feetPosition)

//             setTimeout(6 * 1000, () => {
//                 activeSkillsCount--
//                 log("activeSkillsCount ", activeSkillsCount)
//                 if (activeSkillsCount > 0) {
//                     // At least one skill is active
//                     Player.setGlobalHasSkillActive(true)
//                 } else {
//                     // No skill is active
//                     Player.setGlobalHasSkillActive(false)
//                 }
//                 player.updateAtkBuff(-attackBuff)
//             })
//         } else {
//            player.gameController.uiController.displayAnnouncement("Player skills blocked")
//             log("Player has no skills")
//         }
//
// },
// Support Defense lvl 3 10% for each unsuccessful roll
export class GeneralFortressOfResilience extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_FORTRESS_OF_RESILIENCE)
  }

  effect(): void {
    if (Player.globalHasSkill) {
      //     if (
      //         Player.getInstance().inventory.getItemCount(
      //             ITEM_TYPES.POTION
      //         ) >= 1
      //     ) {
      //         Player.getInstance().inventory.reduceItem(
      //             ITEM_TYPES.POTION,
      //             1
      //         )
      //         Player.getInstance().writeDataToServer()
      //         Player.getInstance().refillHealthBar(0.25)
      //        player.gameController.uiController.displayAnnouncement("25% health Restored")
      //     } else {
      //        player.gameController.uiController.displayAnnouncement("No more potions")
      //     }
      // } else {
      //    player.gameController.uiController.displayAnnouncement("Player skills blocked")
      //     log("Player has no skills")
    }
  }
}

// Support Special missing hp
export class GeneralOathToDemonKing extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_OATH_TO_DEMON_KING)
  }

  effect(): void {
    // if (Player.globalHasSkill) {
    //     // Player.setGlobalHasSkillActive(true)
    //     applyRainbowSwirlToLocation(Transform.get(engine.CameraEntity).position,
 1)
    //     Player.getInstance().reduceHealth(player.maxHealth * 0.9)
    // } else {
    //   player.gameController.uiController.displayAnnouncement(
    //     'Player skills blocked',
    //     Color4.Yellow(),
    //     1000
    //   )
    //   console.log('Player has no skills')
    // }
  }
}

// Support Special no luck
export class GeneralGodricsBlessing extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_GODRICS_BLESSING)
  }

  effect(): void {
    // if (Player.globalHasSkill) {
    //     Player.setGlobalHasSkillActive(true)
    //     activeSkillsCount++
    //     log("activeSkillsCount ", activeSkillsCount)
    //     const LUCK_DEBUFF_PERCENT = 90
    //     Player.getInstance().updateLuckBuff(-LUCK_DEBUFF_PERCENT)
    //     applyRainbowSwirlToLocation(Transform.get(engine.CameraEntity).position,
 1)
    //     setTimeout(30 * 1000, () => {
    //         activeSkillsCount--
    //         log("activeSkillsCount ", activeSkillsCount)
    //         if (activeSkillsCount > 0) {
    //             // At least one skill is active
    //             Player.setGlobalHasSkillActive(true)
    //         } else {
    //             // No skill is active
    //             Player.setGlobalHasSkillActive(false)
    //         }
    //         Player.getInstance().updateLuckBuff(LUCK_DEBUFF_PERCENT)
    //     })
    // } else {
    //   player.gameController.uiController.displayAnnouncement(
    //     'Player skills blocked',
    //     Color4.Yellow(),
    //     1000
    //   )
    //   console.log('Player has no skills')
    // }
  }
}

// Attack lvl 4 counter
export class GeneralConfusingBlades extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_CONFUSING_BLADES)
  }

  effect(): void {
    // if (Player.globalHasSkill) {
    //     //Player.setGlobalHasSkillActive(true)
    //     monsterModifiers.addActiveSkill(
    //         9 * 1000,
    //         "confusing_blades",
    //         (
    //             isCriticalAttack,
    //             isPlayerAttack,
    //             attackAmount,
    //             monster
    //         ) => {
    //             log("confusing_blades", isPlayerAttack, attackAmount)
    //             if (!isPlayerAttack) {
    //                 const counterAttackAmount = attackAmount * 0.7
    //                 monster.performAttack(counterAttackAmount, false)
    //             }
    //         }
    //     )
    //     applyPlayerSkillBladesEffectToLocation(
    //         Camera.instance.position,
    //         Camera.instance.rotation,
    //         2, // Adjust the distance as needed
    //         9000 // Duration in milliseconds
    //     )
    // } else {
    //   player.gameController.uiController.displayAnnouncement(
    //     'Player skills blocked',
    //     Color4.Yellow(),
    //     1000
    //   )
    //   console.log('Player has no skills')
    // }
  }
}

// Attack lvl 3 poison
export class GeneralVenomousBlade extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_VENOMOUS_BLADE)
  }

  effect(): void {
    // if (Player.globalHasSkill) {
    //     //Player.setGlobalHasSkillActive(true)
    //     // Venomous Blade: Inflict damage over time to opponents.
    //     monsterModifiers.addActiveSkill(
    //         6 * 1000,
    //         "venomous_blade",
    //         (
    //             isCriticalAttack,
    //             isPlayerAttack,
    //             attackAmount,
    //             monster
    //         ) => {
    //             if (!isPlayerAttack) {
    //                 const damageOverTime = 200 // Adjust damage per tick as needed
    //                 const tickInterval = 2000 // Adjust interval between ticks as needed
    //                 let poisonDamageApplied = false // New variable to track poison damage application
    //                player.gameController.uiController.displayAnnouncement("POISON TAKES EFFECT!")
    //                 log("before")
    //                 //@ts-ignore
    //                 const timer = setInterval(() => {
    //                     if (Player.globalHasSkill) {
    //                         monster.takeDamage(damageOverTime)
    //                         if (!poisonDamageApplied) {
    //                             applyPurpleSwirlToLocation(
    //                                 Transform.get(engine.CameraEntity).position,

    //                                 5
    //                             )
    //                             poisonDamageApplied = true
    //                         }
    //                         log("monster is taking damage")
    //                     }
    //                 }, tickInterval)
    //                 setTimeout(6 * 1000, () => {
    //                     if (monster.health > 0) {
    //                         //@ts-ignore
    //                         clearInterval(timer) // Stop the DOT when the poison duration is over
    //                        player.gameController.uiController.displayAnnouncement("POISON DONE!", Color4.Yellow(), 1)
    //                     }
    //                 }) // 10 seconds
    //                 if (monster.health <= 0) {
    //                     //@ts-ignore
    //                     clearInterval(timer) // Stop the DOT if the monster is defeated
    //                 }
    //             } else {
    //                player.gameController.uiController.displayAnnouncement("POISON SKILL MISSED!", Color4.Yellow(), 1)
    //             }
    //         }
    //     )
    // } else {
    //   player.gameController.uiController.displayAnnouncement(
    //     'Player skills blocked',
    //     Color4.Yellow(),
    //     1000
    //   )
    //   console.log('Player has no skills')
    // }
  }
}

export class GeneralSpellCancel extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_SPELL_CANCEL)
  }

  effect(): void {
    // MonsterOligar.setGlobalHasSkill(false)
    // applyDefSkillEffectToLocation(Transform.get(engine.CameraEntity).position,
 2000)
    // setTimeout(15 * 1000, () => {
    //     MonsterOligar.setGlobalHasSkill(true)
    // })
  }
}

export class GeneralVampiricTransfusion extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_Vampiric_Transfusion)
  }

  effect(): void {
    // skillEffect: async () => {
    // if (Player.globalHasSkill) {
    //     Player.setGlobalHasSkillActive(true)
    //     activeSkillsCount++
    //     log("activeSkillsCount ", activeSkillsCount)
    //     const ATTACK_BUFF = player.getPlayerAttack() // Get player's attack value
    //     player.updateAtkBuff(-ATTACK_BUFF) // Remove all ATTACK
    //     player.updateMagic(ATTACK_BUFF) // Add it to MAGIC
    //     // Function to absorb damage as health for the duration of the skill
    //     const absorbDamage = (
    //         isCriticalAttack,
    //         isPlayerAttack,
    //         attackAmount,
    //         monster
    //     ) => {
    //         if (!isPlayerAttack) {
    //             const absorbedHealth = Player.getInstance().getMagic()
    //             Player.getInstance().heal(absorbedHealth)
    //         }
    //     }
    //     // Add modifier to absorb damage as health
    //     monsterModifiers.addActiveSkill(
    //         15 * 1000,
    //         "vampiric_transfusion",
    //         absorbDamage
    //     )
    //     // Reset player's stats after the duration of the skill
    //     setTimeout(30 * 1000, () => {
    //         activeSkillsCount--
    //         log("activeSkillsCount ", activeSkillsCount)
    //         if (activeSkillsCount > 0) {
    //             // At least one skill is active
    //             Player.setGlobalHasSkillActive(true)
    //         } else {
    //             // No skill is active
    //             Player.setGlobalHasSkillActive(false)
    //         }
    //         player.updateAtkBuff(ATTACK_BUFF) // Restore ATTACK
    //         player.updateMagic(-ATTACK_BUFF) // Remove MAGIC buff
    //     })
    // } else {
    //   player.gameController.uiController.displayAnnouncement(
    //     'Player skills blocked',
    //     Color4.Yellow(),
    //     1000
    //   )
    //   console.log('Player has no skills')
    // }
  }
}

export class GeneralCelestialRetribution extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_Celestial_Retribution)
  }

  effect(): void {
    // if (Player.globalHasSkill) {
    //     Player.setGlobalHasSkillActive(true)
    //     activeSkillsCount++
    //     log("activeSkillsCount ", activeSkillsCount)
    //     const CRITRATE_BUFF = Player.getInstance().getCritRate() * 0.05
    //     const CRITDMG_BUFF = Player.getInstance().getCritDamage() * 0.05
    //     const ATTACK_BUFF =
    //         Player.getInstance().getPlayerAttack() * 0.05
    //     const LUCK_BUFF = Player.getInstance().getLuckRange() * 0.05
    //     const MAGIC_BUFF = Player.getInstance().getMagic() * 0.05
    //     const DEF_BUFF = Player.getInstance().getDefensePercent() * 0.05
    //     let count = 0
    //     // Recoil Shot: Deal 50% of your inflicted damage back to the enemy for 4R. harder
    //     monsterModifiers.addActiveSkill(
    //         15 * 1000,
    //         "recoil_shot",
    //         (
    //             isCriticalAttack,
    //             isPlayerAttack,
    //             attackAmount,
    //             monster
    //         ) => {
    //             log("recoil shot", isPlayerAttack, attackAmount)
    //             if (!isPlayerAttack) {
    //                 const counterAttackAmount = attackAmount * 1.5
    //                 monster.performAttack(counterAttackAmount, false)
    //                 player.updateAtkBuff(ATTACK_BUFF)
    //                 player.updateMagic(MAGIC_BUFF)
    //                 Player.getInstance().updateCritDmg(CRITDMG_BUFF)
    //                 Player.getInstance().updateCritRate(CRITRATE_BUFF)
    //                 Player.getInstance().updateLuckBuff(LUCK_BUFF)
    //                 Player.getInstance().updateDefBuff(DEF_BUFF)
    //                 count++
    //             }
    //         }
    //     )
    //     setTimeout(15 * 1000, () => {
    //         activeSkillsCount--
    //         log("activeSkillsCount ", activeSkillsCount)
    //         if (activeSkillsCount > 0) {
    //             // At least one skill is active
    //             Player.setGlobalHasSkillActive(true)
    //         } else {
    //             // No skill is active
    //             Player.setGlobalHasSkillActive(false)
    //         }
    //         player.updateAtkBuff(-ATTACK_BUFF * count)
    //         player.updateMagic(-MAGIC_BUFF * count)
    //         Player.getInstance().updateCritDmg(-CRITDMG_BUFF * count)
    //         Player.getInstance().updateCritRate(-CRITRATE_BUFF * count)
    //         Player.getInstance().updateLuckBuff(-LUCK_BUFF * count)
    //         Player.getInstance().updateDefBuff(-DEF_BUFF * count)
    //         count = 0
    //     })
    // } else {
    //   player.gameController.uiController.displayAnnouncement(
    //     'Player skills blocked',
    //     Color4.Yellow(),
    //     1000
    //   )
    //   console.log('Player has no skills')
    // }
  }
}

export class GeneralFortunesFavor extends SkillController {
  constructor() {
    super(SKILL_DATA.GENERAL_FORTUNES_FAVOR)
  }

  effect(): void {
    // if (Player.globalHasSkill) {
    //     Player.setGlobalHasSkillActive(true)
    //     activeSkillsCount++
    //     log("activeSkillsCount ", activeSkillsCount)
    //     const CRITRATE_BUFF = Player.getInstance().getCritRate() * 0.05
    //     const CRITDMG_BUFF = Player.getInstance().getCritDamage() * 0.05
    //     const ATTACK_BUFF =
    //         Player.getInstance().getPlayerAttack() * 0.05
    //     const LUCK_BUFF = Player.getInstance().getLuckRange() * 0.05
    //     const MAGIC_BUFF = Player.getInstance().getMagic() * 0.05
    //     const DEF_BUFF = Player.getInstance().getDefensePercent() * 0.05
    //     let count = 0
    //     // Recoil Shot: Deal 50% of your inflicted damage back to the enemy for 4R. harder
    //     monsterModifiers.addActiveSkill(
    //         20 * 1000,
    //         "recoil_shot",
    //         (
    //             isCriticalAttack,
    //             isPlayerAttack,
    //             attackAmount,
    //             monster
    //         ) => {
    //             log("recoil shot", isPlayerAttack, attackAmount)
    //             if (isPlayerAttack) {
    //                 const counterAttackAmount = attackAmount * 1.5
    //                 //monster.performAttack(counterAttackAmount, false)
    //                 player.updateAtkBuff(ATTACK_BUFF)
    //                 player.updateMagic(MAGIC_BUFF)
    //                 Player.getInstance().updateCritDmg(CRITDMG_BUFF)
    //                 Player.getInstance().updateCritRate(CRITRATE_BUFF)
    //                 Player.getInstance().updateLuckBuff(LUCK_BUFF)
    //                 Player.getInstance().updateDefBuff(DEF_BUFF)
    //                 count++
    //             }
    //         }
    //     )
    //     setTimeout(20 * 1000, () => {
    //         activeSkillsCount--
    //         log("activeSkillsCount ", activeSkillsCount)
    //         if (activeSkillsCount > 0) {
    //             // At least one skill is active
    //             Player.setGlobalHasSkillActive(true)
    //         } else {
    //             // No skill is active
    //             Player.setGlobalHasSkillActive(false)
    //         }
    //         player.updateAtkBuff(-ATTACK_BUFF * count)
    //         player.updateMagic(-MAGIC_BUFF * count)
    //         Player.getInstance().updateCritDmg(-CRITDMG_BUFF * count)
    //         Player.getInstance().updateCritRate(-CRITRATE_BUFF * count)
    //         Player.getInstance().updateLuckBuff(-LUCK_BUFF * count)
    //         Player.getInstance().updateDefBuff(-DEF_BUFF * count)
    //         count = 0
    //     })
    // } else {
    //   player.gameController.uiController.displayAnnouncement(
    //     'Player skills blocked',
    //     Color4.Yellow(),
    //     1000
    //   )
    //   console.log('Player has no skills')
    // }
  }
}
