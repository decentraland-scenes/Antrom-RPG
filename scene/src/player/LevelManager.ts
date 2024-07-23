import { WriteXpToServer } from '../api/api'

export enum LEVEL_TYPES {
  PLAYER = 'player',
  TREE = 'tree', // Lumberjack
  GEM = 'gem', // Gemcutter
  KNOWLEDGE = 'knowledge', // Professor
  ROCK = 'rock', // Miner
  MEAT = 'meat', // Butcher
  ENEMY = 'enemy' // Assassin
}

export type LevelItem = {
  type: LEVEL_TYPES
  level: number
  // This value is the accumulated experience points across all levels
  xp: number
}

export type onUpdatePayload = {
  type: LEVEL_TYPES
  level: number
  xp: number
  total: number
  levelChange: boolean
}

export class LevelManager {
  levels: Record<LEVEL_TYPES, LevelItem>

  public onUpdate?: (payload: onUpdatePayload) => void

  constructor() {
    this.levels = {
      [LEVEL_TYPES.PLAYER]: {
        type: LEVEL_TYPES.PLAYER,
        level: 1,
        xp: 0
      },
      [LEVEL_TYPES.TREE]: {
        type: LEVEL_TYPES.TREE,
        level: 1,
        xp: 0
      },
      [LEVEL_TYPES.GEM]: {
        type: LEVEL_TYPES.GEM,
        level: 1,
        xp: 0
      },
      [LEVEL_TYPES.KNOWLEDGE]: {
        type: LEVEL_TYPES.KNOWLEDGE,
        level: 1,
        xp: 0
      },
      [LEVEL_TYPES.ROCK]: {
        type: LEVEL_TYPES.ROCK,
        level: 1,
        xp: 0
      },
      [LEVEL_TYPES.MEAT]: {
        type: LEVEL_TYPES.MEAT,
        level: 1,
        xp: 0
      },
      [LEVEL_TYPES.ENEMY]: {
        type: LEVEL_TYPES.ENEMY,
        level: 1,
        xp: 0
      }
    }
  }

  static xpRequiredForNextLevel(level: number): number {
    if (level === 0) return 0
    return 500 * (level * level - level + 2)
  }

  updateItem(type: LEVEL_TYPES, item: LevelItem): void {
    this.levels[type] = {
      ...this.levels[type],
      ...item
    }
  }

  static shouldLevelUp(level: number, xp: number): boolean {
    return xp >= LevelManager.xpRequiredForNextLevel(level)
  }

  addXp(type: LEVEL_TYPES, xp: number): void {
    const currentXp = this.levels[type]?.xp ?? 0
    const newXp = xp + currentXp
    const currentLevel = this.levels[type]?.level ?? 1
    const shouldLevelUp = LevelManager.shouldLevelUp(currentLevel, newXp)
    const increaseBy = shouldLevelUp ? 1 : 0
    const newLevel = currentLevel + increaseBy

    this.updateItem(type, {
      level: newLevel,
      xp: newXp,
      type
    })

    this.onUpdate?.({
      type,
      level: newLevel,
      xp,
      total: newXp,
      levelChange: shouldLevelUp
    })

    WriteXpToServer(type, newLevel, xp, newXp).catch(console.error)
  }

  getXpThisLevel(type: LEVEL_TYPES): number {
    const currentLevel = this.getLevel(type)
    const currentXp = this.getXp(type)
    const previousLevelXp = LevelManager.xpRequiredForNextLevel(
      currentLevel - 1
    )
    return currentXp - previousLevelXp
  }

  getXpNeededThisLevel(type: LEVEL_TYPES): number {
    const currentLevel = this.getLevel(type)
    const previousLevelXp = LevelManager.xpRequiredForNextLevel(
      currentLevel - 1
    )
    const neededLevelXp = LevelManager.xpRequiredForNextLevel(currentLevel)
    return neededLevelXp - previousLevelXp
  }

  getXp(type: LEVEL_TYPES): number {
    return this.getLevelItem(type).xp
  }

  getLevel(type: LEVEL_TYPES): number {
    return this.getLevelItem(type).level
  }

  private getLevelItem(type: LEVEL_TYPES): LevelItem {
    return this.levels[type] ?? { type, level: 1, xp: 0 }
  }

  setLevel(type: LEVEL_TYPES, level: number, xp: number = 0): void {
    this.levels[type] = {
      type,
      level,
      xp
    }
  }
}
export default LevelManager
