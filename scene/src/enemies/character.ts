// import { Scalar } from "decentraland-ecs"

import { engine } from '@dcl/sdk/ecs'
import { Scalar } from '@dcl/sdk/math'
import { getRandomInt } from './../utils/getRandomInt'

export class Character {
  entity = engine.addEntity()
  // triggerRangeAttack = engine.addEntity()
  health: number
  attack: number
  xp: number
  level: number
  baseDefense: number
  maxHealth: number
  minLuck: number = 0
  magic: number
  constructor(
    attack: number,
    xp: number,
    level: number,
    health: number = 1,
    baseDefense: number = 0.01,
    magic: number = 0
  ) {
    this.attack = attack
    this.health = health
    this.xp = xp
    this.level = level
    this.baseDefense = baseDefense
    this.maxHealth = health
    this.magic = magic
  }

  reduceHealth(attack: number): void {
    console.log('reducehealth', attack)
    if (this.health - attack >= 0) {
      this.health -= Math.round(attack)
    } else {
      this.health = 0
    }
    console.log(this.health, this.getHealthScaled())
  }

  getHealthScaled(): number {
    return this.health / this.maxHealth
  }

  rollDice(): number {
    const max = 20 + this.level / 2
    const min = (this.minLuck / 100) * max
    const randomNumber = Scalar.randomRange(Math.round(min), Math.round(max))
    return randomNumber
  }

  getLuckRange(): number {
    return this.level
  }

  getDefensePercent(): number {
    // TODO random Int function
    const def = this.baseDefense * getRandomInt(Math.round(this.level / 2))
    return def >= 1 ? 0.99 : def
  }
}
