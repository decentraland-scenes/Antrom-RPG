import { GameController } from '../controllers/game.controller'
import Pig from '../enemies/pig'

let game: GameController | null = null

export function main(): void {
  game = new GameController()
  game.realmController.switchRealm('antrom')
}
