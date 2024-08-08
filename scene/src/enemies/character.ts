// import { Scalar } from "decentraland-ecs"

import { type Entity } from '@dcl/sdk/ecs'
import { Scalar } from '@dcl/sdk/math'
import { getRandomInt } from './../utils/getRandomInt'
import { entityController } from '../realms/entityController'
import { Player } from '../player/player'

export class Character {
  _entity = entityController.addEntity()
  // triggerRangeAttack = entityController.addEntity()
  private _health: number
  private _attack: number
  private _xp: number
  private _level: number
  private _baseDefense: number
  private _maxHealth: number
  private _minLuck: number = 0
  private _magic: number

  constructor(
    attack: number,
    xp: number,
    level: number,
    health: number = 1,
    baseDefense: number = 0.01,
    magic: number = 0
  ) {
    this._attack = attack
    this._health = health
    this._xp = xp
    this._level = level
    this._baseDefense = baseDefense
    this._maxHealth = health
    this._magic = magic
  }

  reduceHealth(attack: number): void {
    console.log('reducehealth', attack)
    if (this._health - attack >= 0) {
      this._health -= Math.round(attack)
    } else {
      this._health = 0
    }
    console.log(this._health, this.getHealthScaled())
  }

  getHealthScaled(): number {
    return this._health / this._maxHealth
  }

  rollDice(): number {
    const max = 20 + this._level / 2
    const min = (this._minLuck / 100) * max
    const randomNumber = Scalar.randomRange(Math.round(min), Math.round(max))
    return randomNumber
  }

  getLuckRange(): number {
    return this._level
  }

  getDefensePercent(): number {
    // TODO random Int function
    const def = this._baseDefense * getRandomInt(Math.round(this._level / 2))
    return def >= 1 ? 0.99 : def
  }

  get health(): number {
    return this._health
  }

  set health(value: number) {
    this._health = value
  }

  get attack(): number {
    return this._attack
  }

  set attack(value: number) {
    this._attack = value
  }

  get xp(): number {
    return this._xp
  }

  set xp(value: number) {
    this._xp = value
  }

  get level(): number {
    return this._level
  }

  set level(value: number) {
    this._level = value
  }

  get baseDefense(): number {
    return this._baseDefense
  }

  set baseDefense(value: number) {
    this._baseDefense = value
  }

  get maxHealth(): number {
    return this._maxHealth
  }

  set maxHealth(value: number) {
    this._maxHealth = value
  }

  get magic(): number {
    return this._magic
  }

  set magic(value: number) {
    this._magic = value
  }

  set minLuck(value: number) {
    this._minLuck = value
  }

  get minLuck(): number {
    return this._minLuck
  }

  set entity(value: Entity) {
    this._entity = value
  }

  get entity(): Entity {
    return this._entity
  }
}
