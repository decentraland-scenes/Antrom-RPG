import { Transform } from '@dcl/sdk/ecs'
import MonsterOligar from '../monster'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { getRandomInt } from '../../utils/getRandomInt'

const DEFAULT_ATTACK = 6
const DEFAULT_XP = 30
const DEFAULT_LEVEL = 60
const DEFAULT_HP = 8

function getRandomIntRange(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default class GhostNightmare extends MonsterOligar {
  shapeFile = 'models/Ghost.glb'
  hoverText = 'Attack Nightmare Ghost!'
  minLuck = 100

  constructor() {
    super(DEFAULT_ATTACK, DEFAULT_XP, DEFAULT_LEVEL, DEFAULT_HP)
    this.initMonster()
    this.topOffSet = 2.25
  }

  onDropXp(): void {
    // player.levels.addXp(LEVEL_TYPES.ENEMY, 1)
    // player.levels.addXp(
    //     LEVEL_TYPES.PLAYER,
    //     getRandomIntRange(this.xp, this.xp + 10)
    // )
    // player.levels.addXp(LEVEL_TYPES.ENEMY, 1)
    // player.writeDataToServer()
  }

  onDropLoot(): void {
    // player.inventory.incrementItem(ITEM_TYPES.BONE, 1)
    // player.writeDataToServer()
    // log("on drop here")
  }

  setupAttackTriggerBox(): void {
    super.setupAttackTriggerBox()
  }

  create(): void {
    // const mons = new GhostNightmare()
    // engine.addEntity(mons)
  }

  loadTransformation(): void {
    const initialPosition = Vector3.create(
      getRandomIntRange(-2, 44),
      getRandomInt(9) + 43,
      getRandomIntRange(-22, 22)
    )
    const initialRotation = Quaternion.fromEulerDegrees(
      0,
      getRandomInt(10) / 10 + getRandomInt(4),
      0
    )
    Transform.createOrReplace(this.entity, {
      position: initialPosition,
      rotation: initialRotation
    })
  }
}
