import { bossGameLoop } from './BossGameLoop'

/**
 * BOSS TRIGGER SYSTEM
 *
 * Simple ways to start boss encounters
 */

/**
 * Start a boss encounter from console
 * Usage: startBossEncounter()
 */
export function startBossEncounter(): void {
  if (bossGameLoop.isBossEncounterActive()) {
    console.log('Boss encounter already active!')
    return
  }

  console.log('Starting boss encounter...')
  bossGameLoop.startBossEncounter()
}

/**
 * Check current boss encounter status
 * Usage: checkBossStatus()
 */
export function checkBossStatus(): void {
  const encounter = bossGameLoop.getCurrentEncounter()

  if (!encounter) {
    console.log('No boss encounter active')
    return
  }

  console.log('Boss Encounter Status:', {
    phase: encounter.phase,
    isActive: encounter.isActive,
    bossHealth: encounter.bossHealth,
    maxBossHealth: encounter.maxBossHealth,
    playerFighters: encounter.playerFighters.length,
    aliveFighters: encounter.playerFighters.filter((f) => !f.isDead).length
  })
}

/**
 * Add this to your game's UI to trigger boss encounters
 */
export function addBossTriggerButton(): void {
  // You can add this to your UI components
  console.log('Boss trigger button would be added here')
}
