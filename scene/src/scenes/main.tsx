import { GameController } from '../controllers/game.controller'

let game: GameController | null = null

export function main(): void {
  game = new GameController()
  game.realmController.switchRealm('antrom')
}
