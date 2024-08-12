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
          // setTimeout(() => {
          //   console.log('Unnequipped pet')
          //   unequipCompanion(companionName)
          // }, 8000)
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
export function unequipCompanion(companionName: string): void {
  const player = Player.getInstance()
  const petManager = player.petManager
  const petInstance = petManager.getPetInstance(companionName)

  if (petInstance != null) {
    petManager.removeInstance(companionName)
    console.log(`${companionName} has been unequipped.`)
  } else {
    console.log(`${companionName} is not equipped.`)
  }
}
