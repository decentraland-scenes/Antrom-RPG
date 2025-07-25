import { setPlayerPosition } from '../utils/engine'
import { setCurrentActiveScene } from '../instances'
import { Player } from './player'

export function backToAntromFromCave(): void {
  // Get the game instance from the player
  const player = Player.getInstance()

  // Switch to Antrom realm
  player.gameController.realmController.switchRealm('antrom', 'easy')
  setCurrentActiveScene('antrom')

  // Teleport player to Antrom spawn point
  setPlayerPosition(-22.21, 5.43, -26.53)
}
