import { createDragon } from '../pets/dragon'
import { createOwl } from '../pets/owl'
import { createPhoenix } from '../pets/phoenix'
import { Player } from '../player/player'

export function equipCompanion(companionName: string): void {
  if (Player.getInstance().petManager.getPetInstance(companionName) != null) {
    console.log('Pet already equipped!')
  } else {
    if (
      companionName !== null &&
      companionName !== undefined &&
      companionName.trim() !== ''
    ) {
      switch (companionName) {
        case 'Owl':
          createOwl()
          break
        case 'Phoenix':
          createPhoenix()
          break
        case 'Dragon':
          createDragon()
      }
    }
  }
}
