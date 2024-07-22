import { type Sprite } from '../../utils/ui-utils'

// The player can have only SIX skills
export const PLAYER_SKILL_COUNT = 6
export type MaybeSkill = SkillController | undefined
export type PlayerSkill = [
  MaybeSkill,
  MaybeSkill,
  MaybeSkill,
  MaybeSkill,
  MaybeSkill,
  MaybeSkill
]

export type SkillDefinition = {
  cooldown: number
  name: string
  sprite: Sprite
  minLevel?: number
  description?: string
}

export type SkillState = {
  isCooling: boolean
  cooldownRemainingTime: number
}

export class SkillController {
  definition: SkillDefinition
  state: SkillState

  constructor(def: SkillDefinition) {
    this.definition = def
    this.state = {
      isCooling: false,
      cooldownRemainingTime: 0
    }
  }

  process(dt: number): void {
    if (this.state.isCooling) {
      this.state.cooldownRemainingTime -= dt
      if (this.state.cooldownRemainingTime <= 0) {
        this.state.isCooling = false
        this.state.cooldownRemainingTime = 0
      }
    }
  }

  trigger(): void {
    if (this.state.isCooling) {
      return
    }
    this.state.isCooling = true
    this.state.cooldownRemainingTime = this.definition.cooldown

    this.effect()
  }

  effect(): void {
    throw new Error('Effect not implemented')
  }
}
