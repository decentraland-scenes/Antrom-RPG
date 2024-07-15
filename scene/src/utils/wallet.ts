import { engine, PlayerIdentityData } from '@dcl/sdk/ecs'
import { getPlayer } from '@dcl/sdk/src/players'
import { waitNextTick } from './engine'

export async function waitUntilWalletIsConnected(): Promise<void> {
  while (PlayerIdentityData.getOrNull(engine.PlayerEntity) === null) {
    await waitNextTick()
  }
}

export async function ensurePlayer(): Promise<
  Exclude<ReturnType<typeof getPlayer>, null>
> {
  let player = getPlayer()
  if (player !== null) return player

  do {
    await waitNextTick()
    player = getPlayer()
  } while (player === null)

  return player
}
