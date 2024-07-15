import { CreatePlayer, GetPlayerInfo } from '../api/api'
import { GameController } from '../controllers/game.controller'
import { isThereAnyGltfLoading, setPlayerPosition, waitNextTick } from '../utils/engine'

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

async function init(triedCreate: boolean = false): Promise<void> {
  const playerInfoResponse = await GetPlayerInfo()
  console.log({ playerInfoResponse })

  if (playerInfoResponse?.player !== null) {
    const player = playerInfoResponse.player
    console.log({ player })
  } else {
    console.log('player not found')
    if (!triedCreate) {
      await CreatePlayer(0, 1, 2)
      await init(true)
      return
    }
  }

  // Wait until every gltf is loaded
  while (isThereAnyGltfLoading()) {
    await waitNextTick()
  }

  // Initial position
  setPlayerPosition(-22.21, 5.43, -26.53)
  await waitNextTick()

  // UI
  gameInstance.uiController.playDungeonUI.setVisibility(true)
  gameInstance.uiController.loadingUI.finishLoading()
}
