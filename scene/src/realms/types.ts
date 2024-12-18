import { type Vector3 } from '@dcl/sdk/math'

// export type DifficultyType = 'easy' | 'medium' | 'hard' | 'nightmare'

export type RealmType =
  | 'antrom'
  | 'demonKingDungeon'
  | 'dungeon'
  | 'dungeonBase'
  | 'minersCave'

export type Realm = {
  getId: () => RealmType
  removeAllEntities: () => void
  removeSingleEntity?: (entityName: string) => void
  spawnSingleEntity: (entityName: string) => void
  /**
   * @returns the position where the player should be placed when they die
   */
  deadPosition: () => Vector3 | null
}
