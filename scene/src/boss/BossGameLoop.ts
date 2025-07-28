import { Vector3 } from '@dcl/sdk/math'
import { Player } from '../player/player'
import { LEVEL_TYPES } from '../player/LevelManager'
import { ITEM_TYPES } from '../inventory/playerInventoryMap'
import Boss from '../enemies/Boss'
import { Fighter } from '../units/Fighter'
import * as utils from '@dcl-sdk/utils'

/**
 * BOSS GAME LOOP SYSTEM
 *
 * This creates a complete boss encounter system with:
 * - Boss spawning and scaling
 * - Player preparation phase
 * - Combat phase
 * - Rewards and progression
 */

export interface BossEncounter {
  boss: Boss
  isActive: boolean
  phase: 'preparation' | 'combat' | 'victory' | 'defeat'
  startTime: number
  playerFighters: Fighter[]
  bossHealth: number
  maxBossHealth: number
}

export class BossGameLoop {
  private currentEncounter: BossEncounter | null = null
  private bossSpawnPosition = Vector3.create(-49.63, 5.89, -16.95)
  private preparationTime = 30000 // 30 seconds to prepare
  private combatTimeout = 300000 // 5 minutes max combat time

  /**
   * Start a new boss encounter
   */
  public startBossEncounter(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    // Calculate boss stats based on player level
    const playerLevel = player.levels.getLevel(LEVEL_TYPES.PLAYER)
    const bossLevel = Math.max(1, playerLevel - 5) // Boss is 5 levels below player

    console.log(
      `Starting boss encounter - Player Level: ${playerLevel}, Boss Level: ${bossLevel}`
    )

    // Create boss with scaled stats
    const boss = new Boss()

    // Scale boss stats based on player level
    boss.health = 200 + bossLevel * 50
    boss.maxHealth = boss.health
    boss.attack = 25 + bossLevel * 5

    this.currentEncounter = {
      boss,
      isActive: true,
      phase: 'preparation',
      startTime: Date.now(),
      playerFighters: [],
      bossHealth: boss.health,
      maxBossHealth: boss.health
    }

    // Display preparation announcement
    player.gameController.uiController.displayAnnouncement(
      `BOSS ENCOUNTER STARTED! Prepare your fighters!`,
      { r: 1, g: 0.5, b: 0, a: 1 }, // Orange
      5000
    )

    // Start preparation phase
    this.startPreparationPhase()
  }

  /**
   * Preparation phase - players can place fighters
   */
  private startPreparationPhase(): void {
    if (!this.currentEncounter) return

    console.log('Boss encounter: Starting preparation phase')

    // Give players time to prepare
    utils.timers.setTimeout(() => {
      this.startCombatPhase()
    }, this.preparationTime)

    // Show countdown
    this.showPreparationCountdown()
  }

  /**
   * Combat phase - boss vs fighters
   */
  private startCombatPhase(): void {
    if (!this.currentEncounter) return

    this.currentEncounter.phase = 'combat'
    console.log('Boss encounter: Starting combat phase')

    const player = Player.getInstanceOrNull()
    if (!player) return

    // Get all player fighters
    this.currentEncounter.playerFighters = player.fighters || []

    player.gameController.uiController.displayAnnouncement(
      `COMBAT BEGINS! Boss vs ${this.currentEncounter.playerFighters.length} fighters!`,
      { r: 1, g: 0, b: 0, a: 1 }, // Red
      3000
    )

    // Start combat monitoring
    this.monitorCombat()
  }

  /**
   * Monitor the combat progress
   */
  private monitorCombat(): void {
    if (!this.currentEncounter || this.currentEncounter.phase !== 'combat')
      return

    const encounter = this.currentEncounter
    const currentTime = Date.now()
    const combatDuration = currentTime - encounter.startTime

    // Check for timeout
    if (combatDuration > this.combatTimeout) {
      this.endBossEncounter('defeat', 'Combat timeout - Boss wins!')
      return
    }

    // Check boss health
    if (encounter.boss.health <= 0) {
      this.endBossEncounter('victory', 'Boss defeated!')
      return
    }

    // Check if all fighters are dead
    const aliveFighters = encounter.playerFighters.filter(
      (fighter) => !fighter.isDead
    )
    if (aliveFighters.length === 0) {
      this.endBossEncounter('defeat', 'All fighters defeated!')
      return
    }

    // Update boss health tracking
    encounter.bossHealth = encounter.boss.health

    // Continue monitoring
    utils.timers.setTimeout(() => this.monitorCombat(), 1000)
  }

  /**
   * End the boss encounter
   */
  private endBossEncounter(
    result: 'victory' | 'defeat',
    message: string
  ): void {
    if (!this.currentEncounter) return

    this.currentEncounter.phase = result
    this.currentEncounter.isActive = false

    const player = Player.getInstanceOrNull()
    if (!player) return

    console.log(`Boss encounter ended: ${result}`)

    if (result === 'victory') {
      this.handleVictory(player)
    } else {
      this.handleDefeat(player)
    }

    player.gameController.uiController.displayAnnouncement(
      message,
      result === 'victory'
        ? { r: 0, g: 1, b: 0, a: 1 }
        : { r: 1, g: 0, b: 0, a: 1 },
      5000
    )

    // Clean up after delay
    utils.timers.setTimeout(() => {
      this.cleanupEncounter()
    }, 10000) // 10 seconds to show results
  }

  /**
   * Handle victory rewards
   */
  private handleVictory(player: Player): void {
    const encounter = this.currentEncounter!
    const playerLevel = player.levels.getLevel(LEVEL_TYPES.PLAYER)

    // Calculate rewards based on boss level and player performance
    const baseXP = 50 + playerLevel * 10
    const baseCoins = 25 + playerLevel * 5
    const baseAssassinXP = 10 + playerLevel * 2

    // Bonus for quick victory
    const combatDuration = Date.now() - encounter.startTime
    const timeBonus = Math.max(1, 3 - combatDuration / 60000) // Bonus for quick kills

    const finalXP = Math.floor(baseXP * timeBonus)
    const finalCoins = Math.floor(baseCoins * timeBonus)
    const finalAssassinXP = Math.floor(baseAssassinXP * timeBonus)

    // Award rewards
    player.levels.addXp(LEVEL_TYPES.PLAYER, finalXP)
    player.levels.addXp(LEVEL_TYPES.ENEMY, finalAssassinXP)
    player.inventory.incrementItem(ITEM_TYPES.COIN, finalCoins)

    console.log(
      `Boss victory rewards: ${finalXP} Player XP, ${finalAssassinXP} Assassin XP, ${finalCoins} Coins`
    )

    // Show reward announcement
    player.gameController.uiController.displayAnnouncement(
      `VICTORY! +${finalXP} Player XP +${finalAssassinXP} Assassin XP +${finalCoins} Coins`,
      { r: 0, g: 1, b: 0, a: 1 },
      5000
    )
  }

  /**
   * Handle defeat consequences
   */
  private handleDefeat(player: Player): void {
    console.log('Boss encounter: Player defeated')

    // Small consolation reward for trying
    const consolationXP = 5
    const consolationCoins = 2

    player.levels.addXp(LEVEL_TYPES.PLAYER, consolationXP)
    player.inventory.incrementItem(ITEM_TYPES.COIN, consolationCoins)

    player.gameController.uiController.displayAnnouncement(
      `Defeat! But you gained +${consolationXP} XP +${consolationCoins} Coins for trying`,
      { r: 1, g: 1, b: 0, a: 1 }, // Yellow
      5000
    )
  }

  /**
   * Clean up the encounter
   */
  private cleanupEncounter(): void {
    if (!this.currentEncounter) return

    // Remove boss entity
    try {
      // Boss doesn't have a remove method, so we'll just set it as dead
      this.currentEncounter.boss.isDead = true
    } catch (error) {
      console.log('Error removing boss entity:', error)
    }

    this.currentEncounter = null
    console.log('Boss encounter cleaned up')
  }

  /**
   * Show preparation countdown
   */
  private showPreparationCountdown(): void {
    if (!this.currentEncounter) return

    const player = Player.getInstanceOrNull()
    if (!player) return

    let timeLeft = this.preparationTime / 1000

    const showCountdown = () => {
      if (
        !this.currentEncounter ||
        this.currentEncounter.phase !== 'preparation'
      ) {
        return
      }

      timeLeft--

      if (timeLeft > 0) {
        player.gameController.uiController.displayAnnouncement(
          `Prepare your fighters! ${timeLeft}s remaining`,
          { r: 1, g: 1, b: 0, a: 1 }, // Yellow
          1000
        )
        utils.timers.setTimeout(showCountdown, 1000)
      }
    }

    utils.timers.setTimeout(showCountdown, 1000)
  }

  /**
   * Get current encounter status
   */
  public getCurrentEncounter(): BossEncounter | null {
    return this.currentEncounter
  }

  /**
   * Check if boss encounter is active
   */
  public isBossEncounterActive(): boolean {
    return this.currentEncounter?.isActive || false
  }

  /**
   * Get boss spawn position
   */
  public getBossSpawnPosition(): Vector3 {
    return this.bossSpawnPosition
  }
}

// Global boss game loop instance
export const bossGameLoop = new BossGameLoop()
