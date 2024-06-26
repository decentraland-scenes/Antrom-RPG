import { GameController } from '../controllers/game.controller'
import Pig from '../enemies/pig'

let game: GameController | null = null

export function main(): void {
  game = new GameController()
  game.realmController.switchRealm('antrom')
  for (let i = 0; i < 6; i++) {
    let pig = new Pig()
  }
}
