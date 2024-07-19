import { Quaternion, Vector3 } from '@dcl/sdk/math'
import MonsterOligar from '../monster'
import { getRandomInt, getRandomIntRange } from '../../utils/getRandomInt'
import { Transform } from '@dcl/sdk/ecs'

const DEFAULT_ATTACK = 3
const DEFAULT_XP = 30
const DEFAULT_LEVEL = 60
const DEFAULT_HP = 8

export default class GhostE extends MonsterOligar {
  shapeFile = 'assets/models/Ghost.glb'
  hoverText = 'Attack Ghost!'
  minLuck = 100

  constructor() {
    super(DEFAULT_ATTACK, DEFAULT_XP, DEFAULT_LEVEL, DEFAULT_HP)
    this.initMonster()
    this.setTopOffset(2.25)
    // # in %
    this.dropRate = 100
  }

  onDropXp(): void {}

  onDropLoot(): void {}

  setupAttackTriggerBox(): void {
    super.setupAttackTriggerBox()
  }

  create(): void {}

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
