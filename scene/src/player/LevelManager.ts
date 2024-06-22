export enum LEVEL_TYPES {
    PLAYER = 'player',
    TREE = 'tree', // Lumberjack
    GEM = 'gem', // Gemcutter
    KNOWLEDGE = 'knowledge', // Professor
    ROCK = 'rock', // Miner
    MEAT = 'meat', // Butcher
    ENEMY = 'enemy' // Assassin
  }
interface LevelItem {
    type: LEVEL_TYPES
    level: number
    xp: number
}

interface onUpdatePayload {
    type: LEVEL_TYPES
    level: number
    xp: number
    total: number
    levelChange: Boolean
}
export  class LevelManager {
    levels: Record<LEVEL_TYPES | string, LevelItem>

    public onUpdate?: (payload: onUpdatePayload) => void

    constructor() {
        this.levels = {}
    }

    static xpRequiredForNextLevel(level: number): number {
        return 500 * Math.pow(level, 2) - 500 * level + 1000
    }

    static getLabelText(name: string, level: number, xp: number): string {
        return `${name} Level: ${level} xp: ${xp}`
    }

    createOrUpdateLevelLabel(type: LEVEL_TYPES) : void{
        const { level, xp } = this.levels?.[type] || {}
        //Player.getInstance().uiCallback(type, level)
    }

    updateItem(type: LEVEL_TYPES, item: LevelItem): void {
        this.levels[type] = {
            ...(this.levels[type] || {}),
            ...item,
        }
        this.createOrUpdateLevelLabel(type)
    }

    static shouldLevelUp(level: number, xp: number): Boolean {
        return xp >= LevelManager.xpRequiredForNextLevel(level)
    }

    addXp(type: LEVEL_TYPES, xp: number): void {
        const currentXp = this.levels[type]?.xp || 0
        let newXp = xp + currentXp
        const currentLevel = this.levels[type]?.level || 1
        const shouldLevelUp = LevelManager.shouldLevelUp(currentLevel, newXp)
        const increaseBy = shouldLevelUp ? 1 : 0
        const newLevel = currentLevel + increaseBy

        this.updateItem(type, {
            level: newLevel,
            xp: newXp,
            type,
        })

        this.onUpdate?.({
            type: type,
            level: newLevel,
            xp: xp,
            total: newXp,
            levelChange: shouldLevelUp,
        })
       // TODO api
       // WriteXpToServer(type, newLevel, xp, newXp)
    }

    getXp(type: LEVEL_TYPES): number {
        return this.levels[type]?.xp || 0
    }

    getLevel(type: LEVEL_TYPES): number {
        return this.levels[type]?.level || 1
    }

    setLevel(type: LEVEL_TYPES, level: number, xp: number = 0): void {
        this.levels[type] = {
            type,
            level,
            xp,
        }
    }
}
export default LevelManager