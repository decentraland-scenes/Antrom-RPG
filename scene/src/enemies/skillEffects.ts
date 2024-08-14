import * as utils from '@dcl-sdk/utils'
import { type GenericMonster } from './monsterGeneric'

type MonsterSkillFunction = (
  isCriticalAttack: boolean,
  isPlayerAttack: boolean,
  attackAmount: number,
  monster: GenericMonster
) => void

class MonsterModifiers {
  public attackBuff: number = 0
  public luckBuff: number = 0
  public defBuff: number = 0
  public critRateBuff: number = 0
  public critDamageBuff: number = 0
  public canActivateSkill!: boolean

  public activeSkills = new Map<string, MonsterSkillFunction>()

  getAtkBuff(): number {
    return this.attackBuff
  }

  updateAtkDebuff(value: number): void {
    this.attackBuff -= value
  }

  getDefBuff(): number {
    return this.defBuff
  }

  updateDefBuff(value: number): void {
    this.defBuff += value
  }

  getLuckBuff(): number {
    return this.luckBuff
  }

  updateLuckBuff(value: number): void {
    this.luckBuff += value
  }

  getCritDamage(): number {
    return this.critDamageBuff
  }

  updateCritDmg(value: number): void {
    this.critDamageBuff += value
  }

  getCritRate(): number {
    return this.critRateBuff
  }

  updateCritRate(value: number): void {
    this.critRateBuff += value
  }

  addActiveSkill(
    activeTime: number,
    skillName: string,
    skill: MonsterSkillFunction
  ): void {
    this.activeSkills.set(skillName, skill)

    utils.timers.setTimeout(() => {
      this.removeActiveSkill(skillName)
    }, activeTime)
  }

  removeActiveSkill(skillName: string): void {
    this.activeSkills.delete(skillName)
  }
}

export const monsterModifiers = new MonsterModifiers()
