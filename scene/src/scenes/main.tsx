import { Color4 } from '@dcl/sdk/math'
import { GetPlayerInfo } from '../api/api'
import { GameController } from '../controllers/game.controller'
import {
  isThereAnyGltfLoading,
  setPlayerPosition,
  waitNextTick
} from '../utils/engine'

let gameInstance: GameController

export function main(): void {
  gameInstance = new GameController()
  gameInstance.uiController.loadingUI.startLoading()
  gameInstance.realmController.switchRealm('antrom')

  init().catch((e) => {
    console.error('Fatal error during init')
    console.error(e)
  })
}

async function init(): Promise<void> {
  let playerInfoResponse = await GetPlayerInfo()
  const shouldCreatePlayer = !(playerInfoResponse?.player !== null)

  // Wait until every gltf is loaded
  while (isThereAnyGltfLoading()) {
    await waitNextTick()
  }

  // Initial position
  setPlayerPosition(-22.21, 5.43, -26.53)
  await waitNextTick()

  // UI
  gameInstance.uiController.loadingUI.finishLoading()
  if (shouldCreatePlayer) {
    const result = await gameInstance.uiController.startPlayerCreation()
    playerInfoResponse = await GetPlayerInfo()

    const failedCreation = !(playerInfoResponse?.player !== null)
    if (failedCreation) {
      gameInstance.uiController.displayAnnouncement(
        'Player creation failed',
        Color4.Red(),
        5
      )
      await init()
      return
    }

    if (result.tutorial) {
      // TODO: assign first quest
    }
  }

  // TODO: load player data

  gameInstance.uiController.playDungeonUI.setVisibility(true)
}
