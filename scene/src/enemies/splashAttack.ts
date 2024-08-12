import { engine } from '@dcl/sdk/ecs'
import {} from '@dcl/sdk/math'
import { type GenericMonster } from './monsterGeneric'

export const CurrentlyAttackingMonster = engine.defineComponent(
  'attackingMonster',
  {}
)
export function AttackingMonster(): void {
  console.log(currentlyAttackingMontserList.length)
}
export const currentlyAttackingMontserList: GenericMonster[] = []
