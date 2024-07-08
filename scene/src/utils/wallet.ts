import { engine, PlayerIdentityData } from '@dcl/sdk/ecs'
import { waitNextTick } from './engine'

export async function waitUntilWalletIsConnected(): Promise<void> {
  while (PlayerIdentityData.getOrNull(engine.PlayerEntity) === null) {
    await waitNextTick()
  }
}
